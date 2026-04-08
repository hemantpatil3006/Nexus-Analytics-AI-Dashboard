const handleQuery = async (req, res) => {
  const { query, data } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required.' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
    return res.status(500).json({ 
      error: "OpenRouter Key Missing", 
      details: "Please add your OPENROUTER_API_KEY to the backend .env file." 
    });
  }

  try {
    const systemPrompt = `You are an expert Data Analyst. 
Analyze the provided JSON dataset and respond to the user's query.
Dataset: ${JSON.stringify(data)}

You MUST respond strictly with a JSON object in this format:
{
  "insight": "Clear summary text",
  "needsChart": true/false,
  "chartConfig": {
    "type": "bar" | "line" | "pie",
    "xAxisKey": "string",
    "dataKey": "string",
    "data": [ { "xAxisKey": "value", "dataKey": 123 } ]
  }
}
If no chart is needed, set needsChart to false and chartConfig to null.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": `https://nexus-ai-analytics-dashboard.netlify.app/`,
        "X-Title": `Nexus AI Dashboard`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "openai/gpt-3.5-turbo",
        "messages": [
          { "role": "system", "content": systemPrompt },
          { "role": "user", "content": query }
        ],
        "response_format": { "type": "json_object" }
      })
    });

    const result = await response.json();
    
    if (result.error) {
        throw new Error(result.error.message || "OpenRouter API Error");
    }

    const aiMessage = JSON.parse(result.choices[0].message.content);

    res.status(200).json({
      message: aiMessage,
      timestamp: new Date().toISOString(),
      provider: "OpenRouter"
    });
    
  } catch (error) {
    console.error(`OpenRouter Error:`, error.message);
    res.status(500).json({ 
      error: "AI Integration Error",
      details: error.message 
    });
  }
};

module.exports = { handleQuery };
