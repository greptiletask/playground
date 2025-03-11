"use client";

import { useState } from "react";
import { Copy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { APIEndpoint } from "@/components/api-playground";
import { CodeBlock } from "@/components/code-block";

interface APIModalProps {
  isOpen: boolean;
  onClose: () => void;
  endpoint: APIEndpoint;
}

export function APIModal({ isOpen, onClose, endpoint }: APIModalProps) {
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);

      if (endpoint.id === "index-repository") {
        setResponse(
          JSON.stringify(
            {
              message: "Repository indexing started",
              statusEndpoint:
                "https://api.greptile.com/v2/repositories/123/status",
            },
            null,
            2
          )
        );
      } else if (endpoint.id === "get-repository-info") {
        setResponse(
          JSON.stringify(
            {
              repository: "user/repo",
              remote: "github",
              branch: "main",
              private: true,
              status: "completed",
              filesProcessed: 123,
              numFiles: 123,
              sha: "abc123def456",
            },
            null,
            2
          )
        );
      } else if (endpoint.id === "query-repo") {
        setResponse(
          JSON.stringify(
            {
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
            },
            null,
            2
          )
        );
      }
    }, 1000);
  };

  const getRequestCode = () => {
    switch (endpoint.id) {
      case "index-repository":
        return `curl --request POST \\
  --url https://api.greptile.com/v2/repositories \\
  --header 'Authorization: Bearer <token>' \\
  --header 'Content-Type: application/json' \\
  --header 'X-GitHub-Token: <api-key>' \\
  --data '{
  "remote": "github",
  "repository": "user/repo",
  "branch": "main",
  "reload": true,
  "notify": true
}'`;
      case "get-repository-info":
        return `curl --request GET \\
  --url https://api.greptile.com/v2/repositories/123 \\
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
      "id": "msg1",
      "content": "How does authentication work?",
      "role": "user"
    }
  ],
  "repositories": [
    {
      "remote": "github",
      "branch": "main",
      "repository": "user/repo"
    }
  ],
  "sessionId": "session123",
  "stream": true,
  "genius": true
}'`;
      default:
        return "";
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full max-w-5xl p-0 sm:max-w-5xl">
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded ${
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
                <SheetTitle className="text-lg">{endpoint.path}</SheetTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>

          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 overflow-auto border-r p-6">
              <h3 className="text-lg font-semibold mb-4">{endpoint.title}</h3>
              <p className="text-sm text-muted-foreground mb-6">
                {endpoint.description}
              </p>

              {endpoint.id === "index-repository" && (
                <>
                  <div className="space-y-4 mb-6">
                    <div>
                      <Label htmlFor="auth-token">Authorization</Label>
                      <Input id="auth-token" placeholder="Bearer <token>" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Bearer authentication header
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="github-token">X-GitHub-Token</Label>
                      <Input id="github-token" placeholder="<api-key>" />
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <Label htmlFor="remote">Remote</Label>
                      <Select defaultValue="github">
                        <SelectTrigger id="remote">
                          <SelectValue placeholder="Select remote" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="github">github</SelectItem>
                          <SelectItem value="gitlab">gitlab</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="repository">Repository</Label>
                      <Input id="repository" placeholder="owner/repository" />
                    </div>

                    <div>
                      <Label htmlFor="branch">Branch</Label>
                      <Input id="branch" placeholder="main" />
                    </div>

                    <div>
                      <Label htmlFor="reload">Reload</Label>
                      <Select defaultValue="true">
                        <SelectTrigger id="reload">
                          <SelectValue placeholder="Select reload option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">true</SelectItem>
                          <SelectItem value="false">false</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="notify">Notify</Label>
                      <Select defaultValue="true">
                        <SelectTrigger id="notify">
                          <SelectValue placeholder="Select notify option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">true</SelectItem>
                          <SelectItem value="false">false</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}

              {endpoint.id === "get-repository-info" && (
                <div className="space-y-4 mb-6">
                  <div>
                    <Label htmlFor="auth-token">Authorization</Label>
                    <Input id="auth-token" placeholder="Bearer <token>" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Bearer authentication header
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="repository-id">Repository ID</Label>
                    <Input id="repository-id" placeholder="123" />
                  </div>
                </div>
              )}

              {endpoint.id === "query-repo" && (
                <>
                  <div className="space-y-4 mb-6">
                    <div>
                      <Label htmlFor="auth-token">Authorization</Label>
                      <Input id="auth-token" placeholder="Bearer <token>" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Bearer authentication header
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="github-token">X-GitHub-Token</Label>
                      <Input id="github-token" placeholder="<api-key>" />
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <Label htmlFor="message-content">Message Content</Label>
                      <Input
                        id="message-content"
                        placeholder="How does authentication work?"
                      />
                    </div>

                    <div>
                      <Label htmlFor="repository">Repository</Label>
                      <Input id="repository" placeholder="owner/repository" />
                    </div>

                    <div>
                      <Label htmlFor="remote">Remote</Label>
                      <Select defaultValue="github">
                        <SelectTrigger id="remote">
                          <SelectValue placeholder="Select remote" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="github">github</SelectItem>
                          <SelectItem value="gitlab">gitlab</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="branch">Branch</Label>
                      <Input id="branch" placeholder="main" />
                    </div>

                    <div>
                      <Label htmlFor="stream">Stream</Label>
                      <Select defaultValue="true">
                        <SelectTrigger id="stream">
                          <SelectValue placeholder="Select stream option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">true</SelectItem>
                          <SelectItem value="false">false</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="genius">Genius</Label>
                      <Select defaultValue="true">
                        <SelectTrigger id="genius">
                          <SelectValue placeholder="Select genius option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">true</SelectItem>
                          <SelectItem value="false">false</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}

              <Button
                onClick={handleSend}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send"}
              </Button>
            </div>

            <div className="flex-1 overflow-auto p-0">
              <Tabs defaultValue="request" className="h-full flex flex-col">
                <div className="border-b px-6 py-2">
                  <TabsList className="bg-transparent">
                    <TabsTrigger
                      value="request"
                      className="data-[state=active]:bg-muted"
                    >
                      Request
                    </TabsTrigger>
                    <TabsTrigger
                      value="response"
                      className="data-[state=active]:bg-muted"
                    >
                      Response
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="request" className="flex-1 p-0 m-0">
                  <Tabs defaultValue="curl" className="h-full flex flex-col">
                    <div className="border-b px-6 py-2">
                      <TabsList className="bg-transparent">
                        <TabsTrigger value="curl" className="text-xs">
                          cURL
                        </TabsTrigger>
                        <TabsTrigger value="python" className="text-xs">
                          Python
                        </TabsTrigger>
                        <TabsTrigger value="javascript" className="text-xs">
                          JavaScript
                        </TabsTrigger>
                        <TabsTrigger value="php" className="text-xs">
                          PHP
                        </TabsTrigger>
                        <TabsTrigger value="go" className="text-xs">
                          Go
                        </TabsTrigger>
                        <TabsTrigger value="java" className="text-xs">
                          Java
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent
                      value="curl"
                      className="flex-1 p-0 m-0 relative"
                    >
                      <div className="absolute top-2 right-2 z-10">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      {getRequestCode() ? (
                        <CodeBlock language="bash" code={getRequestCode()} />
                      ) : (
                        <div className="p-4 text-center text-muted-foreground">
                          No example available
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="python" className="flex-1 p-6 m-0">
                      <div className="text-center text-muted-foreground">
                        Python example coming soon
                      </div>
                    </TabsContent>

                    <TabsContent value="javascript" className="flex-1 p-6 m-0">
                      <div className="text-center text-muted-foreground">
                        JavaScript example coming soon
                      </div>
                    </TabsContent>

                    <TabsContent value="php" className="flex-1 p-6 m-0">
                      <div className="text-center text-muted-foreground">
                        PHP example coming soon
                      </div>
                    </TabsContent>

                    <TabsContent value="go" className="flex-1 p-6 m-0">
                      <div className="text-center text-muted-foreground">
                        Go example coming soon
                      </div>
                    </TabsContent>

                    <TabsContent value="java" className="flex-1 p-6 m-0">
                      <div className="text-center text-muted-foreground">
                        Java example coming soon
                      </div>
                    </TabsContent>
                  </Tabs>
                </TabsContent>

                <TabsContent value="response" className="flex-1 p-0 m-0">
                  {response ? (
                    <div className="relative h-full">
                      <div className="absolute top-2 right-2 z-10">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-2 bg-green-100 text-green-800 text-sm flex items-center gap-2">
                        <span className="font-medium">200</span>
                        <span>Success</span>
                      </div>
                      <CodeBlock language="json" code={response} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      Send a request to see the response
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
