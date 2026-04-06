import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(request: Request) {
  try {
    const { code, context } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "No code provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY not configured. Add it to your .env.local file." },
        { status: 500 }
      );
    }

    const groq = new Groq({ apiKey });

    const systemPrompt = `You are a senior JavaScript developer and code reviewer. Analyze the given JavaScript code and provide a clear, concise explanation. Focus on:

1. What the code does (high-level summary)
2. How events flow (if any event listeners)
3. DOM changes that occur
4. Potential issues or improvements
5. How the state changes

Keep your response concise (under 300 words). Use plain language that a developer would appreciate. Format with clear sections using headers.`;

    const userPrompt = `Analyze this JavaScript code:

\`\`\`javascript
${code}
\`\`\`

${context?.bugs?.length > 0 ? `\nDetected issues: ${context.bugs.join(", ")}` : ""}
${context?.suggestions?.length > 0 ? `\nSuggestions flag: ${context.suggestions.join(", ")}` : ""}

Provide a developer-friendly explanation of what this code does, its event flow, DOM manipulations, and any insights.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 500,
    });

    const explanation =
      completion.choices[0]?.message?.content || "Unable to generate explanation.";

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error("AI explain error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate AI explanation",
      },
      { status: 500 }
    );
  }
}
