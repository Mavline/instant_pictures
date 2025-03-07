import Replicate from "replicate";
import { z } from "zod";
import { headers } from "next/headers";

// Commented out unused imports to fix ESLint errors
// import { Ratelimit } from "@upstash/ratelimit";
// import { Redis } from "@upstash/redis";

export const runtime = "edge";

const apiSchema = z.object({
  prompt: z.string().min(1).max(1000),
  style: z.string().optional(),
  seed: z.number().int().optional(),
  apiKey: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    // Get API key either from request or environment variable
    const body = await req.json();
    const parsedBody = apiSchema.safeParse(body);

    if (!parsedBody.success) {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
      });
    }

    const { prompt, style, seed, apiKey } = parsedBody.data;

    // Use provided API key or fall back to environment variable
    const token = apiKey || process.env.REPLICATE_API_TOKEN;

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Missing Replicate API token" }),
        { status: 401 }
      );
    }

    const replicate = new Replicate({
      auth: token,
    });

    // Create a prompt with the style if provided
    const fullPrompt = style 
      ? `${prompt} Style: ${style}` 
      : prompt;

    const output = await replicate.run(
      "stability-ai/sdxl:8beff3369e81422112d93b89ca01426147c542da798112cf986b724c9977502f",
      {
        input: {
          prompt: fullPrompt,
          seed: seed || Math.floor(Math.random() * 1000000),
          num_outputs: 1,
        },
      }
    );

    return new Response(JSON.stringify({ images: output }), {
      status: 200,
    });
  } catch (error: any) {
    console.error("Error generating images:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to generate images" }),
      { status: 500 }
    );
  }
}

// Helper function to get IP address (commented out to fix ESLint errors)
// function getIPAddress(req: Request) {
//   const headersList = headers();
//   return headersList.get("x-forwarded-for") || "unknown";
// }