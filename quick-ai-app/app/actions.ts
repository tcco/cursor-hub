"use server";

import { action } from "next-safe-action";
import OpenAI from "openai";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export const queryGroq = async (prompt: string) => {
    try {
        console.log('Prompt:', prompt);
      // Make a request to the chat completions endpoint
      const response = await openai.chat.completions.create({
        model: 'llama3-8b-8192',  // You can use a different model if needed
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,  // Adjust max_tokens as needed
      });
  
      // Log the response
      console.log('Response:', response.choices[0].message.content);
      return { response: response.choices[0].message.content };
    } catch (error) {
      console.error('Error:', error);
      return { error: error };
  }
};