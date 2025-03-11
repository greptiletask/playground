"use client";

import { ChevronDown, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { APIEndpoint } from "@/components/api-playground";
import { CodeBlock } from "@/components/code-block";
import { useEndpointState } from "@/lib/states/endpoint.state";
import { useEffect } from "react";
interface APIContentProps {
  endpoints: APIEndpoint[];
  selectedEndpoint: string;
  onTryIt: (endpoint: APIEndpoint) => void;
}

export function APIContent({
  endpoints,
  selectedEndpoint,
  onTryIt,
}: APIContentProps) {
  console.log("APIContent - selectedEndpoint:", selectedEndpoint);
  console.log("APIContent - endpoints:", endpoints);

  const { currentEndpointState } = useEndpointState();

  useEffect(() => {
    console.log("APIContent - currentEndpointState:", currentEndpointState);
  }, [currentEndpointState]);

  const endpoint = endpoints.find((e) => e.id === currentEndpointState);
  console.log("APIContent - found endpoint:", endpoint);

  if (!endpoint) {
    return (
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold">No Endpoint Selected</h1>
        <p className="mt-4 text-muted-foreground">
          Please select an endpoint from the sidebar to view its details.
        </p>
        <pre className="mt-4 p-4 bg-muted rounded">
          Selected ID: {selectedEndpoint}
          Available IDs: {endpoints.map((e) => e.id).join(", ")}
        </pre>
      </div>
    );
  }

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
    <div className="flex-1 overflow-auto">
      <div className="max-w-5xl min-w-5xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="text-sm text-muted-foreground mb-1">
              API Reference
            </div>
            <h1 className="text-3xl font-bold">{endpoint.title}</h1>
          </div>
          <Button
            onClick={() => onTryIt(endpoint)}
            className="flex items-center gap-2"
          >
            Try it <ChevronDown className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 mb-6">
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

        <p className="text-muted-foreground mb-8">{endpoint.description}</p>

        {endpoint.id === "index-repository" && (
          <>
            <h2 className="text-xl font-semibold mb-4">Authorizations</h2>
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">Authorization</span>
                <span className="text-sm text-muted-foreground">string</span>
                <span className="text-xs text-red-500">required</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Bearer authentication header of the form{" "}
                <code className="bg-muted px-1 py-0.5 rounded">
                  Bearer &lt;token&gt;
                </code>
                , where{" "}
                <code className="bg-muted px-1 py-0.5 rounded">
                  &lt;token&gt;
                </code>{" "}
                is your auth token.
              </p>

              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">X-GitHub-Token</span>
                <span className="text-sm text-muted-foreground">string</span>
                <span className="text-xs text-red-500">required</span>
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-4">Body</h2>
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">remote</span>
                <span className="text-sm text-muted-foreground">string</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Supported values are "github" or "gitlab".
              </p>

              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">repository</span>
                <span className="text-sm text-muted-foreground">string</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Repository identifier in "owner/repository" format.
              </p>

              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">branch</span>
                <span className="text-sm text-muted-foreground">string</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Branch name to index.
              </p>

              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">reload</span>
                <span className="text-sm text-muted-foreground">boolean</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                If false, won't reprocess if previously successful. Optional,
                default true.
              </p>

              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">notify</span>
                <span className="text-sm text-muted-foreground">boolean</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Whether to notify the user upon completion. Optional, default
                true.
              </p>
            </div>
          </>
        )}

        <Tabs defaultValue="curl" className="mt-8">
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

        <h2 className="text-xl font-semibold mt-8 mb-4">Response</h2>
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
    </div>
  );
}
