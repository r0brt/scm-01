import { defineConfig } from "@playwright/test";

const e2eFrontendPort = Number(process.env.SCM_E2E_FRONTEND_PORT ?? "14173");
const e2eBackendPort = Number(process.env.SCM_E2E_BACKEND_PORT ?? "18000");

export default defineConfig({
  testDir: "./e2e",
  use: {
    baseURL: `http://127.0.0.1:${e2eFrontendPort}`,
    headless: true,
  },
  webServer: [
    {
      command:
        `SCM_INITIALIZE_SCHEMA=1 SCM_DATABASE_URL=sqlite+pysqlite:///./e2e.db UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run uvicorn app.main:app --host 127.0.0.1 --port ${e2eBackendPort}`,
      cwd: "../backend",
      url: `http://127.0.0.1:${e2eBackendPort}/health`,
      reuseExistingServer: false,
    },
    {
      command:
        `SCM_API_BASE_URL=http://127.0.0.1:${e2eBackendPort} npm run dev -- --host 127.0.0.1 --port ${e2eFrontendPort}`,
      cwd: ".",
      url: `http://127.0.0.1:${e2eFrontendPort}`,
      reuseExistingServer: false,
    },
  ],
});
