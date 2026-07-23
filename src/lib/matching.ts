import type { MicroProvider, Service, SupportRequest } from "./types";

export interface Match {
  provider: MicroProvider;
  overlap: Service[];
  sameLocality: boolean;
}

function coversLocality(provider: MicroProvider, locality: string): boolean {
  return (provider.areasCovered ?? []).some(
    (area) => area === "All" || area === locality,
  );
}

/**
 * Providers whose covered areas include the client's locality and who offer
 * at least one requested service (any service when none were selected),
 * ranked: same town/village first, then most overlapping services, then
 * name.
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
    .filter(
      (match) =>
        coversLocality(match.provider, request.locality) &&
        (request.services.length === 0 || match.overlap.length > 0),
    )
    .sort(
      (a, b) =>
        Number(b.sameLocality) - Number(a.sameLocality) ||
        b.overlap.length - a.overlap.length ||
        a.provider.name.localeCompare(b.provider.name),
    );
}
