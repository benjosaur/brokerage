import type { Client } from "./types";

// Paddock's deprivation flag derivation (routes/ClientsRoutes.tsx).
export function deprivationFlags(client: Client): string {
  if (client.deprivation?.income && client.deprivation?.health) return "Both";
  if (client.deprivation?.income) return "Income";
  if (client.deprivation?.health) return "Health";
  return "None";
}
