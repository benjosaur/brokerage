import type { MicroProvider, Service, SupportRequest } from "./types";

export interface Match {
  provider: MicroProvider;
  overlap: Service[];
  sameLocality: boolean;
}

/**
 * Providers offering at least one requested service (all providers when no
 * services were selected), ranked: same town/village first, then most
 * overlapping services, then name.
 */
export function matchProviders(
  providers: MicroProvider[],
  request: Pick<SupportRequest, "services" | "locality">,
): Match[] {
  return providers
    .map((provider) => ({
      provider,
      overlap: provider.services.filter((service) =>
        request.services.includes(service),
      ),
      sameLocality: provider.locality === request.locality,
    }))
    .filter((match) => request.services.length === 0 || match.overlap.length > 0)
    .sort(
      (a, b) =>
        Number(b.sameLocality) - Number(a.sameLocality) ||
        b.overlap.length - a.overlap.length ||
        a.provider.name.localeCompare(b.provider.name),
    );
}
