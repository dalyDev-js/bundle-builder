import express from "express";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

/**
 * Minimal catalog API (the take-home's optional "backend" bonus).
 * It serves the exact same catalog.json the client bundles, so there is a
 * single source of truth and no data drift. The client falls back to the
 * bundled JSON if this server isn't running (see src/data/catalogClient.ts).
 */
const here = dirname(fileURLToPath(import.meta.url));
const catalog = JSON.parse(
  readFileSync(join(here, "../src/data/catalog.json"), "utf-8"),
);

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/catalog", (_req, res) => {
  res.json(catalog);
});

app.listen(PORT, () => {
  console.log(`[api] catalog server listening on http://localhost:${PORT}`);
});
