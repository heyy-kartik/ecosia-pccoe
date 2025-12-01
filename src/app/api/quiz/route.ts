import { NextResponse  } from "next/server";
import { groq } from "@/lib/groqClient";

export async function POST(req: Request) {
  try {
    const { topic, difficulty } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192", // Smart model for logic
      messages: [
        {
          role: "system",
          content: `You are a quiz engine. Output valid JSON only. 
                    Return an object with a 'questions' array. 
                    Each question must have: 'id', 'questionText', 'options' (array of 4 strings), and 'correctAnswerIndex' (0-3 number).`,
        },
        {
          role: "user",
          content: `Create a ${
            difficulty || "medium"
          } difficulty quiz about: ${topic}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const quizData = JSON.parse(completion.choices[0].message.content || "{}");

    return NextResponse.json(quizData);
  } catch (error) {
    console.error("Quiz generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz" },
      { status: 500 }
    );
  }
}
