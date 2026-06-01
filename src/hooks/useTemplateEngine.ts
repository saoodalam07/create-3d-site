import { useSyncExternalStore } from "react";
import { subscribe, getState } from "@/lib/templateEngine";

export function useEngineState() {
  return useSyncExternalStore(subscribe, getState, getState);
}