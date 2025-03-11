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
import { CodeBlock } from "@/components/code-block";
import { logApiRequest } from "@/lib/api-logger";

interface APIEndpoint {
  id: string;
  method: string;
  path: string;
  title: string;
  description: string;
}

/**
 * Utility to safely parse JSON.
 * Returns [data, error] tuple.
 */
function safeJsonParse(input: string): [any, string | null] {
  try {
    return [JSON.parse(input), null];
  } catch (err: any) {
    return [null, err.message];
  }
}

interface APIModalProps {
  isOpen: boolean;
  onClose: () => void;
  endpoint: APIEndpoint;
}

export function APIModal({ isOpen, onClose, endpoint }: APIModalProps) {
  // ------------------------------------------------------
  // 1) State for user inputs
  // ------------------------------------------------------
  const [authorization, setAuthorization] = useState("");
  const [githubToken, setGithubToken] = useState("");
  const [repositoryId, setRepositoryId] = useState("123"); // for GET repo info
  // For "index-repository"
  const [remote, setRemote] = useState("github");
  const [repository, setRepository] = useState("owner/repo");
  const [branch, setBranch] = useState("main");
  const [reload, setReload] = useState("true");
  const [notify, setNotify] = useState("true");

  // For "query-repo"
  const [messageContent, setMessageContent] = useState(
    "How does authentication work?"
  );
  const [queryRemote, setQueryRemote] = useState("github");
  const [queryRepository, setQueryRepository] = useState("owner/repo");
  const [queryBranch, setQueryBranch] = useState("main");
  const [stream, setStream] = useState("true");
  const [genius, setGenius] = useState("true");

  // ------------------------------------------------------
  // 2) State for response / loading / error
  // ------------------------------------------------------
  const [response, setResponse] = useState<string | null>(null);
  const [httpCode, setHttpCode] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ------------------------------------------------------
  // 3) Build the cURL code snippet
  // ------------------------------------------------------
  const getRequestCode = () => {
    switch (endpoint.id) {
      case "index-repository":
        return `curl --request POST \\
  --url https://api.greptile.com/v2/repositories \\
  --header 'Authorization: ${authorization || "Bearer <token>"}' \\
  --header 'Content-Type: application/json' \\
  --header 'X-GitHub-Token: ${githubToken || "<api-key>"}' \\
  --data '{
    "remote": "${remote}",
    "repository": "${repository}",
    "branch": "${branch}",
    "reload": ${reload},
    "notify": ${notify}
}'`;
      case "get-repository-info":
        return `curl --request GET \\
  --url https://api.greptile.com/v2/repositories/${repositoryId} \\
  --header 'Authorization: ${authorization || "Bearer <token>"}'`;
      case "query-repo":
        return `curl --request POST \\
  --url https://api.greptile.com/v2/query \\
  --header 'Authorization: ${authorization || "Bearer <token>"}' \\
  --header 'Content-Type: application/json' \\
  --header 'X-GitHub-Token: ${githubToken || "<api-key>"}' \\
  --data '{
    "messages": [
      {
        "id": "msg1",
        "content": "${messageContent}",
        "role": "user"
      }
    ],
    "repositories": [
      {
        "remote": "${queryRemote}",
        "branch": "${queryBranch}",
        "repository": "${queryRepository}"
      }
    ],
    "sessionId": "session123",
    "stream": ${stream},
    "genius": ${genius}
}'`;
      default:
        return "";
    }
  };

  // ------------------------------------------------------
  // 4) Handle "Send" (actual fetch call)
  // ------------------------------------------------------
  //   const handleSend = async () => {
  //     setIsLoading(true);
  //     setError(null);
  //     setResponse(null);
  //     setHttpCode(null);

  //     // Construct request parameters
  //     let url = "";
  //     let options: RequestInit = {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     };

  //     // Common headers for all endpoints that might need them
  //     if (authorization) {
  //       (options.headers as Record<string, string>)["Authorization"] =
  //         authorization;
  //     }
  //     if (githubToken) {
  //       (options.headers as Record<string, string>)["X-GitHub-Token"] =
  //         githubToken;
  //     }

  //     try {
  //       switch (endpoint.id) {
  //         case "index-repository": {
  //           url = "https://api.greptile.com/v2/repositories";
  //           options.method = "POST";
  //           options.body = JSON.stringify({
  //             remote,
  //             repository,
  //             branch,
  //             reload: reload === "true",
  //             notify: notify === "true",
  //           });
  //           break;
  //         }

  //         case "get-repository-info": {
  //           url = `https://api.greptile.com/v2/repositories/${repositoryId}`;
  //           options.method = "GET";
  //           // GET requests shouldn’t have a body
  //           delete options.body;
  //           break;
  //         }

  //         case "query-repo": {
  //           url = "https://api.greptile.com/v2/query";
  //           options.method = "POST";
  //           options.body = JSON.stringify({
  //             messages: [
  //               {
  //                 id: "msg1",
  //                 content: messageContent,
  //                 role: "user",
  //               },
  //             ],
  //             repositories: [
  //               {
  //                 remote: queryRemote,
  //                 branch: queryBranch,
  //                 repository: queryRepository,
  //               },
  //             ],
  //             sessionId: "session123",
  //             stream: stream === "true",
  //             genius: genius === "true",
  //           });
  //           break;
  //         }

  //         default:
  //           throw new Error("Unknown endpoint ID");
  //       }

  //       // ------------------------------------------------------
  //       // 5) Do the fetch
  //       // ------------------------------------------------------
  //       const res = await fetch(url, options);

  //       setHttpCode(res.status);

  //       // In case of non-JSON or error codes:
  //       const text = await res.text();

  //       if (!res.ok) {
  //         // Not 2xx: handle as an error
  //         setError(
  //           `Request failed with status ${res.status}.\n\nResponse:\n${text}`
  //         );
  //       } else {
  //         // Attempt to parse JSON
  //         const [data, parseError] = safeJsonParse(text);
  //         if (parseError) {
  //           // If JSON parse fails, display the raw text
  //           setResponse(text);
  //         } else {
  //           // Format JSON nicely
  //           setResponse(JSON.stringify(data, null, 2));
  //         }
  //       }
  //     } catch (err: any) {
  //       setError(err.message || String(err));
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  // 4) Handle "Send" (actual fetch call)

  const [selectedTab, setSelectedTab] = useState("request");
  const handleSend = async () => {
    const startTime = Date.now(); // Track start time for duration

    setIsLoading(true);
    setError(null);
    setResponse(null);
    setHttpCode(null);

    let url = "";
    let options: RequestInit = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (authorization) {
      (options.headers as Record<string, string>)["Authorization"] =
        authorization;
    }
    if (githubToken) {
      (options.headers as Record<string, string>)["X-GitHub-Token"] =
        githubToken;
    }

    switch (endpoint.id) {
      case "index-repository": {
        url = "https://api.greptile.com/v2/repositories";
        options.method = "POST";
        options.body = JSON.stringify({
          remote,
          repository,
          branch,
          reload: reload === "true",
          notify: notify === "true",
        });
        break;
      }

      case "get-repository-info": {
        url = `https://api.greptile.com/v2/repositories/${repositoryId}`;
        options.method = "GET";
        // GET requests shouldn’t have a body
        delete options.body;
        break;
      }

      case "query-repo": {
        url = "https://api.greptile.com/v2/query";
        options.method = "POST";
        options.body = JSON.stringify({
          messages: [
            {
              id: "msg1",
              content: messageContent,
              role: "user",
            },
          ],
          repositories: [
            {
              remote: queryRemote,
              branch: queryBranch,
              repository: queryRepository,
            },
          ],
          sessionId: "session123",
          stream: stream === "true",
          genius: genius === "true",
        });
        break;
      }
      default:
        throw new Error("Unknown endpoint ID");
    }

    try {
      const res = await fetch(url, options);
      setHttpCode(res.status);
      console.log("res from send", res);

      const endTime = Date.now();
      const duration = endTime - startTime; // in ms

      // read response
      const text = await res.text();

      // handle error or parse JSON as you do
      if (!res.ok) {
        setError(
          `Request failed with status ${res.status}.\n\nResponse:\n${text}`
        );
      } else {
        const [data, parseError] = safeJsonParse(text);
        console.log("data from safeparse", data);
        if (parseError) {
          setResponse(text);
        } else {
          setResponse(JSON.stringify(data, null, 2));
        }
      }

      const logEntry = {
        id: "log-" + Date.now(),
        timestamp: new Date().toISOString(),
        endpoint: endpoint.path,
        method: endpoint.method,
        path: url.replace("https://api.greptile.com", ""), // or just use endpoint.path
        request: {
          headers: options.headers,
          body:
            options.method === "GET"
              ? {}
              : JSON.parse((options.body as string) || "{}"),
        },
        response: !res.ok ? { error: text } : safeJsonParse(text)[0] ?? text,
        status: res.status,
        duration,
      };

      // now log it
      await logApiRequest(logEntry);
    } catch (err: any) {
      setError(err.message || String(err));
      console.error("Fetch error:", err);
    } finally {
      setSelectedTab("response");
      setIsLoading(false);
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
              {/* <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button> */}
            </div>
          </SheetHeader>

          <div className="flex flex-1 overflow-hidden">
            {/* Left panel: Form inputs */}
            <div className="flex-1 overflow-auto border-r p-6">
              <h3 className="text-lg font-semibold mb-4">{endpoint.title}</h3>
              <p className="text-sm text-muted-foreground mb-6">
                {endpoint.description}
              </p>

              {/* ---------- index-repository  ---------- */}
              {endpoint.id === "index-repository" && (
                <>
                  <div className="space-y-4 mb-6">
                    <div>
                      <Label htmlFor="auth-token">Authorization</Label>
                      <Input
                        id="auth-token"
                        placeholder="Bearer <token>"
                        value={authorization}
                        onChange={(e) => setAuthorization(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Bearer authentication header
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="github-token">X-GitHub-Token</Label>
                      <Input
                        id="github-token"
                        placeholder="<api-key>"
                        value={githubToken}
                        onChange={(e) => setGithubToken(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <Label htmlFor="remote">Remote</Label>
                      <Select
                        value={remote}
                        onValueChange={(val) => setRemote(val)}
                      >
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
                      <Input
                        id="repository"
                        placeholder="owner/repository"
                        value={repository}
                        onChange={(e) => setRepository(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="branch">Branch</Label>
                      <Input
                        id="branch"
                        placeholder="main"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="reload">Reload</Label>
                      <Select
                        value={reload}
                        onValueChange={(val) => setReload(val)}
                      >
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
                      <Select
                        value={notify}
                        onValueChange={(val) => setNotify(val)}
                      >
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

              {/* ---------- get-repository-info  ---------- */}
              {endpoint.id === "get-repository-info" && (
                <div className="space-y-4 mb-6">
                  <div>
                    <Label htmlFor="auth-token">Authorization</Label>
                    <Input
                      id="auth-token"
                      placeholder="Bearer <token>"
                      value={authorization}
                      onChange={(e) => setAuthorization(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Bearer authentication header
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="repository-id">Repository ID</Label>
                    <Input
                      id="repository-id"
                      placeholder="123"
                      value={repositoryId}
                      onChange={(e) => setRepositoryId(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* ---------- query-repo  ---------- */}
              {endpoint.id === "query-repo" && (
                <>
                  <div className="space-y-4 mb-6">
                    <div>
                      <Label htmlFor="auth-token">Authorization</Label>
                      <Input
                        id="auth-token"
                        placeholder="Bearer <token>"
                        value={authorization}
                        onChange={(e) => setAuthorization(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Bearer authentication header
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="github-token">X-GitHub-Token</Label>
                      <Input
                        id="github-token"
                        placeholder="<api-key>"
                        value={githubToken}
                        onChange={(e) => setGithubToken(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <Label htmlFor="message-content">Message Content</Label>
                      <Input
                        id="message-content"
                        placeholder="How does authentication work?"
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="repository">Repository</Label>
                      <Input
                        id="repository"
                        placeholder="owner/repository"
                        value={queryRepository}
                        onChange={(e) => setQueryRepository(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="remote">Remote</Label>
                      <Select
                        value={queryRemote}
                        onValueChange={(val) => setQueryRemote(val)}
                      >
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
                      <Input
                        id="branch"
                        placeholder="main"
                        value={queryBranch}
                        onChange={(e) => setQueryBranch(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="stream">Stream</Label>
                      <Select
                        value={stream}
                        onValueChange={(val) => setStream(val)}
                      >
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
                      <Select
                        value={genius}
                        onValueChange={(val) => setGenius(val)}
                      >
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

            {/* Right panel: Request/Response tabs */}
            <div className="flex-1 overflow-auto p-0">
              <Tabs
                defaultValue={selectedTab}
                className="h-full flex flex-col"
                onValueChange={(val) => setSelectedTab(val)}
                value={selectedTab}
              >
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
                  {/* If there's an HTTP code, show it */}
                  {httpCode && (
                    <div
                      className={`p-2 text-sm flex items-center gap-2 ${
                        httpCode >= 200 && httpCode < 300
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      <span className="font-medium">{httpCode}</span>
                      <span>
                        {httpCode >= 200 && httpCode < 300
                          ? "Success"
                          : "Error Occurred"}
                      </span>
                    </div>
                  )}

                  {/* If there's an error, show it */}
                  {error && (
                    <div className="p-4 text-sm text-red-700 whitespace-pre-wrap">
                      {error}
                    </div>
                  )}

                  {/* If there's a response, show it */}
                  {response ? (
                    <div className="relative h-full">
                      <div className="absolute top-2 right-2 z-10">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <CodeBlock language="json" code={response} />
                    </div>
                  ) : !error ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      Send a request to see the response
                    </div>
                  ) : null}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
