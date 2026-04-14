/**
 * API Service for VoxShield AI
 * Handles communication with the backend scam detection API.
 */

const API_BASE_URL = "http://localhost:5000/api";

/** Result returned from the scam detection endpoint */
export interface DetectionResult {
  riskScore: number;
  explanation: string;
  suggestion: string;
  timestamp: string;
  transcript: string;
}

/** History item from the backend */
export interface HistoryItem {
  id: string;
  riskScore: number;
  explanation: string;
  suggestion: string;
  timestamp: string;
  transcript: string;
}

/**
 * Sends a transcript to the backend for AI-powered scam analysis.
 * Returns a DetectionResult with risk score and explanation.
 */
export async function analyzeTranscript(
  transcript: string
): Promise<DetectionResult> {
  const response = await fetch(`${API_BASE_URL}/detect`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript }),
  });

  if (!response.ok) {
    throw new Error(`Detection API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetches the detection history from the backend.
 */
export async function fetchHistory(): Promise<HistoryItem[]> {
  const response = await fetch(`${API_BASE_URL}/history`);

  if (!response.ok) {
    throw new Error(`History API error: ${response.status}`);
  }

  return response.json();
}
