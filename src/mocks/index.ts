
import type { AxiosInstance } from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { seed } from "./storage";
import { registerAuth } from "./auth.mock";
import { registerJobs } from "./jobs.mock";
import { registerApplications } from "./applications.mock";
import { registerProfile } from "./profile.mock";

export function initMockApi(api: AxiosInstance) {
  seed();
  const mock = new AxiosMockAdapter(api, { delayResponse: 400 });

  registerAuth(mock);
  registerJobs(mock);
  registerApplications(mock);
  registerProfile(mock);

  return mock;
}
