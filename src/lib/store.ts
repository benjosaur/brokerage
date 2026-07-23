import { useSyncExternalStore } from "react";
import { seedClients, seedProviders, seedVolunteers } from "./seed";
import type { Client, SupportRequest } from "./types";

// All demo state lives in the browser. Seed data is compiled in; anything
// the user creates is layered on top via localStorage so the demo survives
// a reload but can always be wiped with resetDemo().

const DATA_KEY = "wcn-demo:data:v1";

interface DemoData {
  requests: SupportRequest[];
  createdClients: Client[];
}

const emptyData: DemoData = { requests: [], createdClients: [] };

function loadData(): DemoData {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (!raw) return emptyData;
    const parsed = JSON.parse(raw) as DemoData;
    if (!Array.isArray(parsed.requests) || !Array.isArray(parsed.createdClients)) {
      return emptyData;
    }
    return parsed;
  } catch {
    return emptyData;
  }
}

let data = loadData();

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

export function submitRequest(
  input: Omit<SupportRequest, "id" | "createdAt" | "clientId">,
): SupportRequest {
  const stamp = crypto.randomUUID().slice(0, 8);
  const client: Client = {
    id: `c-${stamp}`,
    name: input.name,
    locality: input.locality,
    services: input.services,
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
    requests: [request, ...data.requests],
    createdClients: [client, ...data.createdClients],
  });
  return request;
}

export function resetDemo() {
  localStorage.removeItem(DATA_KEY);
  data = emptyData;
  emit();
}

export function useDemoData() {
  const snapshot = useSyncExternalStore(subscribe, () => data);
  return {
    providers: seedProviders,
    volunteers: seedVolunteers,
    clients: [...snapshot.createdClients, ...seedClients],
    requests: snapshot.requests,
  };
}

export function getRequest(id: string): SupportRequest | undefined {
  return data.requests.find((request) => request.id === id);
}
