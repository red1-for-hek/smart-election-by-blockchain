import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes will be added here when backend is implemented
  // Currently serving as placeholder for frontend development
  
  const httpServer = createServer(app);
  return httpServer;
}