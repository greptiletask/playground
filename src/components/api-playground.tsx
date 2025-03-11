"use client";

import { useState } from "react";
import { APIReference } from "@/components/api-reference";
import { APIContent } from "@/components/api-content";
import { APIModal } from "@/components/api-modal";
import { useEndpointState } from "@/lib/states/endpoint.state";
export type APIEndpoint = {
  id: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  title: string;
  description: string;
};

export function APIPlayground() {
  const [selectedEndpoint, setSelectedEndpoint] =
    useState<string>("index-repository");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEndpoint, setCurrentEndpoint] = useState<APIEndpoint | null>(
    null
  );

  const handleTryIt = (endpoint: APIEndpoint) => {
    setCurrentEndpoint(endpoint);
    setIsModalOpen(true);
  };

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

  // Find the currently selected endpoint object
  const selectedEndpointObj = endpoints.find((e) => e.id === selectedEndpoint);

  console.log("Selected endpoint:", selectedEndpoint);
  console.log("Selected endpoint object:", selectedEndpointObj);

  const { setCurrentEndpointState, currentEndpointState } = useEndpointState();

  return (
    <div className="flex h-screen bg-background">
      <APIReference
        endpoints={endpoints}
        selectedEndpoint={currentEndpointState}
        onSelectEndpoint={(id) => {
          console.log("Selected endpoint:", id);
          setSelectedEndpoint(id);
          setCurrentEndpointState(id);
        }}
      />
      {currentEndpointState ? (
        <div className="flex-1">
          <APIContent
            endpoints={endpoints}
            selectedEndpoint={currentEndpointState}
            onTryIt={handleTryIt}
          />
        </div>
      ) : (
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold">Introduction</h1>
          <p className="mt-4 text-muted-foreground">
            Welcome to the Greptile API playground. Select an endpoint from the
            sidebar to get started.
          </p>
        </div>
      )}
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
