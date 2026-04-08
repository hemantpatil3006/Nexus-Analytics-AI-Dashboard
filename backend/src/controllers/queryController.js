const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini Configuration
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const handleQuery = async (req, res) => {
  const { query, data } = req.body;

  // 1. Validate Input
  if (!query) {
    return res.status(400).json({ error: 'Query is required.' });
  }

  // 2. Validate API Key
  if (!process.env.GEMINI_API_KEY) {
    console.error("CRITICAL: GEMINI_API_KEY is missing from environment variables.");
    return res.status(500).json({ 
      error: "Backend Configuration Error.", 
      details: "GEMINI_API_KEY is not set on the server. Please check environment variables." 
    });
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

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

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${query}` }] }],
    });

    const response = await result.response;
    const aiText = response.text();
    
    if (!aiText) {
      throw new Error("Empty response from Gemini AI.");
    }

    const aiResponse = JSON.parse(aiText);

    res.status(200).json({
      message: aiResponse,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("Gemini Error:", error);
    
    // Return specific error details to help with debugging
    res.status(500).json({ 
      error: "AI Communication Failed",
      details: error.message || "An unexpected error occurred while communicating with the AI core."
    });
  }
};

module.exports = { handleQuery };
