import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express, { type Express } from "express";
import type { Server } from "http";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function log(message: string) {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  console.log(`${formattedTime} [server] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const vite = await (
    await import("vite")
  ).createServer({
    server: { middlewareMode: true },
    appType: "spa",
  });

  app.use(vite.ssrFixStacktrace);
  app.use(vite.middlewares);
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "../dist/public");
  
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}`,
    );
  }

  app.use(express.static(distPath));
  
  app.get("*", (_req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Not found");
    }
  });
}