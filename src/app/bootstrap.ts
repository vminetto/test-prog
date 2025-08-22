import { api } from "@/lib/axios";

if (import.meta.env.VITE_ENABLE_MOCK === "true") {
  const { initMockApi } = await import("@/mocks");
  initMockApi(api);
}
