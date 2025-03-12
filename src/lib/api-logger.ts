// api-logger.ts
"use server";

import { MongoClient } from "mongodb";

// Define the log entry type
export interface ApiLogEntry {
  id: string;
  timestamp: string;
  endpoint: string;
  method: string;
  path: string;
  request: any;
  response: any;
  status: number;
  duration: number;
}

// In-memory store (used as a fallback + for local usage)
let apiLogs: ApiLogEntry[] = [];

// Reusable MongoDB client / database reference
let client: MongoClient | null = null;

/**
 * Connect to MongoDB once and reuse the client.
 */
async function connectToMongoDB() {
  // Use your actual connection string here, typically from an env variable
  // e.g. process.env.NEXT_PUBLIC_MONGO_URI or process.env.MONGO_URI
  // This example hardcodes MONGO_URI for brevity
  const MONGO_URI =
    process.env.NEXT_PUBLIC_MONGO_URI ||
    "";

  if (!client) {
    client = new MongoClient(MONGO_URI);
    await client.connect();
  }
  return client.db("greptile-playground"); // adjust your DB name
}

/**
 * Save a log entry to MongoDB
 */
async function saveLogToDB(logEntry: ApiLogEntry): Promise<void> {
  try {
    const db = await connectToMongoDB();
    await db.collection("apiLogs").insertOne(logEntry);
    // Optionally console.log or do something after saving
  } catch (error) {
    console.error("Failed to save log to MongoDB:", error);
  }
}

/**
 * Fetch all logs from MongoDB
 */
async function fetchAllLogsFromDB(): Promise<ApiLogEntry[]> {
  try {
    const db = await connectToMongoDB();
    const logs = await db
      .collection("apiLogs")
      .find()
      .sort({ timestamp: -1 })
      .toArray();
    // Convert _id to string if needed, or omit it. Return them as ApiLogEntry
    return logs.map((log) => ({
      id: log._id.toString(),
      timestamp: log.timestamp,
      endpoint: log.endpoint,
      method: log.method,
      path: log.path,
      request: log.request,
      response: log.response,
      status: log.status,
      duration: log.duration,
    }));
  } catch (error) {
    console.error("Failed to fetch logs from MongoDB:", error);
    return [];
  }
}

/**
 * Log an API request (locally + MongoDB).
 */
export async function logApiRequest(logEntry: ApiLogEntry): Promise<void> {
  // Push to in-memory array
  apiLogs.push(logEntry);

  // Also store in localStorage for ephemeral usage
  try {
    const existingLogs = JSON.parse(localStorage.getItem("apiLogs") || "[]");
    existingLogs.push(logEntry);
    localStorage.setItem("apiLogs", JSON.stringify(existingLogs));
  } catch (error) {
    console.error("Failed to store log in localStorage:", error);
  }

  // Finally, save to MongoDB
  await saveLogToDB(logEntry);
}

/**
 * Get all logs (from DB or localStorage).
 * If you want **only** MongoDB logs, skip localStorage usage.
 */
export async function getApiLogs(): Promise<ApiLogEntry[]> {
  try {
    // Attempt to fetch from Mongo first
    const dbLogs = await fetchAllLogsFromDB();
    if (dbLogs && dbLogs.length > 0) {
      return dbLogs;
    }
  } catch (error) {
    console.error(
      "Failed to fetch logs from MongoDB, falling back to localStorage:",
      error
    );
  }

  // Fallback to localStorage
  try {
    const storedLogs = localStorage.getItem("apiLogs");
    if (storedLogs) {
      apiLogs = JSON.parse(storedLogs);
      return apiLogs;
    }
  } catch (error) {
    console.error("Failed to retrieve logs from localStorage:", error);
  }

  return apiLogs;
}

/**
 * Get a specific log by ID.
 */
export async function getApiLogById(
  id: string
): Promise<ApiLogEntry | undefined> {
  try {
    const storedLogs = localStorage.getItem("apiLogs");
    if (storedLogs) {
      apiLogs = JSON.parse(storedLogs);
    }
  } catch (error) {
    console.error("Failed to retrieve logs from localStorage:", error);
  }

  return apiLogs.find((log) => log.id === id);
}

/**
 * Clear all logs (local + Mongo).
 */
export async function clearApiLogs(): Promise<void> {
  // Clear local in-memory + localStorage
  apiLogs = [];
  localStorage.removeItem("apiLogs");

  // Optional: clear in Mongo
  try {
    const db = await connectToMongoDB();
    await db.collection("apiLogs").deleteMany({});
  } catch (error) {
    console.error("Failed to clear logs from MongoDB:", error);
  }
}
