import { NextResponse } from "next/server";
import db from "../../../lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  await db.read();
  db.data.givers.push(body);
  await db.write();
  return NextResponse.json({ success: true });
}
