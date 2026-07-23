import { useSyncExternalStore } from "react";
import {
  seedClients,
  seedProviders,
  seedRequests,
  seedVolunteers,
} from "./seed";
import type {
  Client,
  MicroProvider,
  SupportRequest,
  Volunteer,
} from "./types";

// All demo state lives in the browser. Seed data is compiled in; anything
// the user creates or edits is layered on top via localStorage so the demo
// survives a reload but can always be wiped with resetDemo(). Edits to
// seed entries live in the edits maps; created entries are stored whole.

const DATA_KEY = "wcn-demo:data:v1";
const SESSION_KEY = "wcn-demo:session:v1";

interface DemoData {
  requests: SupportRequest[];
  createdClients: Client[];
  createdProviders: MicroProvider[];
  createdVolunteers: Volunteer[];
  edits: {
    clients: Record<string, Client>;
    providers: Record<string, MicroProvider>;
    volunteers: Record<string, Volunteer>;
  };
}

function emptyData(): DemoData {
  return {
    requests: [],
    createdClients: [],
    createdProviders: [],
    createdVolunteers: [],
    edits: { clients: {}, providers: {}, volunteers: {} },
  };
}

function loadData(): DemoData {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (!raw) return emptyData();
    const parsed = JSON.parse(raw) as Partial<DemoData>;
    return {
      requests: Array.isArray(parsed.requests) ? parsed.requests : [],
      createdClients: Array.isArray(parsed.createdClients)
        ? parsed.createdClients
        : [],
      createdProviders: Array.isArray(parsed.createdProviders)
        ? parsed.createdProviders
        : [],
      createdVolunteers: Array.isArray(parsed.createdVolunteers)
        ? parsed.createdVolunteers
        : [],
      edits: {
        clients: parsed.edits?.clients ?? {},
        providers: parsed.edits?.providers ?? {},
        volunteers: parsed.edits?.volunteers ?? {},
      },
    };
  } catch {
    return emptyData();
  }
}

let data = loadData();
let signedIn = localStorage.getItem(SESSION_KEY) !== null;

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function persist(next: DemoData) {
  data = next;
  localStorage.setItem(DATA_KEY, JSON.stringify(next));
  emit();
}

function makeId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

// Replace in the created list when the entity was created in this demo,
// otherwise record it as an override of the compiled-in seed entry.
function upsert<T extends { id: string }>(
  created: T[],
  edits: Record<string, T>,
  entity: T,
): { created: T[]; edits: Record<string, T> } {
  if (created.some((item) => item.id === entity.id)) {
    return {
      created: created.map((item) => (item.id === entity.id ? entity : item)),
      edits,
    };
  }
  return { created, edits: { ...edits, [entity.id]: entity } };
}

export function createClient(input: Omit<Client, "id">): Client {
  const client: Client = { ...input, id: makeId("c") };
  persist({ ...data, createdClients: [client, ...data.createdClients] });
  return client;
}

export function updateClient(client: Client) {
  const { created, edits } = upsert(
    data.createdClients,
    data.edits.clients,
    client,
  );
  persist({
    ...data,
    createdClients: created,
    edits: { ...data.edits, clients: edits },
  });
}

export function createProvider(input: Omit<MicroProvider, "id">): MicroProvider {
  const provider: MicroProvider = { ...input, id: makeId("mp") };
  persist({ ...data, createdProviders: [provider, ...data.createdProviders] });
  return provider;
}

export function updateProvider(provider: MicroProvider) {
  const { created, edits } = upsert(
    data.createdProviders,
    data.edits.providers,
    provider,
  );
  persist({
    ...data,
    createdProviders: created,
    edits: { ...data.edits, providers: edits },
  });
}

export function createVolunteer(input: Omit<Volunteer, "id">): Volunteer {
  const volunteer: Volunteer = { ...input, id: makeId("v") };
  persist({
    ...data,
    createdVolunteers: [volunteer, ...data.createdVolunteers],
  });
  return volunteer;
}

export function updateVolunteer(volunteer: Volunteer) {
  const { created, edits } = upsert(
    data.createdVolunteers,
    data.edits.volunteers,
    volunteer,
  );
  persist({
    ...data,
    createdVolunteers: created,
    edits: { ...data.edits, volunteers: edits },
  });
}

export function submitRequest(
  input: Omit<SupportRequest, "id" | "createdAt" | "clientId">,
): SupportRequest {
  const stamp = crypto.randomUUID().slice(0, 8);
  const client: Client = {
    id: `c-${stamp}`,
    name: input.name,
    locality: input.locality,
    services: input.services,
    funding: input.funding,
    onboarded: new Date().toISOString(),
    status: "New request",
    headline: input.headline,
  };
  const request: SupportRequest = {
    ...input,
    id: `req-${stamp}`,
    createdAt: new Date().toISOString(),
    clientId: client.id,
  };
  persist({
    ...data,
    requests: [request, ...data.requests],
    createdClients: [client, ...data.createdClients],
  });
  return request;
}

export function resetDemo() {
  localStorage.removeItem(DATA_KEY);
  data = emptyData();
  emit();
}

export function signIn() {
  localStorage.setItem(SESSION_KEY, new Date().toISOString());
  signedIn = true;
  emit();
}

export function signOut() {
  localStorage.removeItem(SESSION_KEY);
  signedIn = false;
  emit();
}

export function useSignedIn(): boolean {
  return useSyncExternalStore(subscribe, () => signedIn);
}

function applyEdits<T extends { id: string }>(
  items: T[],
  edits: Record<string, T>,
): T[] {
  return items.map((item) => edits[item.id] ?? item);
}

export function useDemoData() {
  const snapshot = useSyncExternalStore(subscribe, () => data);
  return {
    providers: applyEdits(
      [...snapshot.createdProviders, ...seedProviders],
      snapshot.edits.providers,
    ),
    volunteers: applyEdits(
      [...snapshot.createdVolunteers, ...seedVolunteers],
      snapshot.edits.volunteers,
    ),
    clients: applyEdits(
      [...snapshot.createdClients, ...seedClients],
      snapshot.edits.clients,
    ),
    requests: [...snapshot.requests, ...seedRequests],
  };
}

export function getRequest(id: string): SupportRequest | undefined {
  return [...data.requests, ...seedRequests].find(
    (request) => request.id === id,
  );
}
