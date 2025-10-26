"use client";

import { useState, useEffect } from "react";
import PubNub from "pubnub";
import { v4 as uuidv4 } from "uuid";

export default function Chat({ params }: { params: { channel: string } }) {
  const [messages, setMessages] = useState<{ text: string }[]>([]);
  const [text, setText] = useState("");
  const channel = params.channel;

  useEffect(() => {
    const pn = new PubNub({
      publishKey: process.env.NEXT_PUBLIC_PUBNUB_PUBLISH_KEY!,
      subscribeKey: process.env.NEXT_PUBLIC_PUBNUB_SUBSCRIBE_KEY!,
      uuid: uuidv4(),
    });
    pn.addListener({
      message: (m) => {
        setMessages((prev) => [...prev, m.message]);
      },
    });
    pn.subscribe({ channels: [channel] });
    return () => pn.unsubscribeAll();
  }, [channel]);

  const handleSend = () => {
    const pn = new PubNub({
      publishKey: process.env.NEXT_PUBLIC_PUBNUB_PUBLISH_KEY!,
      subscribeKey: process.env.NEXT_PUBLIC_PUBNUB_SUBSCRIBE_KEY!,
      uuid: uuidv4(),
    });
    if (text) {
      pn.publish({ channel, message: { text } });
      setText("");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="glass-card p-6 md:p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4">Chat</h1>
        <div className="h-64 overflow-y-auto mb-4 border border-gray-300 p-2 rounded-md bg-white/50">
          {messages.map((msg, i) => (
            <p key={i} className="text-gray-800">{msg.text}</p>
          ))}
        </div>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="input mb-4"
          placeholder="Type a message..."
        />
        <button onClick={handleSend} className="btn bg-purple-500 hover:bg-purple-600 w-full">
          Send
        </button>
      </div>
    </main>
  );
}
