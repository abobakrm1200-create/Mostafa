
import { GoogleGenAI, Type } from "@google/genai";
import { CompetitorData, ActualPerformance, HistoricalSTRData } from "../types";

export const getDynamicPricingAdvice = async (
  actuals: ActualPerformance,
  competitors: CompetitorData[],
  strData: HistoricalSTRData[],
  totalRooms: number
) => {
  // Always use a new GoogleGenAI instance with the named parameter apiKey
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const currentOcc = (actuals.totalOccupancy / totalRooms) * 100;
  const avgCompPrice = competitors.reduce((acc, c) => acc + c.adr, 0) / competitors.length;
  
  const prompt = `
    أنت مستشار إدارة إيرادات فندق أوفاد الرياض. قم بتحليل البيانات التالية لتقديم استراتيجية تسعير:
    
    1. الأداء الفعلي اليوم:
       - إجمالي الإشغال: ${currentOcc.toFixed(1)}% (${actuals.totalOccupancy} غرفة)
       - أداء الشرائح: OTA(${actuals.segments.ota.rooms} غرفة)، الشركات(${actuals.segments.corporate.rooms} غرفة)
    
    2. السوق والمنافسين:
       - متوسط سعر المنافسين: ${avgCompPrice.toFixed(0)} SAR
       - تفاصيل المنافسين: ${JSON.stringify(competitors.map(c => ({ name: c.name, price: c.adr, occ: c.occupancy })))}
    
    3. بيانات STR التاريخية:
       - آخر مؤشر RGI (العائد): ${strData[0]?.rgi || 'N/A'}
       - اتجاه السوق: ${strData[0]?.period}
    
    المطلوب: تقديم 3 توصيات سعرية (OTA, Corporate, Individual) مبررة بناءً على "وضع السوق" و "الفجوة السعرية".
    أعطني النتيجة بتنسيق JSON حصراً:
    {
      "recommendations": [
        {
          "segment": "اسم الشريحة",
          "currentPrice": 0,
          "suggestedPrice": 0,
          "demandLevel": "Peak/High/Medium/Low",
          "reasoning": "مبرر مبني على المنافسين وإشغالنا الحالي",
          "impact": "الأثر على RevPAR"
        }
      ],
      "marketSentiment": "تحليل موجز لوضع السوق الحالي (مثلاً: السوق منتعش، المنافسون يرفعون الأسعار، نحن بحاجة لخفض السعر لزيادة الإشغال...)",
      "strategy": "الخطة الاستراتيجية المقترحة للـ 24 ساعة القادمة"
    }
  `;

  try {
    // Upgrading to gemini-3-pro-preview for complex reasoning and strategic tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  segment: { type: Type.STRING },
                  currentPrice: { type: Type.NUMBER },
                  suggestedPrice: { type: Type.NUMBER },
                  demandLevel: { type: Type.STRING },
                  reasoning: { type: Type.STRING },
                  impact: { type: Type.STRING }
                }
              }
            },
            marketSentiment: { type: Type.STRING },
            strategy: { type: Type.STRING }
          }
        }
      }
    });
    // Access the .text property directly, do not call it as a method.
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("AI Dynamic Pricing Error:", e);
    return null;
  }
};
