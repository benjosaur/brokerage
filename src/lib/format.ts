import { FUNDING_OPTIONS, type AreaCovered, type Client } from "./types";

// Paddock's deprivation flag derivation (routes/ClientsRoutes.tsx).
export function deprivationFlags(client: Client): string {
  if (client.deprivation?.income && client.deprivation?.health) return "Both";
  if (client.deprivation?.income) return "Income";
  if (client.deprivation?.health) return "Health";
  return "None";
}

const FUNDING_SHORT: Record<string, string> = {
  [FUNDING_OPTIONS[0]]: "Self-funded",
  [FUNDING_OPTIONS[1]]: "Direct Payments",
  [FUNDING_OPTIONS[2]]: "NHS PHB",
};

/** Table-length labels for the questionnaire's long funding options. */
export function fundingShort(funding?: string[]): string {
  return (funding ?? [])
    .map((option) => FUNDING_SHORT[option] ?? option)
    .join(", ");
}

export function areasCoveredText(areas?: AreaCovered[]): string {
  const list = areas ?? [];
  return list.includes("All") ? "All" : list.join(", ");
}
