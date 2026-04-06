const { GoogleGenAI } = require('@google/genai');

// Initialize Gemini Configuration
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const handleQuery = async (req, res) => {
  const { query, data } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required.' });
  }

  try {
    const systemPrompt = `You are an expert Data Analyst. 
The user will ask statistical or data-related questions regarding a specific dataset. 
Analyze the context of their query against the provided dataset and respond intelligently.
Here is the JSON dataset you must perform your analysis on:
${JSON.stringify(data)}

You MUST output your answer strictly as a JSON object with the following schema:
{
  "insight": "Clear, concise, highly professional text summary answering the query.",
  "needsChart": true or false (evaluate if this data is best visualized, e.g., trends, comparisons, proportions),
  "chartConfig": {
    "type": "bar" | "line" | "pie",
    "xAxisKey": "string (the key for the X axis, e.g., name, month)",
    "dataKey": "string (the primary numeric key for the Y axis, e.g., age, sales)",
    "data": [ { "xAxisKey": "value", "dataKey": 123 } ] (the mathematically filtered/sorted array of data to render)
  }
}
If a chart is not needed, set needsChart to false and chartConfig to null. Do NOT return markdown, only raw JSON.`;

    // Make request using the robust Gemini Flash model directly in JSON mode
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: query,
        config: {
            systemInstruction: systemPrompt,
            temperature: 0.2,
            responseMimeType: 'application/json'
        }
    });

    // We can now safely parse Gemini's output as an actual code object!
    const aiResponse = JSON.parse(response.text);

    res.status(200).json({
      message: aiResponse,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ 
      error: "Failed to communicate with AI.",
      details: error.message
    });
  }
};

module.exports = { handleQuery };
