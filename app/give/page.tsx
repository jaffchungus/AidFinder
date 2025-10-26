"use client";

import { useState, useEffect } from "react";
import PubNub from "pubnub";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

export default function Give() {
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [aidType, setAidType] = useState("");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [giverId, setGiverId] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (submitted && giverId) {
      const pn = new PubNub({
        subscribeKey: process.env.NEXT_PUBLIC_PUBNUB_SUBSCRIBE_KEY!,
        uuid: giverId,
      });
      pn.addListener({
        message: (m) => {
          if (m.channel === `match-${giverId}` && m.message.type === "match") {
            router.push(`/chat/${m.message.chatChannel}`);
          }
        },
      });
      pn.subscribe({ channels: [`match-${giverId}`] });
      return () => pn.unsubscribeAll();
    }
  }, [submitted, giverId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = uuidv4();
    setGiverId(id);
    await fetch("/api/submit-give", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ giverId: id, city, zip, aidType, details }),
    });
    setSubmitted(true);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="glass-card p-6 md:p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">I Can Help</h1>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="input"
              required
            />
            <input
              type="text"
              placeholder="ZIP"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              className="input"
              required
            />
            <select
              value={aidType}
              onChange={(e) => setAidType(e.target.value)}
              className="input"
              required
            >
              <option value="">Select Aid Type</option>
              <option value="food">Food</option>
              <option value="shelter">Shelter</option>
              <option value="other">Other</option>
            </select>
            <textarea
              placeholder="Details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="input h-24"
              required
            />
            <button type="submit" className="btn bg-indigo-500 hover:bg-indigo-600 w-full">
              Register Offering
            </button>
          </form>
        ) : (
          <p className="text-center text-gray-800">Waiting for matches... (Refresh clears this for demo privacy)</p>
        )}
      </div>
    </main>
  );
}
