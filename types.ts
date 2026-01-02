
export interface ResearchPaper {
  id: string;
  title: string;
  abstract: string;
}

export interface TopicInsight {
  topic: string;
  strength: number; // 0-100
  reasoning: string;
  internalLogic: string; // The "Way of Thinking" summary
  relatedPapers: string[]; // Titles of papers best suited for this reasoning
}

export interface PeerResearcher {
  name: string;
  coreResearchFocus: string;
  relationshipType: 'Complementary' | 'Competing' | 'Pioneer' | 'Contemporary';
  linkageReasoning: string;
  distinctiveEdge: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface ComparisonResult {
  overlapScore: number; // 0-100
  thematicSynergy: string;
  competitiveAdvantages: string[];
  collaborativePotential: string;
  nicheDifferentiation: string;
}

export interface AnalysisResult {
  researcherName: string;
  currentAffiliation: string;
  briefBio: string;
  specializedTitle: string;
  executiveSummary: string;
  deepTechnicalSummary: string;
  topicDistribution: TopicInsight[];
  methodologicalFocus: string[];
  interdisciplinaryLinks: string[];
  suggestedNiche: string;
  peerComparison: PeerResearcher[];
  sources?: GroundingSource[];
  selfComparison?: ComparisonResult;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
