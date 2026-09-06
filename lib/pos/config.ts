export type PosRuntimeConfig = {
  existingPosUrl: string;
  apiKey: string;
  venueName: string;
};

export function getPosConfig(): PosRuntimeConfig {
  const existingPosUrl =
    process.env.EXISTING_POS_URL?.replace(/\/$/, "") ||
    "http://127.0.0.1:3000/api/legacy-pos";

  return {
    existingPosUrl,
    apiKey: process.env.EXISTING_POS_API_KEY || "clab-demo-key",
    venueName: process.env.VENUE_NAME || "C-Lab Bar",
  };
}
