"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Subscription failed");

      const data = await res.json();
      setStatus("success");
      setMessage("🎉 You’ve been subscribed successfully!");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-2xl border border-[#3f79ff]/30 bg-[#09111f] p-6 shadow-lg transition-all duration-300 hover:shadow-[#3f79ff]/30">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-[#ca6678] to-[#fcbf5b] bg-clip-text text-transparent text-center">
        Join Our Newsletter
      </h2>
      <p className="text-sm text-[#c0ccda] text-center mt-2">
        Get automation tips and n8n tutorials straight to your inbox.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#fcbf5b] mb-1"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-[#1c2a40] bg-[#0f1b30] p-3 text-sm text-gray-200 outline-none transition focus:border-[#3f79ff]"
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-lg bg-gradient-to-r from-[#ca6678] to-[#fcbf5b] py-2.5 font-semibold text-[#09111f] transition hover:opacity-90 disabled:opacity-50"
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-3 text-center text-sm ${
            status === "success" ? "text-green-400" : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
