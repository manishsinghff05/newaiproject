

const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions";
const model = "deepseek/deepseek-chat";

const generateResponse = async (prompt) => {

  const res = await fetch(openRouterUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.FRONTEND_URL || process.env.RENDER_EXTERNAL_URL || "http://localhost:5173",
      "X-Title": "Genweb.ai"
    },

    body: JSON.stringify({
      model: model,

      messages: [
        { role: "system", content: "Return ONLY valid raw JSON." },
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.2,

      // Must be high enough for full HTML document (~16k tokens for large sites)
      max_tokens: 16000

    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error("OpenRouter Error: " + err);
  }

  const data = await res.json();

  return data.choices[0].message.content;
};

export default generateResponse;