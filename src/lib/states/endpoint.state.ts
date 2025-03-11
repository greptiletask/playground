import { APIEndpoint } from "@/components/api-playground";
import { create } from "zustand";

interface EndpointState {
  currentEndpointState: any;
  setCurrentEndpointState: (endpoint: any) => void;
}

export const useEndpointState = create<EndpointState>((set) => ({
  currentEndpointState: null,
  setCurrentEndpointState: (endpoint: any) =>
    set({ currentEndpointState: endpoint }),
}));
