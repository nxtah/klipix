import OpenAI from "openai"

export async function generateContent(prompt: string) {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set in environment variables.")
  }

  const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey,
  })

  const result = await client.chat.completions.create({
    model: "openrouter/free",
    messages: [{ role: "user", content: prompt }],
  })

  return result.choices[0]?.message?.content ?? ""
}
