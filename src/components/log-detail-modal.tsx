"use client";

import { useState } from "react";
import { X, Copy, ExternalLink, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";
import type { ApiLogEntry } from "@/lib/api-logger";

interface LogDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: ApiLogEntry;
}

export function LogDetailModal({ isOpen, onClose, log }: LogDetailModalProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [copied, setCopied] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-100 text-green-700";
      case "POST":
        return "bg-blue-100 text-blue-700";
      case "PUT":
        return "bg-amber-100 text-amber-700";
      case "DELETE":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) {
      return "bg-green-100 text-green-700";
    } else if (status >= 300 && status < 400) {
      return "bg-blue-100 text-blue-700";
    } else if (status >= 400 && status < 500) {
      return "bg-amber-100 text-amber-700";
    } else {
      return "bg-red-100 text-red-700";
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className={getMethodColor(log.method)}>{log.method}</Badge>
            <DialogTitle className="font-mono text-sm">{log.path}</DialogTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 overflow-hidden flex flex-col"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="request">Request</TabsTrigger>
            <TabsTrigger value="response">Response</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="flex-1 overflow-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Request Details</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Timestamp:</dt>
                      <dd>{formatDate(log.timestamp)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Method:</dt>
                      <dd>
                        <Badge className={getMethodColor(log.method)}>
                          {log.method}
                        </Badge>
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Endpoint:</dt>
                      <dd className="font-mono text-xs">{log.path}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Status:</dt>
                      <dd>
                        <Badge className={getStatusColor(log.status)}>
                          {log.status}
                        </Badge>
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Duration:</dt>
                      <dd>{log.duration}ms</dd>
                    </div>
                  </dl>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Headers</h3>
                  <div className="space-y-1">
                    {log.request.headers &&
                      Object.entries(log.request.headers).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between text-sm"
                          >
                            <span className="font-mono text-xs text-muted-foreground">
                              {key}:
                            </span>
                            <span className="font-mono text-xs">
                              {String(value)}
                            </span>
                          </div>
                        )
                      )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">Request Summary</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab("request")}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Full
                    </Button>
                  </div>
                  <div className="max-h-[150px] overflow-auto rounded-md bg-muted p-2">
                    <pre className="text-xs font-mono">
                      {JSON.stringify(log.request.body || {}, null, 2)}
                    </pre>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">Response Summary</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab("response")}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Full
                    </Button>
                  </div>
                  <div className="max-h-[150px] overflow-auto rounded-md bg-muted p-2">
                    <pre className="text-xs font-mono">
                      {JSON.stringify(log.response || {}, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="request"
            className="flex-1 overflow-auto relative"
          >
            <div className="absolute top-2 right-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  handleCopy(
                    JSON.stringify(
                      {
                        method: log.method,
                        path: log.path,
                        headers: log.request.headers,
                        body: log.request.body,
                      },
                      null,
                      2
                    )
                  )
                }
              >
                {copied ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <CodeBlock
              language="json"
              code={JSON.stringify(
                {
                  method: log.method,
                  path: log.path,
                  headers: log.request.headers,
                  body: log.request.body,
                },
                null,
                2
              )}
            />
          </TabsContent>

          <TabsContent
            value="response"
            className="flex-1 overflow-auto relative"
          >
            <div className="absolute top-2 right-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  handleCopy(JSON.stringify(log.response, null, 2))
                }
              >
                {copied ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="p-2 bg-green-100 text-green-800 text-sm flex items-center gap-2">
              <span className="font-medium">{log.status}</span>
              <span>
                {log.status >= 200 && log.status < 300 ? "Success" : "Error"}
              </span>
              <span className="ml-auto">{log.duration}ms</span>
            </div>
            <CodeBlock
              language="json"
              code={JSON.stringify(log.response, null, 2)}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
