import { getSiteSettings } from "./supabaseService";

interface AIGeneratedContent {
  title: string;
  content: string;
  excerpt: string;
}

// Get API keys from site settings
async function getApiKeys() {
  const settings = await getSiteSettings();
  return {
    openrouterKey:
      settings?.openrouter_api_key ||
      "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",
    pexelsKey:
      settings?.pexels_api_key ||
      "88Qykg1vwK4s2Q73EgXOvKaSxAH5VUHKMVGC2NBt1TXD2sJp0hnnsKia",
  };
}

// Helper to get a single field from the AI
async function getSingleFieldFromAI(
  prompt: string,
  field: "title" | "excerpt" | "content"
): Promise<string> {
  const { openrouterKey } = await getApiKeys();

  const fieldPromptMap = {
    title: `You are a professional blog writer. STRICT INSTRUCTION: Return ONLY the blog post title, no keys, no JSON, no quotes, no code block, no explanation, no markdown. The title must be short, wise, and SEO-friendly (max 8 words, no fluff, no symbols, no price symbols, no unnecessary adjectives, just the core topic, always including the main subject from the prompt).`,
    excerpt: `You are a professional blog writer. STRICT INSTRUCTION: Return ONLY the blog post excerpt, no keys, no JSON, no quotes, no code block, no explanation, no markdown. The excerpt should be 100-150 words, SEO-friendly, and summarize the post engagingly.`,
    content: `You are a professional blog writer. STRICT INSTRUCTION: Return ONLY the blog post content, no keys, no JSON, no quotes, no code block, no explanation, no markdown. The content should be at least 800 words, SEO-friendly, engaging, and informative.`,
  };
  const userPromptMap = {
    title: `Write a short, SEO-friendly blog post title for: ${prompt}`,
    excerpt: `Write a 100-150 word SEO-friendly excerpt for a blog post about: ${prompt}`,
    content: `Write a detailed, SEO-friendly, engaging blog post (at least 800 words) about: ${prompt}. Make sure to cover every aspect and detail of the prompt, leaving nothing out.`,
  };
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openrouterKey}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "AI Blog Generator",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
        messages: [
          {
            role: "system",
            content: fieldPromptMap[field],
          },
          {
            role: "user",
            content: userPromptMap[field],
          },
        ],
      }),
    }
  );
  if (!response.ok) throw new Error("Failed to generate " + field);
  const data = await response.json();
  let text = data.choices[0].message.content.trim();
  // Remove any accidental keys, quotes, or markdown
  text = text
    .replace(/^['"`]+|['"`]+$/g, "")
    .replace(/^(title|excerpt|content)[:=]?/i, "")
    .trim();
  return text;
}

export async function generateBlogContent(
  prompt: string
): Promise<AIGeneratedContent> {
  try {
    const title = await getSingleFieldFromAI(prompt, "title");
    const excerpt = await getSingleFieldFromAI(prompt, "excerpt");
    const content = await getSingleFieldFromAI(prompt, "content");
    return { title, excerpt, content };
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate blog content");
  }
}

// Helper: Add watermark to image (returns a data URL)
async function addWatermarkToImage(
  imageUrl: string,
  watermarkUrl: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const watermark = new window.Image();
    let loaded = 0;
    img.crossOrigin = "anonymous";
    watermark.crossOrigin = "anonymous";
    img.onload = () => {
      loaded++;
      if (loaded === 2) draw();
    };
    watermark.onload = () => {
      loaded++;
      if (loaded === 2) draw();
    };
    img.onerror = watermark.onerror = (e) => reject(e);
    img.src = imageUrl;
    watermark.src = watermarkUrl;
    function draw() {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas not supported");
      ctx.drawImage(img, 0, 0);
      // Watermark image (top right)
      const wmWidth = Math.floor(img.width * 0.13);
      const aspect = watermark.width / watermark.height;
      const wmHeight = Math.floor(wmWidth / aspect);
      const padding = Math.floor(img.width * 0.02);
      ctx.globalAlpha = 0.85; // Slight transparency
      ctx.drawImage(
        watermark,
        img.width - wmWidth - padding,
        padding,
        wmWidth,
        wmHeight
      );
      ctx.globalAlpha = 1;
      // Watermark text (center)
      const text = "https://www.onassist.tech/";
      ctx.save();
      ctx.font = `bold ${Math.floor(img.width / 13)}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.translate(img.width / 2, img.height / 2);
      ctx.rotate(-Math.PI / 10); // slight angle
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = "#222";
      ctx.shadowColor = "#fff";
      ctx.shadowBlur = 2;
      ctx.fillText(text, 0, 0);
      ctx.globalAlpha = 1;
      ctx.restore();
      resolve(canvas.toDataURL("image/png"));
    }
  });
}

export async function generateBlogImage(
  prompt: string,
  fallbackPrompt?: string
): Promise<string> {
  try {
    const { pexelsKey } = await getApiKeys();

    // Use the generated title as the main search term
    let searchTerms = prompt.replace(/["'\n]/g, "").trim();
    let response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        searchTerms
      )}&per_page=15&orientation=landscape`,
      {
        headers: {
          Authorization: pexelsKey,
        },
      }
    );
    console.log(searchTerms);
    let data = await response.json();
    // If not enough results, try fallback prompt (SEO-friendly cleaned prompt)
    if ((!data.photos || data.photos.length === 0) && fallbackPrompt) {
      const fallbackClean = fallbackPrompt
        .replace(/[^\w\s]/gi, "")
        .toLowerCase();
      searchTerms = `seo blog ${fallbackClean}`
        .split(" ")
        .slice(0, 10)
        .join(" ");
      response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(
          searchTerms
        )}&per_page=15&orientation=landscape`,
        {
          headers: {
            Authorization: pexelsKey,
          },
        }
      );
      if (response.ok) {
        data = await response.json();
      }
    }
    // As a last fallback, use a generic but relevant keyword
    if (!data.photos || data.photos.length === 0) {
      searchTerms = "seo blog article illustration";
      response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(
          searchTerms
        )}&per_page=15&orientation=landscape`,
        {
          headers: {
            Authorization: pexelsKey,
          },
        }
      );
      if (response.ok) {
        data = await response.json();
      }
    }
    let imageUrl =
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop";
    if (data.photos && data.photos.length > 0) {
      // Randomly select from the first few results for variety
      const randomIndex = Math.floor(
        Math.random() * Math.min(data.photos.length, 5)
      );
      imageUrl = data.photos[randomIndex].src.large;
    }
    // Add watermark before returning
    const watermarked = await addWatermarkToImage(
      imageUrl,
      "https://cdn-icons-png.flaticon.com/512/763/763812.png"
    );
    return watermarked;
  } catch (error) {
    console.error("Error generating image:", error);
    // Return fallback image (with watermark)
    try {
      return await addWatermarkToImage(
        "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop",
        "https://cdn-icons-png.flaticon.com/512/763/763812.png"
      );
    } catch {
      // If watermarking fails, return plain fallback
      return "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop";
    }
  }
}

// Improved: Generate content and then use ONLY the title for image generation, fallback to prompt if needed
export async function generateBlogContentAndImage(prompt: string) {
  // Always ask for SEO-friendly, engaging, and relevant content
  const seoPrompt = `${prompt}. Make the content SEO-friendly, highly relevant, and engaging for readers. Use clear structure, keywords, and best practices for blog writing.`;
  const content = await generateBlogContent(seoPrompt);
  // Use only the generated title for image search, fallback to prompt if no results
  const image = await generateBlogImage(content.title, prompt);
  return { ...content, image };
}
