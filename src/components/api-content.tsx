"use client";

import { ChevronDown, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/code-block";

interface APIEndpoint {
  id: string;
  method: string;
  path: string;
  title: string;
  description: string;
}
interface APIContentCardProps {
  endpoint: APIEndpoint;
  onTryIt: (endpoint: APIEndpoint) => void;
}

export function APIContent({ endpoint, onTryIt }: APIContentCardProps) {
  // Example: return different request/response examples
  const getRequestExample = (endpoint: APIEndpoint) => {
    switch (endpoint.id) {
      case "index-repository":
        return `curl --request POST \\
  --url https://api.greptile.com/v2/repositories \\
  --header 'Authorization: Bearer <token>' \\
  --header 'Content-Type: application/json' \\
  --header 'X-GitHub-Token: <api-key>' \\
  --data '{
  "remote": "<string>",
  "repository": "<string>",
  "branch": "<string>",
  "reload": true,
  "notify": true
}'`;
      case "get-repository-info":
        return `curl --request GET \\
  --url https://api.greptile.com/v2/repositories/{repositoryId} \\
  --header 'Authorization: Bearer <token>'`;
      case "query-repo":
        return `curl --request POST \\
  --url https://api.greptile.com/v2/query \\
  --header 'Authorization: Bearer <token>' \\
  --header 'Content-Type: application/json' \\
  --header 'X-GitHub-Token: <api-key>' \\
  --data '{
  "messages": [
    {
      "id": "<string>",
      "content": "<string>",
      "role": "<string>"
    }
  ],
  "repositories": [
    {
      "remote": "<string>",
      "branch": "<string>",
      "repository": "<string>"
    }
  ],
  "sessionId": "<string>",
  "stream": true,
  "genius": true
}'`;
      default:
        return "";
    }
  };

  const getResponseExample = (endpoint: APIEndpoint) => {
    switch (endpoint.id) {
      case "index-repository":
        return `{
  "message": "<string>",
  "statusEndpoint": "<string>"
}`;
      case "get-repository-info":
        return `{
  "repository": "<string>",
  "remote": "<string>",
  "branch": "<string>",
  "private": true,
  "status": "<string>",
  "filesProcessed": 123,
  "numFiles": 123,
  "sha": "<string>"
}`;
      case "query-repo":
        return `{
  "message": "<string>",
  "sources": [
    {
      "repository": "<string>",
      "remote": "<string>",
      "branch": "<string>",
      "filepath": "<string>",
      "linestart": 123,
      "lineend": 123,
      "summary": "<string>"
    }
  ]
}`;
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-white rounded shadow p-6 relative">
      {/* A small timeline “dot” or “line” on the left, purely optional */}
      <div className="absolute left-0 top-6 -translate-x-1/2 w-1 bg-muted h-full" />
      <div className="relative">
        <span className="text-sm text-muted-foreground">API Reference</span>
        <h1 className="text-2xl font-bold">{endpoint.title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`text-sm font-medium px-2 py-1 rounded ${
            endpoint.method === "GET"
              ? "bg-green-100 text-green-700"
              : endpoint.method === "POST"
              ? "bg-blue-100 text-blue-700"
              : endpoint.method === "PUT"
              ? "bg-amber-100 text-amber-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {endpoint.method}
        </span>
        <code className="text-sm bg-muted px-2 py-1 rounded">
          {endpoint.path}
        </code>
      </div>

      <p className="text-muted-foreground">{endpoint.description}</p>

      <Button
        onClick={() => onTryIt(endpoint)}
        className="flex items-center gap-2 self-start"
      >
        Try it <ChevronDown className="h-4 w-4" />
      </Button>

      <Tabs defaultValue="curl" className="mt-4">
        <TabsList className="mb-4">
          <TabsTrigger value="curl">cURL</TabsTrigger>
          <TabsTrigger value="python">Python</TabsTrigger>
          <TabsTrigger value="javascript">JavaScript</TabsTrigger>
          <TabsTrigger value="php">PHP</TabsTrigger>
          <TabsTrigger value="go">Go</TabsTrigger>
          <TabsTrigger value="java">Java</TabsTrigger>
        </TabsList>
        <TabsContent value="curl" className="relative">
          <div className="absolute top-2 right-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          {getRequestExample(endpoint) ? (
            <CodeBlock language="bash" code={getRequestExample(endpoint)} />
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No example available
            </div>
          )}
        </TabsContent>
        {/* ...the other language tabs, just placeholders... */}
        <TabsContent value="python">
          <div className="p-4 text-center text-muted-foreground">
            Python example coming soon
          </div>
        </TabsContent>
        <TabsContent value="javascript">
          <div className="p-4 text-center text-muted-foreground">
            JavaScript example coming soon
          </div>
        </TabsContent>
        <TabsContent value="php">
          <div className="p-4 text-center text-muted-foreground">
            PHP example coming soon
          </div>
        </TabsContent>
        <TabsContent value="go">
          <div className="p-4 text-center text-muted-foreground">
            Go example coming soon
          </div>
        </TabsContent>
        <TabsContent value="java">
          <div className="p-4 text-center text-muted-foreground">
            Java example coming soon
          </div>
        </TabsContent>
      </Tabs>

      <h2 className="text-xl font-semibold mt-4">Response</h2>
      <div className="relative">
        <div className="absolute top-2 right-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        {getResponseExample(endpoint) ? (
          <CodeBlock language="json" code={getResponseExample(endpoint)} />
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            No example available
          </div>
        )}
      </div>
    </div>
  );
}
