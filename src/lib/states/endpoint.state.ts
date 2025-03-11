import { create } from "zustand";

interface APIEndpoint {
  id: string;
  method: string;
  path: string;
  title: string;
  description: string;
}

interface EndpointState {
  currentEndpointState: any;
  setCurrentEndpointState: (endpoint: any) => void;
}

export const useEndpointState = create<EndpointState>((set) => ({
  currentEndpointState: null,
  setCurrentEndpointState: (endpoint: any) =>
    set({ currentEndpointState: endpoint }),
}));
