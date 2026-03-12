"use client";

import { useReducer, useEffect, useCallback, useRef } from "react";
import { Issue } from "@/lib/mock-data";

interface FetchState {
  issues: Issue[];
  total: number;
  loading: boolean;
  error: string | null;
}

type Action =
  | { type: "START" }
  | { type: "SUCCESS"; issues: Issue[]; total: number }
  | { type: "ERROR"; error: string }
  | { type: "APPEND"; issues: Issue[] };

function fetchReducer(state: FetchState, action: Action): FetchState {
  switch (action.type) {
    case "START":
      return { issues: [], total: 0, loading: true, error: null };
    case "SUCCESS":
      return { ...state, issues: action.issues, total: action.total, loading: false };
    case "ERROR":
      return { ...state, loading: false, error: action.error };
    case "APPEND":
      return { ...state, issues: [...state.issues, ...action.issues] };
  }
}

interface UseHuntIssuesResult {
  issues: Issue[];
  total: number;
  loading: boolean;
  error: string | null;
  prefetchNextPage: () => void;
}

export function useHuntIssues(mode: string): UseHuntIssuesResult {
  const [state, dispatch] = useReducer(fetchReducer, {
    issues: [],
    total: 0,
    loading: true,
    error: null,
  });

  const nextPage = useRef(2);
  const isFetching = useRef(false);

  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "START" });
    nextPage.current = 2;

    fetch(`/api/issues?mode=${mode}&page=1`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) {
          dispatch({ type: "ERROR", error: data.error });
        } else {
          dispatch({ type: "SUCCESS", issues: data.issues ?? [], total: data.total ?? 0 });
        }
      })
      .catch(() => {
        if (!cancelled) dispatch({ type: "ERROR", error: "Failed to load issues" });
      });

    return () => { cancelled = true; };
  }, [mode]);

  const prefetchNextPage = useCallback(() => {
    if (isFetching.current) return;
    isFetching.current = true;
    const page = nextPage.current;

    fetch(`/api/issues?mode=${mode}&page=${page}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.issues?.length) {
          dispatch({ type: "APPEND", issues: data.issues });
          nextPage.current = page + 1;
        }
      })
      .catch(() => {})
      .finally(() => { isFetching.current = false; });
  }, [mode]);

  return { ...state, prefetchNextPage };
}
