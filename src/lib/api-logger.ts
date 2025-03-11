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

// Mock database storage
let apiLogs: ApiLogEntry[] = [];

// Function to log an API request
export function logApiRequest(logEntry: ApiLogEntry): void {
  apiLogs.push(logEntry);
  // In a real app, this would save to a database
  console.log("API request logged:", logEntry);

  // Store in localStorage for persistence
  try {
    const existingLogs = JSON.parse(localStorage.getItem("apiLogs") || "[]");
    existingLogs.push(logEntry);
    localStorage.setItem("apiLogs", JSON.stringify(existingLogs));
  } catch (error) {
    console.error("Failed to store log in localStorage:", error);
  }
}

// Function to get all API logs
export function getApiLogs(): ApiLogEntry[] {
  // Try to get from localStorage first
  try {
    const storedLogs = localStorage.getItem("apiLogs");
    if (storedLogs) {
      apiLogs = JSON.parse(storedLogs);
    } else if (apiLogs.length === 0) {
      // If no logs in localStorage and no logs in memory, generate mock logs
      generateMockLogs();
    }
  } catch (error) {
    console.error("Failed to retrieve logs from localStorage:", error);
    if (apiLogs.length === 0) {
      generateMockLogs();
    }
  }

  return apiLogs;
}

// Function to get a specific log by ID
export function getApiLogById(id: string): ApiLogEntry | undefined {
  // Try to get from localStorage first
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

// Function to clear all logs
export function clearApiLogs(): void {
  apiLogs = [];
  localStorage.removeItem("apiLogs");
}

// Function to generate mock logs for testing
export function generateMockLogs(): void {
  const mockLogs: ApiLogEntry[] = [];

  // Generate timestamps for the last 7 days
  const now = new Date();
  const timestamps = Array.from({ length: 20 }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - Math.floor(Math.random() * 7));
    date.setHours(date.getHours() - Math.floor(Math.random() * 24));
    date.setMinutes(date.getMinutes() - Math.floor(Math.random() * 60));
    return date.toISOString();
  }).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  // Mock endpoints
  const endpoints = [
    {
      id: "index-repository",
      method: "POST",
      path: "/v2/repositories",
      title: "Index Repository",
    },
    {
      id: "get-repository-info",
      method: "GET",
      path: "/v2/repositories/123",
      title: "Get Repository Info",
    },
    {
      id: "query-repo",
      method: "POST",
      path: "/v2/query",
      title: "Query Repo",
    },
  ];

  // Generate mock logs
  timestamps.forEach((timestamp, index) => {
    const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
    const status =
      Math.random() > 0.8 ? (Math.random() > 0.5 ? 400 : 500) : 200;
    const duration = Math.floor(Math.random() * 900) + 100; // 100-1000ms

    let requestBody = {};
    let responseBody = {};

    if (endpoint.id === "index-repository") {
      requestBody = {
        remote: "github",
        repository: "user/repo",
        branch: "main",
        reload: true,
        notify: true,
      };
      responseBody = {
        message: "Repository indexing started",
        statusEndpoint: "https://api.greptile.com/v2/repositories/123/status",
      };
    } else if (endpoint.id === "get-repository-info") {
      requestBody = {};
      responseBody = {
        repository: "user/repo",
        remote: "github",
        branch: "main",
        private: true,
        status: "completed",
        filesProcessed: 123,
        numFiles: 123,
        sha: "abc123def456",
      };
    } else if (endpoint.id === "query-repo") {
      requestBody = {
        messages: [
          {
            id: "msg1",
            content: "How does authentication work?",
            role: "user",
          },
        ],
        repositories: [
          {
            remote: "github",
            branch: "main",
            repository: "user/repo",
          },
        ],
        sessionId: "session123",
        stream: true,
        genius: true,
      };
      responseBody = {
        message: "This is the response to your query",
        sources: [
          {
            repository: "user/repo",
            remote: "github",
            branch: "main",
            filepath: "src/main.js",
            linestart: 10,
            lineend: 20,
            summary: "Function that handles authentication",
          },
        ],
      };
    }

    // Add error message for failed requests
    if (status >= 400) {
      responseBody = {
        error:
          status === 400
            ? "Bad request: Invalid parameters"
            : "Server error: Failed to process request",
        code: status,
      };
    }

    mockLogs.push({
      id: `mock-${index}`,
      timestamp,
      endpoint: endpoint.id,
      method: endpoint.method,
      path: endpoint.path,
      request: {
        headers: {
          Authorization: "Bearer mock-token",
          "Content-Type": "application/json",
          ...(endpoint.id !== "get-repository-info"
            ? { "X-GitHub-Token": "mock-github-token" }
            : {}),
        },
        body: requestBody,
      },
      response: responseBody,
      status,
      duration,
    });
  });

  // Save mock logs
  apiLogs = mockLogs;
  try {
    localStorage.setItem("apiLogs", JSON.stringify(mockLogs));
  } catch (error) {
    console.error("Failed to store mock logs in localStorage:", error);
  }
}
