import Replicate from "replicate";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

let ratelimit: Ratelimit | undefined;

// Add rate limiting if Upstash API keys are set, otherwise skip
/* Временно отключено для разработки
if (process.env.UPSTASH_REDIS_REST_URL) {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    // Allow 5 requests per day (~1 prompt), then need to use API key
    limiter: Ratelimit.fixedWindow(5, "1440 m"),
    analytics: true,
    prefix: "blinkshot",
  });
}
*/

export async function POST(req: Request) {
  let json = await req.json();
  let { prompt, userAPIKey, iterativeMode, style } = z
    .object({
      prompt: z.string(),
      iterativeMode: z.boolean(),
      userAPIKey: z.string().optional(),
      style: z.string().optional(),
    })
    .parse(json);

  // Используем правильную конфигурацию Replicate
  const replicate = new Replicate({
    auth: userAPIKey || process.env.REPLICATE_API_TOKEN,
  });

  /* Временно отключено для разработки
  if (ratelimit && !userAPIKey) {
    const identifier = getIPAddress();

    const { success } = await ratelimit.limit(identifier);
    if (!success) {
      return Response.json(
        "No requests left. Please add your own API key or try again in 24h.",
        {
          status: 429,
        },
      );
    }
  }
  */

  if (style) {
    prompt += `. Use a ${style} style for the image.`;
  }

  try {
    // Запускаем генерацию с FLUX Schnell
    const input = {
      prompt: prompt,
      width: 1024,
      height: 768,
      seed: iterativeMode ? 123 : undefined,
      steps: 3  // Важно! Это очень быстрая модель с всего 3 шагами
    };

    console.log("Sending request to Replicate with input:", input);

    let output;
    try {
      output = await replicate.run(
        "black-forest-labs/flux-schnell", 
        { input }
      );
    } catch (replicateError: any) {
      console.error("Error from Replicate:", replicateError);
      
      // Проверяем ошибку на наличие NSFW контента
      if (replicateError.toString().includes("NSFW content")) {
        // Base64 заглушка - простой квадрат с текстом
        const placeholder = "iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVMQEAIAzAMMC/5+GiHCQKenXPzCzW3Y5A4gNIGkDSAJIGkDSApAEkDSBpAEkDSBpA0gCSBpA0gKQBJA0gaQBJA0gaQNIAkgaQNICkASQNIGkASQNIGkDSAJIGkDSApAEkDSBpAEkDSBpA0gCSBpA0gKQBJA0gaQBJA0gaQNIAkgaQNICkASQNIGkASQNIGkDSAJIGkDSApAEkDSBpAEkDSBpA0gCSBpA0gKQBJA0gaQBJA0gaQNIAkgaQNICkASQNIGkASQNIGkDSAJIGkDSApAEkDSBpAEkDSBpA0gCSBpA0gKQBJA0gaQBJA0gaQNIAkgaQNICkASQNIGkASQNIGkDSAJIGkDSApAEkDSBpAEkDSBpA0gCSBpA0gKQBJA0gaQBJA0gaQNIAkgaQNICkASQNIGkASQNIGkDSAJIGkDSApAEkDSBpAEkDSBpA0gCSBpA0gKQBJA0gaQBJA0gaQNIAkgaQNICkASQNIGkASQNIGkDSAJIGkDSApAEkDSBpAEkDSBpA0gCSBpA0gKQBJA0gaQBJA0gaQNIAkgaQNICkASQNIGkASQNIGkDSAJIGkDSApAEkDSBpAEkDSBpA0gCSBpA0gKQBJA0gaQBJA0gaQNIAkgaQNICkASQNIGkASQNIGkDSAJIGkDSApAEkDSBpAEkDSBpA0gCSBpA0gKQBJA0gaQBJA0gaQNIAkgaQNICkASQNIGkASQNIGkDSAJIGkDSApAEkDSBpAEkDSBpA0gCSBpA0gKQBJA0gaQBJA0gaQNIAkgaQNICkASQNIGkASQNIGkDSAJIGkDSApAEkDSBpAEkDSBpA0gCSBpA0gKQBJA0gaQBJA0gaQNIAkgaQNICkASQNIGkASQNIGkDSAJIGkDSApAEkDSBpAEkDSBpA0gCSBpA0gKQBJA0gaQBJA0gaQNIAkgaQNICkASQNIGkASQNIGkDSAJIGkDSApAEkDSBpAEkDSBpA0gCSBpA0gKQBJA0gaQBJA0gaQNIAkgaQNICkASQNIGkASQNIGkDSAJIGkDSApAEkDSBpAEkDSBpA0gCSBpA0gKQBJA0gaQBJA0gaQNIAkgaQNICkASQNIGkASQNIGkDSAJIGkDSApAEkDSBpAEkDSBpA0gCSBpA0gKQBJA0gaQBJA0gaQNIAkgaQNICkASQNIGkASQNIGkDSAJIGkDSApAEkDSBpAEkDSBpA0gCSBpA0gKQBJA0gaQBJA0gaQNIAkgaQNICkASQNIGkASQNIGkDSAJIGkDSApAEkDSBpAEkDSBpA0gCSBpA0gKQBJA0gaQBJA0gaQNIAkgaQNICkASQNIGkASQNIGkDSAJIGkDSApAEkDSBpAEkDSBpA0gCSBpA0gKQBJA0gaQBJA0gaQNIAkgaQNICkASQNIGkASQNIGkDSAJIGkDSApAEkDSBpAEkDSBpA0gCSBpA0gKQBJA0gaQBJA0gaQNIAkgaQNICkASQNIGkASQNIGkDSAJIGkDSApAEkDSBpAEkDSBpA0gCSBpA0gKQBJA0gaQBJA0gaQNIAkgaQNICkASQNIGkASQNIGkDSAJIGkDSApAEkDSBpAEkDSBpA0gCSBpA0gKQBJA0gaQBJA0gaQNIAkgaQNICkASQNIGkASQNIGkDSAJIGkDSApAEkDSD9xoYBS7p0M/IAAAAASUVORK5CYII=";
        
        return Response.json({
          error: "Content filtered by safety system. Please change your prompt.",
          fallback_image: true,
          b64_json: placeholder,
          timings: { inference: 0 }
        });
      }
      
      // Другие ошибки пробрасываем дальше
      throw replicateError;
    }
    
    console.log("Received output from Replicate:", output);

    if (output === null || output === undefined) {
      return Response.json({
        error: "Received null or undefined from Replicate",
      }, { status: 500 });
    }
    
    // Получаем URL изображения
    let imageUrl;
    if (Array.isArray(output) && output.length > 0) {
      imageUrl = output[0];
    } else if (typeof output === 'string') {
      imageUrl = output;
    } else {
      return Response.json(
        { 
          error: "Unexpected output format from Replicate",
          outputType: typeof output,
          outputValue: JSON.stringify(output)
        },
        { status: 500 }
      );
    }

    console.log("Downloading image from URL:", imageUrl);
    
    // Скачиваем изображение и конвертируем его в base64
    try {
      const imageResponse = await fetch(imageUrl);
      const arrayBuffer = await imageResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = buffer.toString('base64');
      
      // Возвращаем данные в том же формате, что и Together.ai
      return Response.json({
        b64_json: base64Image,
        timings: { inference: 0 }
      });
    } catch (fetchError) {
      console.error("Error downloading image:", fetchError);
      
      // Если скачивание не удалось, вернём хотя бы URL
      return Response.json({
        imageUrl: imageUrl,
        timings: { inference: 0 }
      });
    }
    
  } catch (e: any) {
    console.error("Error from Replicate:", e);
    
    return Response.json(
      { 
        error: e.toString(),
        stack: e.stack
      },
      {
        status: 500,
      },
    );
  }
}

export const runtime = "nodejs"; // Изменяем на nodejs для поддержки Buffer

function getIPAddress() {
  const FALLBACK_IP_ADDRESS = "0.0.0.0";
  const forwardedFor = headers().get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0] ?? FALLBACK_IP_ADDRESS;
  }

  return headers().get("x-real-ip") ?? FALLBACK_IP_ADDRESS;
}
