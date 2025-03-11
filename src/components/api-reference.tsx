"use client";

import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { MonitorCheck } from "lucide-react";
import { useRouter } from "next/navigation";

interface APIEndpoint {
  id: string;
  method: string;
  path: string;
  title: string;
  description: string;
}

interface APIReferenceProps {
  endpoints: APIEndpoint[];
  selectedEndpoint: string;
  onSelectEndpoint: (id: string) => void;
}

export function APIReference({
  endpoints,
  selectedEndpoint,
  onSelectEndpoint,
}: APIReferenceProps) {
  console.log("APIReference - selectedEndpoint:", selectedEndpoint);

  const handleEndpointClick = (id: string) => {
    console.log("Selecting endpoint:", id);
    onSelectEndpoint(id);
  };

  const router = useRouter();

  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarHeader className="border-b">
          <h2 className="text-xl font-semibold px-4 py-4">Greptile API V2</h2>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Introduction</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => handleEndpointClick("introduction")}
                    isActive={selectedEndpoint === "introduction"}
                  >
                    <span>Introduction</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Endpoints</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {endpoints.map((endpoint) => (
                  <SidebarMenuItem key={endpoint.id}>
                    <SidebarMenuButton
                      onClick={() => handleEndpointClick(endpoint.id)}
                      isActive={selectedEndpoint === endpoint.id}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-xs font-medium px-2 py-0.5 rounded",
                            endpoint.method === "GET"
                              ? "bg-green-100 text-green-700"
                              : endpoint.method === "POST"
                              ? "bg-blue-100 text-blue-700"
                              : endpoint.method === "PUT"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                          )}
                        >
                          {endpoint.method}
                        </span>
                        <span>{endpoint.title}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="flex items-center gap-2 p-3 border-t flex-row w-full">
          <div
            className="flex-1 truncate flex flex-row justify-between items-center cursor-pointer w-full"
            onClick={() => router.push("/logs")}
          >
            <div className="text-sm font-medium">Request Logs</div>
            <MonitorCheck className="w-5 h-5 stroke-[1.5] group-hover:stroke-2 transition-all text-primary" />
          </div>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
