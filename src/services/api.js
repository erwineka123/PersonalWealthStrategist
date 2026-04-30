import axios from "axios";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash-lite";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const parseAmount = (value) => Number.parseFloat(value) || 0;

const normalizeString = (value, fallback = "") => {
  if (typeof value !== "string") {
    return fallback;
  }

  return value.trim() || fallback;
};

const extractJson = (text) => {
  const cleaned = text.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Gemini response did not contain valid JSON.");
  }

  return JSON.parse(cleaned.slice(start, end + 1));
};

const buildPrompt = (financialData) => {
  return `You are an AI Personal Wealth Strategist.
Return ONLY valid JSON. No markdown, no code fences, no explanation.

User financial snapshot:
- income: ${financialData.income}
- expenses: ${financialData.expenses}
- savings: ${financialData.savings}
- debt: ${financialData.debt}
- goal: ${financialData.goal || "not specified"}
- riskTolerance: ${financialData.riskTolerance}
- spendingStyle: ${financialData.spendingStyle}
- monthlyInvesting: ${financialData.monthlyInvesting || 0}

You must output this JSON shape exactly:
{
  "summary": "string",
  "personality": "string",
  "personalityDetail": "string",
  "archetype": "string",
  "healthScore": 0,
  "recommendation": "string",
  "recommendationList": [
    {"id": 1, "title": "string", "why": "string", "action": "string"}
  ],
  "plan": {
    "summary": "string",
    "investmentTrack": "string",
    "steps": [
      {"title": "string", "status": "string", "target": "string"}
    ]
  },
  "dailyActions": [
    {"id": 1, "title": "string", "why": "string", "action": "string"}
  ],
  "scenarios": [
    {"id": 1, "label": "string", "narrative": "string", "outcome": "string"}
  ],
  "projection": "string",
  "metrics": {
    "income": "string",
    "expenses": "string",
    "savings": "string",
    "debt": "string",
    "savingsRate": 0,
    "debtRatio": 0,
    "expenseRatio": 0,
    "emergencyMonths": 0,
    "monthlySurplus": "string"
  },
  "insights": {
    "stability": "string",
    "focus": "string"
  }
}

Rules:
- Be direct, strategic, and specific.
- Make the personality feel like a real wealth archetype.
- The recommendation must be the next best financial action.
- The plan must adapt to the user goal and risk tolerance.
- The scenarios must represent base, stress, and growth cases.
- All output text must be in English only.
- Do not use Indonesian in any output field.
- Use exact values from the user snapshot for numeric financial fields.
- Do not inflate, round up, or reinterpret numeric inputs.
- Do not alter the user's income, expenses, savings, debt, or monthly investing values.
- If you mention any user-provided amount in the summary, plan, projection, or scenarios, keep the exact original number.
- Format currency-like fields in Indonesian Rupiah notation using the exact input value.
- For metrics, return savingsRate, debtRatio, expenseRatio, and emergencyMonths as numeric values only.
- Round ratio-like metrics to at most one decimal place.
- emergencyMonths must never be returned as a long decimal; keep it readable and rounded.
- Return valid JSON only, and make sure all fields match the requested schema.
- healthScore must be 0-100.
`;
};

const ensureApiKey = () => {
  if (!GEMINI_API_KEY) {
    throw new Error("Missing VITE_GEMINI_API_KEY environment variable.");
  }
};

const getApiErrorMessage = (error) => {
  const data = error?.response?.data;

  if (typeof data?.error?.message === "string") {
    return data.error.message;
  }

  if (typeof data?.message === "string") {
    return data.message;
  }

  if (error?.message) {
    return error.message;
  }

  return "Unknown Gemini API error.";
};

export const analyzeFinance = async (financialData) => {
  ensureApiKey();

  const normalizedData = {
    income: parseAmount(financialData.income),
    expenses: parseAmount(financialData.expenses),
    savings: parseAmount(financialData.savings),
    debt: parseAmount(financialData.debt),
    goal: normalizeString(financialData.goal),
    riskTolerance: normalizeString(financialData.riskTolerance, "moderate"),
    spendingStyle: normalizeString(financialData.spendingStyle, "balanced"),
    monthlyInvesting: parseAmount(financialData.monthlyInvesting),
  };

  try {
    const response = await axios.post(
      GEMINI_URL,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: buildPrompt(normalizedData) }],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          topP: 0.95,
          maxOutputTokens: 2048,
          responseMimeType: "application/json",
        },
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 30000,
      }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("") || "";

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    const parsed = extractJson(text);

    return {
      ...parsed,
      metrics: parsed.metrics || {},
      projection: parsed.projection || "",
      recommendationList: Array.isArray(parsed.recommendationList) ? parsed.recommendationList : [],
      dailyActions: Array.isArray(parsed.dailyActions) ? parsed.dailyActions : [],
      scenarios: Array.isArray(parsed.scenarios) ? parsed.scenarios : [],
      plan: {
        summary: parsed.plan?.summary || "",
        investmentTrack: parsed.plan?.investmentTrack || "",
        steps: Array.isArray(parsed.plan?.steps) ? parsed.plan.steps : [],
      },
      insights: {
        stability: parsed.insights?.stability || "",
        focus: parsed.insights?.focus || "",
      },
    };
  } catch (error) {
    const message = getApiErrorMessage(error);
    throw new Error(`Gemini analysis failed: ${message}`);
  }
};

export const getRecommendations = async (personalityType) => {
  ensureApiKey();

  try {
    const response = await axios.post(
      GEMINI_URL,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Give 3 concise financial recommendations for a user whose wealth personality is ${personalityType}. Return ONLY JSON array with items shaped like {"title":"string","action":"string"}.`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          topP: 0.95,
          maxOutputTokens: 1024,
          responseMimeType: "application/json",
        },
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 30000,
      }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("") || "";
    if (!text) {
      throw new Error("Gemini returned an empty recommendation response.");
    }

    const parsed = extractJson(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    const message = getApiErrorMessage(error);
    throw new Error(`Gemini recommendation failed: ${message}`);
  }
};

export default axios;