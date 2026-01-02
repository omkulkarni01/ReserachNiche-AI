
import { GoogleGenAI, Type } from "@google/genai";
import { ResearchPaper, AnalysisResult, GroundingSource, ComparisonResult } from "../types";

export const analyzeResearch = async (
  researcherName: string,
  papers: ResearchPaper[],
  professionalHistory?: string
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const papersContext = papers
    .filter(p => p.title.trim() !== "")
    .map((p, i) => `Paper ${i + 1}: Title: ${p.title}\nAbstract: ${p.abstract}`)
    .join("\n\n");

  const careerContext = professionalHistory 
    ? `Researcher's Career Background/Roles:\n${professionalHistory}` 
    : "No specific career background provided.";

  const prompt = `
    Perform a high-level structural analysis of the academic and professional profile for: "${researcherName}".
    
    Professional Context:
    ${careerContext}

    Scientific/Technical Output (The Source Material):
    ${papersContext}

    Your tasks:
    1. USE GOOGLE SEARCH to verify "${researcherName}"'s current role, affiliation, and notable career milestones.
    2. Synthesize their "Specialized Title" — a unique academic brand merging career path with research.
    3. Generate a "Deep Technical Summary" (approx 200 words) focusing on methodological evolution.
    4. For each research topic identified in the pattern density analysis:
       - Provide an "accurate strength" score as an INTEGER percentage (0-100).
       - Provide "reasoning" (the objective finding).
       - Provide "internalLogic" (the "Way of Thinking"). Detail the pattern recognition steps used.
       - Provide "relatedPapers": An array of titles from the "Scientific/Technical Output" list provided above that directly support or manifest this specific topic.
    5. Map 3-4 global peer researchers and define the "Distinctive Edge" for ${researcherName}.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      systemInstruction: "You are a senior academic strategist. Your goal is to uncover the 'hidden architecture' of a researcher's mind. For 'relatedPapers', only use the titles provided in the input context. Ensure all percentages are strictly integers.",
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          researcherName: { type: Type.STRING },
          currentAffiliation: { type: Type.STRING },
          briefBio: { type: Type.STRING },
          specializedTitle: { type: Type.STRING },
          executiveSummary: { type: Type.STRING },
          deepTechnicalSummary: { type: Type.STRING },
          topicDistribution: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                topic: { type: Type.STRING },
                strength: { type: Type.INTEGER },
                reasoning: { type: Type.STRING },
                internalLogic: { type: Type.STRING },
                relatedPapers: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING }
                }
              },
              required: ["topic", "strength", "reasoning", "internalLogic", "relatedPapers"]
            }
          },
          methodologicalFocus: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          interdisciplinaryLinks: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          suggestedNiche: { type: Type.STRING },
          peerComparison: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                coreResearchFocus: { type: Type.STRING },
                relationshipType: { type: Type.STRING, enum: ['Complementary', 'Competing', 'Pioneer', 'Contemporary'] },
                linkageReasoning: { type: Type.STRING },
                distinctiveEdge: { type: Type.STRING }
              },
              required: ["name", "coreResearchFocus", "relationshipType", "linkageReasoning", "distinctiveEdge"]
            }
          }
        },
        required: [
          "researcherName",
          "currentAffiliation",
          "briefBio",
          "specializedTitle",
          "executiveSummary",
          "deepTechnicalSummary",
          "topicDistribution",
          "methodologicalFocus",
          "interdisciplinaryLinks",
          "suggestedNiche",
          "peerComparison"
        ]
      }
    }
  });

  const result: AnalysisResult = JSON.parse(response.text);
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (groundingChunks) {
    result.sources = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title || "Academic Source",
        uri: chunk.web.uri
      }));
  }

  return result;
};

export const compareWithUser = async (
  targetResearcher: AnalysisResult,
  userProfile: { name: string; history: string; papers: ResearchPaper[] }
): Promise<ComparisonResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const userPapers = userProfile.papers
    .filter(p => p.title.trim() !== "")
    .map((p, i) => `User Paper ${i + 1}: ${p.title}\nAbstract: ${p.abstract}`)
    .join("\n\n");

  const prompt = `
    Compare the following two researchers for synergy and differentiation:
    
    TARGET RESEARCHER:
    Name: ${targetResearcher.researcherName}
    Title: ${targetResearcher.specializedTitle}
    Core Summary: ${targetResearcher.executiveSummary}
    Technical Focus: ${targetResearcher.methodologicalFocus.join(", ")}

    USER (YOU):
    Name: ${userProfile.name}
    Background: ${userProfile.history}
    Research Output:
    ${userPapers}

    Provide a JSON object comparing the two. Focus on:
    1. Overlap Score (0-100 integer).
    2. Thematic Synergy (How well do your topics complement each other?).
    3. Competitive Advantages (What do you have that they don't, and vice versa?).
    4. Collaborative Potential (Specific project ideas).
    5. Niche Differentiation (Where do you diverge?).
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overlapScore: { type: Type.INTEGER },
          thematicSynergy: { type: Type.STRING },
          competitiveAdvantages: { type: Type.ARRAY, items: { type: Type.STRING } },
          collaborativePotential: { type: Type.STRING },
          nicheDifferentiation: { type: Type.STRING }
        },
        required: ["overlapScore", "thematicSynergy", "competitiveAdvantages", "collaborativePotential", "nicheDifferentiation"]
      }
    }
  });

  return JSON.parse(response.text);
};
