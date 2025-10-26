"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function Need() {
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [aidType, setAidType] = useState("");
  const [details, setDetails] = useState("");
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const receiverId = uuidv4();
    const res = await fetch("/api/submit-need", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId, city, zip, aidType, details }),
    });
    const data = await res.json();
    if (data.match) {
      router.push(`/chat/${data.chatChannel}`);
    } else {
      setRecommendations(data.recommendations || []);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="glass-card p-6 md:p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">I Need Help</h1>
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
          <button type="submit" className="btn bg-blue-500 hover:bg-blue-600 w-full">
            Submit
          </button>
        </form>
        {recommendations.length > 0 && (
          <div className="mt-6 md:mt-8">
            <h2 className="text-xl font-bold mb-4">Recommended Organizations</h2>
            <ul className="space-y-2">
              {recommendations.map((org, i) => (
                <li key={i} className="text-gray-800">
                  {org.name} - {org.address}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
