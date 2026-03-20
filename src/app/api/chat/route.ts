import Anthropic from "@anthropic-ai/sdk";
import { CHAT_SYSTEM_PROMPT } from "@/lib/chat-context";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response("Invalid messages", { status: 400 });
    }

    // Sanitize messages to only allow user/assistant roles with string content
    const sanitized: Anthropic.MessageParam[] = messages
      .filter(
        (m) =>
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.trim().length > 0
      )
      .slice(-20) // cap history at 20 turns
      .map((m) => ({ role: m.role, content: m.content.trim() }));

    if (sanitized.length === 0 || sanitized[0].role !== "user") {
      return new Response("Invalid message sequence", { status: 400 });
    }

    const stream = client.messages.stream({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      system: CHAT_SYSTEM_PROMPT,
      messages: sanitized,
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
        } catch {
          controller.error("Stream error");
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Internal server error", { status: 500 });
  }
}
