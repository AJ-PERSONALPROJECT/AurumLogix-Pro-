
import { GoogleGenAI, Type } from "@google/genai";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchLiveRates = async () => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Predict current market rates for Gold (24K per gram) and Silver (per gram) in INR based on typical recent trends. Provide only JSON output.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            gold: { type: Type.NUMBER },
            silver: { type: Type.NUMBER },
            trend: { type: Type.STRING, enum: ['UP', 'DOWN', 'STABLE'] }
          },
          required: ['gold', 'silver', 'trend']
        }
      }
    });

    // Access the .text property directly (not a method)
    const text = response.text;
    const data = JSON.parse(text || '{}');
    return {
      gold: data.gold || 7200,
      silver: data.silver || 95,
      trend: data.trend || 'STABLE',
      lastUpdated: Date.now()
    };
  } catch (error) {
    console.error("Error fetching live rates via Gemini:", error);
    return null;
  }
};

export const getSalesAdvice = async (inventoryCount: number, salesCount: number) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `My jewelry shop has ${inventoryCount} items in stock and made ${salesCount} sales this week. Give me a 1-sentence tip to improve business.`,
    });
    // Use .text property to extract content
    return response.text || "Keep providing excellent service to your customers!";
  } catch (error) {
    return "Keep providing excellent service to your customers!";
  }
};

export const queryAssistant = async (
  prompt: string, 
  assistantName: string, 
  shopName: string, 
  context: { inventory: any[], sales: any[], rates: any }
) => {
  try {
    const systemPrompt = `You are ${assistantName}, a professional jewelry business intelligence consultant for ${shopName}.
    You have the following data:
    - Inventory: ${JSON.stringify(context.inventory.map(i => ({ name: i.name, cat: i.category, price: i.finalPrice, stock: i.stockLevel })))}
    - Sales: ${JSON.stringify(context.sales.map(s => ({ item: s.itemName, price: s.finalPrice, date: new Date(s.soldAt).toLocaleDateString() })))}
    - Rates: Gold ₹${context.rates.gold}, Silver ₹${context.rates.silver}.
    
    Answer concisely. Help with analysis, stock management, and performance insights. Be professional and encouraging.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
      }
    });
    // Use .text property to extract content
    return response.text || "I am currently processing some data and couldn't respond. Please try again in a moment.";
  } catch (error) {
    console.error("Assistant Error:", error);
    return "I am currently processing some data and couldn't respond. Please try again in a moment.";
  }
};
