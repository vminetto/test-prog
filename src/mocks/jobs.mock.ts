import AxiosMockAdapter from "axios-mock-adapter";
import { AUTH_USER_KEY, loadJobs, saveJobs } from "./storage";

type MockJob = {
  id: number;
  title: string;
  description: string;
  location?: string;
  ownerId: number;
  createdAt?: string;
};

type CreateJobPayload = {
  title: string;
  description: string;
  location?: string;
};

type UpdateJobPayload = Partial<Pick<MockJob, "title" | "description" | "location">>;

type Me = { id: number };

function isMockJob(x: unknown): x is MockJob {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === "number" &&
    typeof o.title === "string" &&
    typeof o.description === "string" &&
    typeof o.ownerId === "number" &&
    (typeof o.createdAt === "string" || typeof o.createdAt === "undefined")
  );
}

function normalizeJobs(jobs: MockJob[]): MockJob[] {
  let mutated = false;
  const normalized = jobs.map(j => {
    if (!j.createdAt) {
      mutated = true;
      return { ...j, createdAt: new Date().toISOString() };
    }
    return j;
  });
  if (mutated) {
    saveJobs(normalized as unknown[]);
  }
  return normalized;
}

function getJobs(): MockJob[] {
  try {
    const raw = loadJobs() as unknown;
    if (Array.isArray(raw)) {
      const list = (raw as unknown[]).filter(isMockJob) as MockJob[];
      return normalizeJobs(list);
    }
    return [];
  } catch {
    return [];
  }
}

function getMe(): Me | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && typeof (parsed as Record<string, unknown>).id === "number") {
      return parsed as Me;
    }
    return null;
  } catch {
    return null;
  }
}

function seedJobsIfEmpty() {
  const raw = loadJobs() as unknown;
  const arr = Array.isArray(raw) ? (raw as unknown[]) : [];
  if (arr.length > 0) return;

  const now = new Date().toISOString();
  const seed: MockJob[] = [
    { id: 1, title: "Dev Frontend Sr", description: "React, TS, Vite", location: "Remoto", ownerId: 1, createdAt: now },
    { id: 2, title: "Dev Backend Go", description: "Gin, GORM, Postgres", location: "SP", ownerId: 2, createdAt: now },
  ];
  saveJobs(seed as unknown[]);
}

export function registerJobs(mock: AxiosMockAdapter) {
  seedJobsIfEmpty();

  mock.onGet("/jobs").reply(config => {
    const me = getMe();
    const q = (config.params?.q ?? "").toString().toLowerCase();
    const owner = (config.params?.owner ?? "all") as "me" | "others" | "all";

    let jobs = getJobs();

    if (me) {
      if (owner === "me")     jobs = jobs.filter(j => j.ownerId === me.id);
      if (owner === "others") jobs = jobs.filter(j => j.ownerId !== me.id);
    } else {
      if (owner !== "all") jobs = [];
    }

    if (q) {
      jobs = jobs.filter(j =>
        j.title.toLowerCase().includes(q) ||
        (j.description ?? "").toLowerCase().includes(q) ||
        (j.location ?? "").toLowerCase().includes(q)
      );
    }

    return [200, jobs] as const;
  });

  mock.onGet("/jobs/me").reply(() => {
    const me = getMe();
    if (!me) return [401, { message: "Não autenticado" }] as const;
    const jobs = getJobs().filter(j => j.ownerId === me.id);
    return [200, jobs] as const;
  });

  mock.onPost("/jobs").reply(config => {
    const me = getMe();
    if (!me) return [401, { message: "Não autenticado" }] as const;

    const body = ((): CreateJobPayload | null => {
      try {
        return JSON.parse(config.data || "{}") as CreateJobPayload;
      } catch {
        return null;
      }
    })();

    if (!body || !body.title || !body.description) {
      return [400, { message: "title e description são obrigatórios" }] as const;
    }

    const jobs = getJobs();
    const id = jobs.length ? Math.max(...jobs.map(j => j.id)) + 1 : 1;

    const job: MockJob = {
      id,
      title: body.title,
      description: body.description,
      location: body.location,
      ownerId: me.id,
      createdAt: new Date().toISOString(),
    };

    jobs.push(job);
    saveJobs(jobs as unknown[]);
    return [201, job] as const;
  });

  mock.onPatch(/\/jobs\/\d+$/).reply(config => {
    const me = getMe();
    if (!me) return [401, { message: "Não autenticado" }] as const;

    const id = Number(config.url!.split("/").pop());
    const jobs = getJobs();
    const idx = jobs.findIndex(j => j.id === id);
    if (idx === -1) return [404, { message: "Vaga não encontrada" }] as const;

    if (jobs[idx].ownerId !== me.id) return [403, { message: "Sem permissão" }] as const;

    const patch = ((): UpdateJobPayload => {
      try {
        return JSON.parse(config.data || "{}") as UpdateJobPayload;
      } catch {
        return {};
      }
    })();

    const updated: MockJob = { ...jobs[idx], ...patch };
    jobs[idx] = updated;
    saveJobs(jobs as unknown[]);
    return [200, updated] as const;
  });

  mock.onDelete(/\/jobs\/\d+$/).reply(config => {
    const me = getMe();
    if (!me) return [401, { message: "Não autenticado" }] as const;

    const id = Number(config.url!.split("/").pop());
    const jobs = getJobs();
    const idx = jobs.findIndex(j => j.id === id);
    if (idx === -1) return [404, { message: "Vaga não encontrada" }] as const;

    if (jobs[idx].ownerId !== me.id) return [403, { message: "Sem permissão" }] as const;

    const [removed] = jobs.splice(idx, 1);
    saveJobs(jobs as unknown[]);
    return [200, removed] as const;
  });
}
