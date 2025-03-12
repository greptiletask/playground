"use client";

import React from "react";
import { useRef } from "react";
import { APIReference } from "@/components/api-reference";
import { APIModal } from "@/components/api-modal";
import { APIContent } from "@/components/api-content";
import { Send, Download, Search } from "lucide-react";
import { APIEndpoint } from "@/types/endpoint";



export function APIPlayground() {
  const endpoints: APIEndpoint[] = [
    {
      id: "index-repository",
      method: "POST",
      path: "/v2/repositories",
      title: "Index Repository",
      description:
        "Initiates processing or reprocessing of a specified repository.",
    },
    {
      id: "get-repository-info",
      method: "GET",
      path: "/v2/repositories/{repositoryId}",
      title: "Get Repository Info",
      description: "Retrieves information about a specific repository.",
    },
    {
      id: "query-repo",
      method: "POST",
      path: "/v2/query",
      title: "Query Repo(s)",
      description: "Query repositories with natural language.",
    },
  ];

  // We'll keep track of which endpoint is open for "Try it" modal
  const [currentEndpoint, setCurrentEndpoint] =
    React.useState<APIEndpoint | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Refs for timeline cards
  const indexRepoRef = useRef<HTMLDivElement>(null!);
  const getRepoRef = useRef<HTMLDivElement>(null!);
  const queryRepoRef = useRef<HTMLDivElement>(null!);

  // Map ID -> ref
  const refMap: Record<string, React.RefObject<HTMLDivElement>> = {
    "index-repository": indexRepoRef,
    "get-repository-info": getRepoRef,
    "query-repo": queryRepoRef,
  };

  // Sidebar: user picks an endpoint
  const handleSelectEndpoint = (id: string) => {
    // Scroll to that card
    const targetRef = refMap[id];
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // "Try it" button in each card
  const handleTryIt = (endpoint: APIEndpoint) => {
    setCurrentEndpoint(endpoint);
    setIsModalOpen(true);
  };

  // Helper function to get the appropriate icon based on method
  const getMethodIcon = (method: string) => {
    switch (method) {
      case "POST":
        return <Send className="h-4 w-4 text-primary" />;
      case "GET":
        return <Download className="h-4 w-4 text-primary" />;
      case "QUERY":
      case "POST /query":
        return <Search className="h-4 w-4 text-primary" />;
      default:
        return <Send className="h-4 w-4 text-primary" />;
    }
  };

  // Helper function to get method color class
  const getMethodColorClass = (method: string) => {
    switch (method) {
      case "POST":
        return "bg-blue-500/10 text-blue-500 border-blue-200/30";
      case "GET":
        return "bg-green-500/10 text-green-500 border-green-200/30";
      default:
        return "bg-primary/10 text-primary border-primary/30";
    }
  };

  return (
    <div className="flex h-screen bg-background min-w-5xl">
      <APIReference
        endpoints={endpoints}
        selectedEndpoint=""
        onSelectEndpoint={handleSelectEndpoint}
      />

      {/* Timeline container */}
      <div className="flex-1 overflow-y-auto p-8 relative min-w-5xl">
        <h1 className="text-xl font-bold mb-8">API Reference</h1>

        <div className="timeline-container mt-8 relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[19px] top-6 bottom-0 w-[2px] bg-border" />

          {/* 1) Index Repository Card */}
          <div
            ref={indexRepoRef}
            id="endpoint-index-repository"
            className="timeline-item group relative pl-12 pb-10"
          >
            {/* Timeline dot */}
            <div className="timeline-dot absolute left-0 top-6 w-10 h-10 rounded-full border-4 border-background bg-blue-500/10 flex items-center justify-center z-10">
              <Send className="h-4 w-4 text-blue-500" />
            </div>

            {/* Method badge */}
            <div className="text-sm font-medium text-muted-foreground mb-3">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMethodColorClass(
                  "POST"
                )}`}
              >
                POST
              </span>
              <span className="ml-2 font-mono text-xs text-muted-foreground">
                {endpoints[0].path}
              </span>
            </div>

            <div className="card overflow-hidden border border-border/40 rounded-lg transition-all duration-200 hover:border-primary/20 hover:shadow-md">
              <APIContent endpoint={endpoints[0]} onTryIt={handleTryIt} />
            </div>
          </div>

          {/* 2) Get Repository Info Card */}
          <div
            ref={getRepoRef}
            id="endpoint-get-repository-info"
            className="timeline-item group relative pl-12 pb-10"
          >
            {/* Timeline dot */}
            <div className="timeline-dot absolute left-0 top-6 w-10 h-10 rounded-full border-4 border-background bg-green-500/10 flex items-center justify-center z-10">
              <Download className="h-4 w-4 text-green-500" />
            </div>

            {/* Method badge */}
            <div className="text-sm font-medium text-muted-foreground mb-3">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMethodColorClass(
                  "GET"
                )}`}
              >
                GET
              </span>
              <span className="ml-2 font-mono text-xs text-muted-foreground">
                {endpoints[1].path}
              </span>
            </div>

            <div className="card overflow-hidden border border-border/40 rounded-lg transition-all duration-200 hover:border-primary/20 hover:shadow-md">
              <APIContent endpoint={endpoints[1]} onTryIt={handleTryIt} />
            </div>
          </div>

          {/* 3) Query Repo Card */}
          <div
            ref={queryRepoRef}
            id="endpoint-query-repo"
            className="timeline-item group relative pl-12 pb-10"
          >
            {/* Timeline dot */}
            <div className="timeline-dot absolute left-0 top-6 w-10 h-10 rounded-full border-4 border-background bg-blue-500/10 flex items-center justify-center z-10">
              <Search className="h-4 w-4 text-blue-500" />
            </div>

            {/* Method badge */}
            <div className="text-sm font-medium text-muted-foreground mb-3">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMethodColorClass(
                  "POST"
                )}`}
              >
                POST
              </span>
              <span className="ml-2 font-mono text-xs text-muted-foreground">
                {endpoints[2].path}
              </span>
            </div>

            <div className="card overflow-hidden border border-border/40 rounded-lg transition-all duration-200 hover:border-primary/20 hover:shadow-md">
              <APIContent endpoint={endpoints[2]} onTryIt={handleTryIt} />
            </div>
          </div>
        </div>
      </div>

      {currentEndpoint && (
        <APIModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          endpoint={currentEndpoint}
        />
      )}
    </div>
  );
}
