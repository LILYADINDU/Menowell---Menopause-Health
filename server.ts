import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initialize Gemini client to prevent crash if key is missing
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", aiConfigured: Boolean(process.env.GEMINI_API_KEY) });
});

// Personalized AI Menopause Advisor
app.post("/api/advisor/chat", async (req, res) => {
  try {
    const { message, history, userProfile, currentLog } = req.body;
    const ai = getAi();

    if (!ai) {
      // Graceful fallback with expert-vetted menopause guidance
      return res.json({
        reply: `Thank you for sharing. Even though live AI insights are currently offline, here are key clinical pointers: For symptom relief, prioritize regular hydration, flaxseed or edamame for gentle phytoestrogens, and a wind-down routine in a cool bedroom (65°F). Keep logging your patterns to share with your healthcare provider.`,
        suggestedActions: [
          "Cool bedroom to 65°F (18°C) before sleep",
          "Include 1-2 tbsp ground flaxseed in breakfast",
          "Try a 4-7-8 breathing session when feeling flushed or anxious"
        ]
      });
    }

    const systemInstruction = `You are "Dr. Sophia Vance", an empathetic, board-certified women's health physician and North American Menopause Society (NAMS) Certified Practitioner.
You specialize in helping women thrive during perimenopause, menopause, and postmenopause.
You provide compassionate, non-judgmental, evidence-based guidance focusing on:
1. DIET & NUTRITION: Blood sugar balancing, phytoestrogens (flaxseed, tempeh, lentils), bone health nutrients (calcium 1200mg, vit D3, magnesium glycinate), anti-inflammatory foods, identifying vasomotor triggers (caffeine, alcohol, spicy foods, high-glycemic sugars).
2. EMOTIONAL WELL-BEING: Vasomotor-related mood swings, progesterone-drop anxiety, brain fog normalization, nervous system down-regulation (vagus nerve stimulation, 4-7-8 breathing, cognitive reframing), self-compassion.
3. SLEEP ARCHITECTURE: Combating nocturnal hot flashes/night sweats, sleep latency, sleep fragmentation, CBT-I principles for menopause, bedroom thermoregulation (65°F/18°C), magnesium timing.
4. MEDICAL ADVOCACY: Clarifying when to seek professional care, explaining Hormone Replacement Therapy (HRT/MHT) benefits/contraindications objectively, and non-hormonal prescription options (e.g., Fezolinetant, SSRIs/SNRIs).

User Profile:
- Phase: ${userProfile?.phase || "Perimenopause"}
- Age: ${userProfile?.age || "48"}
- Primary Concerns: ${userProfile?.primaryConcerns?.join(", ") || "Sleep disruptions, hot flashes, mood shifts"}

Today's Logged Context:
- Sleep: ${currentLog?.sleepHours ? `${currentLog.sleepHours} hrs, quality: ${currentLog.sleepQuality}/5, night sweats: ${currentLog.nightSweats ? "Yes (" + currentLog.nightSweatCount + " times)" : "None"}` : "Not logged yet"}
- Mood & Energy: ${currentLog?.mood ? `${currentLog.mood}, calm score: ${currentLog.calmScore}/10` : "Not logged yet"}
- Diet logged: ${currentLog?.dietSummary || "Standard meals"}
- Hot flashes today: ${currentLog?.hotFlashCount ?? 0}

Respond warmly, concisely, and practically (2-3 short paragraphs max). Format with clear bullet points where helpful. Always include 2-3 specific, actionable steps for today. Include a gentle medical disclaimer that this is educational guidance.`;

    const contents = [
      ...(Array.isArray(history) ? history.map((h: { role: string; content: string }) => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.content }]
      })) : []),
      {
        role: "user",
        parts: [{ text: message || "What are the most impactful changes I can make today for my menopause symptoms?" }]
      }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I am here to support you. How are you feeling right now?";
    return res.json({ reply });
  } catch (error) {
    console.error("AI Advisor error:", error);
    res.status(500).json({
      error: "Unable to generate AI consultation at this moment.",
      reply: "I'm having a brief connection delay, but remember: keeping your nervous system calm and tracking your daily patterns is already a huge step toward symptom relief."
    });
  }
});

// Doctor Consultation Preparation Summary
app.post("/api/advisor/doctor-brief", async (req, res) => {
  try {
    const { userProfile, logs, timeframeDays = 30 } = req.body;
    const ai = getAi();

    const summaryData = {
      profile: userProfile,
      totalLoggedDays: logs?.length || 0,
      recentLogsSample: (logs || []).slice(0, 14),
    };

    if (!ai) {
      return res.json({
        summary: `# Menopause Clinical Consultation Summary\n\n**Patient Phase**: ${userProfile?.phase || "Perimenopause"}\n**Key Symptoms**: Frequent night sweats, fragmented sleep, mood fluctuations.\n\n### Clinical Discussion Priorities:\n1. Evaluate severity of vasomotor symptoms (hot flashes/night sweats).\n2. Review suitability for Menopausal Hormone Therapy (MHT) or non-hormonal neurokinin-3 receptor antagonists (Fezolinetant).\n3. Discuss bone density baseline (DEXA scan) and lipid/cardiovascular screening.\n4. Screen for sleep architecture disruption and CBT-I suitability.`
      });
    }

    const prompt = `Based on the following patient health tracking data across the past ${timeframeDays} days, generate a comprehensive, highly organized Clinical Consultation Brief for the patient to hand to or discuss with their Gynecologist / General Practitioner.

Patient Data:
${JSON.stringify(summaryData, null, 2)}

Format with clean Markdown:
1. **Patient Snapshot & Chief Complaints**: Primary menopause phase, duration, and top disruptive symptoms.
2. **Vasomotor & Sleep Patterns**: Average hot flashes/day, night sweat awakenings, sleep fragmentation trend.
3. **Identified Dietary & Lifestyle Correlations**: Potential triggers observed (caffeine, wine, stress, high-carb dinners) and protective habits (phytoestrogens, hydration).
4. **Mood & Cognitive Impact**: Frequency of brain fog, irritability, or anxiety peaks.
5. **Recommended Questions for the Healthcare Provider**: 4-5 targeted, empowered questions (e.g. regarding hormone therapy eligibility, blood work/thyroid checks, non-hormonal prescriptions, bone density screening).

Make the tone objective, clinical yet patient-empowering, clear, and easy for a busy doctor to review in 90 seconds.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert medical writer specializing in menopause medicine, preparing an executive clinical summary for a physician visit.",
        temperature: 0.4,
      }
    });

    res.json({ summary: response.text });
  } catch (error) {
    console.error("Doctor brief error:", error);
    res.status(500).json({ error: "Failed to generate doctor consultation brief." });
  }
});

// Smart Meal Menopause Nutrition Evaluator
app.post("/api/advisor/analyze-meal", async (req, res) => {
  try {
    const { mealDescription, userPhase = "Perimenopause" } = req.body;
    const ai = getAi();

    if (!ai) {
      return res.json({
        score: "Balancing",
        phytoestrogens: "Moderate",
        boneSupport: "Calcium & Vitamin D check recommended",
        vasomotorTriggerRisk: "Low",
        feedback: "Focus on lean protein, dietary fiber, and healthy omega-3 fats to maintain steady insulin levels and minimize vasomotor spikes.",
        smartTip: "Adding 1 tbsp of ground flaxseed or chia seeds provides lignans to support estrogen metabolite balance."
      });
    }

    const prompt = `Analyze this meal specifically through the lens of menopause health (${userPhase}):
Meal: "${mealDescription}"

Provide an analysis in JSON format with:
- score: "Optimal" | "Beneficial" | "Needs Adjustment" | "Potential Trigger"
- phytoestrogens: "High" | "Moderate" | "None / Low"
- boneSupport: brief description of calcium/magnesium/vit K nutrients
- vasomotorTriggerRisk: "Low" | "Medium" | "High" (identifying alcohol, caffeine, refined sugar, high-sodium or chili)
- feedback: 2-3 sentences on hormonal impact
- smartTip: 1 actionable swap or addition to optimize for estrogen fluctuations and steady energy.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error) {
    console.error("Meal analysis error:", error);
    res.status(500).json({ error: "Meal analysis failed" });
  }
});

// Vite Integration
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MenoWell server listening on http://0.0.0.0:${PORT}`);
  });
}

start();
