import { RequestHandler } from "express";

const PHISHING_KEYWORDS = [
  "urgent",
  "verify",
  "click",
  "account",
  "bank",
  "suspended",
  "login",
  "password",
  "confirm",
  "update",
  "validate",
  "unusual activity",
];

// Helper function to calculate confidence level
function getConfidenceLevel(diff: number): "high" | "medium" | "low" {
  if (diff >= 0.3) return "high";
  if (diff >= 0.15) return "medium";
  return "low";
}

// Mock AI prediction function
// In production, this would call your actual DistilBERT model
function mockPrediction(text: string): {
  phishing_prob: number;
  safe_prob: number;
  reason: string;
} {
  const textLower = text.toLowerCase();
  let phishingScore = 0.5;
  let reason = "model prediction";

  // Count keywords
  let keywordCount = 0;
  for (const keyword of PHISHING_KEYWORDS) {
    if (textLower.includes(keyword)) {
      keywordCount++;
    }
  }

  // Adjust score based on keywords
  if (keywordCount > 0) {
    phishingScore = 0.5 + (keywordCount * 0.08);
    reason = "keyword-based adjustment";
  }

  // Check for suspicious patterns
  if (textLower.includes("click here") || textLower.includes("click below")) {
    phishingScore += 0.15;
    reason = "contains suspicious call-to-action";
  }

  if (textLower.includes("limited time") || textLower.includes("act now")) {
    phishingScore += 0.1;
    reason = "urgency language detected";
  }

  if (textLower.includes("@") && textLower.includes("[") && textLower.includes("]")) {
    phishingScore -= 0.1;
    reason = "contains email-like structure";
  }

  // Cap scores
  phishingScore = Math.min(Math.max(phishingScore, 0.1), 0.95);
  const safeScore = 1 - phishingScore;

  // Handle uncertain predictions
  if (Math.abs(phishingScore - safeScore) < 0.05) {
    if (keywordCount > 0) {
      phishingScore = 0.55;
      reason = "model uncertain, keyword-based adjustment";
    } else {
      phishingScore = 0.45;
      reason = "model uncertain, defaulting to safe";
    }
  }

  return {
    phishing_prob: parseFloat(phishingScore.toFixed(4)),
    safe_prob: parseFloat((1 - phishingScore).toFixed(4)),
    reason,
  };
}

export const handlePredict: RequestHandler = (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Text is required" });
  }

  if (text.trim().length === 0) {
    return res.status(400).json({ error: "Text cannot be empty" });
  }

  const { phishing_prob, safe_prob, reason } = mockPrediction(text);
  const prediction = phishing_prob >= 0.5 ? "phishing" : "safe";
  const diff = Math.abs(phishing_prob - safe_prob);

  res.json({
    prediction,
    confidence: getConfidenceLevel(diff),
    reason,
    phishing_probability: phishing_prob,
    safe_probability: safe_prob,
  });
};

export const handlePredictBatch: RequestHandler = (req, res) => {
  const { texts } = req.body;

  if (!Array.isArray(texts)) {
    return res.status(400).json({ error: "texts must be an array" });
  }

  if (texts.length === 0) {
    return res.status(400).json({ error: "texts array cannot be empty" });
  }

  if (texts.length > 100) {
    return res.status(400).json({ error: "Maximum 100 texts allowed" });
  }

  const results = texts.map((text: string) => {
    const { phishing_prob, safe_prob, reason } = mockPrediction(text);
    const prediction = phishing_prob >= 0.5 ? "phishing" : "safe";
    const diff = Math.abs(phishing_prob - safe_prob);

    return {
      text_preview: text.slice(0, 50),
      prediction,
      confidence: getConfidenceLevel(diff),
      reason,
      phishing_probability: phishing_prob,
    };
  });

  res.json(results);
};

export const handleHealth: RequestHandler = (_req, res) => {
  res.json({ status: "ok" });
};
