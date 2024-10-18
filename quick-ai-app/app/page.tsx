"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { queryGroq } from "./actions";

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("executing");
    try {
      const result = await queryGroq(input);
      console.log("Result:", result);
      if (result.response) {
        setResponse(result.response);
      } else if (result.error) {
        setResponse(`Error: ${result.error}`);
      }
    } catch (error) {
      setResponse(`Error: ${error.message}`);
    } finally {
      setStatus("idle");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        AI Query Interface
      </h1>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl mb-8">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your query here..."
          className="w-full p-2 border border-gray-300 rounded-md mb-4 h-32"
        />
        <button
          type="submit"
          disabled={status === "executing"}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          {status === "executing" ? "Processing..." : "Submit Query"}
        </button>
      </form>

      {response && (
        <div className="w-full max-w-2xl bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Response:</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{response}</p>
        </div>
      )}
    </div>
  );
}
