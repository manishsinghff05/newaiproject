

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

      // Configurable via env. Default 2500 works with free OpenRouter credits (~2800).
      // Increase (e.g. 16000) when you add credits at https://openrouter.ai/settings/credits
      max_tokens: parseInt(process.env.OPENROUTER_MAX_TOKENS, 10) || 2500

    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    let errMessage = errText;
    try {
      const errJson = JSON.parse(errText);
      const msg = errJson?.error?.message || errJson?.message;
      if (msg) errMessage = msg;
    } catch (_) {}
    throw new Error(errMessage);
  }

  const data = await res.json();

  return data.choices[0].message.content;
};

export default generateResponse;