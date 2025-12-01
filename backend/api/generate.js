import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST method allowed" });
    }

    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const client = new GoogleGenerativeAI(apiKey);

    const model = client.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const output = result.response.text();

    res.status(200).json({ success: true, output });
  } catch (err) {
    console.error("Gemini ERROR:", err);
    res.status(500).json({ error: "Server Error" });
  }
}
