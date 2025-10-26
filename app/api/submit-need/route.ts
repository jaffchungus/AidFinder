import { NextResponse } from "next/server";
import db from "../../../lib/db";
import { v4 as uuidv4 } from "uuid";
import PubNub from "pubnub";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import * as cheerio from "cheerio";

async function scrapeRecommendations(aidType: string, city: string, zip: string) {
  let url = "";
  let selector = "";
  if (aidType === "food") {
    url = `https://www.foodpantries.org/ci/${city.toLowerCase().replace(/ /g, "-")}`;
    selector = ".pantry"; // Example selector; inspect site for actual
  } else if (aidType === "shelter") {
    url = `https://www.shelterlistings.org/city/${city.toLowerCase().replace(/ /g, "-")}-ny.html`;
    selector = ".listing"; // Example
  } else {
    url = `https://www.findhelp.org/search/text?term=${encodeURIComponent(aidType)}&postal=${zip}`;
    selector = "article"; // Example
  }

  try {
    const { data } = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    const $ = cheerio.load(data);
    const orgs: { name: string; address: string }[] = [];
    $(selector).slice(0, 5).each((i, el) => {
      const name = $(el).find("h3, h2").text().trim() || "Unknown";
      const address = $(el).find("p.address, .address").text().trim() || "No address";
      if (name) orgs.push({ name, address });
    });
    return orgs;
  } catch (error) {
    console.error("Scraping error:", error);
    return [];
  }
}

export async function POST(request: Request) {
  const { receiverId, city, zip, aidType, details } = await request.json();
  await db.read();

  const matchGiver = db.data.givers.find(
    (g) => g.aidType === aidType && (g.city.toLowerCase() === city.toLowerCase() || g.zip === zip)
  );

  if (matchGiver) {
    const chatChannel = uuidv4();
    const pubnub = new PubNub({
      publishKey: process.env.PUBNUB_PUBLISH_KEY!,
      subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY!,
    });
    await pubnub.publish({
      channel: `match-${matchGiver.giverId}`,
      message: { type: "match", chatChannel },
    });
    // For demo, don't remove giver
    return NextResponse.json({ match: true, chatChannel });
  } else {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    const prompt = `Classify and summarize this need for aid organization search: Type: ${aidType}, Details: ${details}, City: ${city}, ZIP: ${zip}. Provide refined search terms.`;
    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();
    // Use aiResponse to refine, but for simplicity, use original
    console.log("AI Response:", aiResponse); // For debugging
    const recommendations = await scrapeRecommendations(aidType, city, zip);
    return NextResponse.json({ match: false, recommendations });
  }
}
