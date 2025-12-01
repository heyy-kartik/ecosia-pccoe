import { NextResponse } from "next/server";
import { groq } from "@/lib/groqClient";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192", // Fast model for speed
      messages: [
        {
          role: "system",
          content:
            "You are an autocomplete engine. Provide 3 short, concise phrases to complete the user's text. Return JSON with a 'suggestions' array.",
        },
        {
          role: "user",
          content: `Text: "${text}"`,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 100,
    });

    const data = JSON.parse(completion.choices[0].message.content || "{}");
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get suggestions" },
      { status: 500 }
    );
  }
}
