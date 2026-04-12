"use client";

import { useReducer, useEffect, useCallback, useRef, useMemo } from "react";
import { Issue } from "@/lib/mock-data";
import { HuntFilters } from "@/components/hunt/FilterToggles";

interface FetchState {
  rawIssues: Issue[];
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
      return { rawIssues: [], total: 0, loading: true, error: null };
    case "SUCCESS":
      return { ...state, rawIssues: action.issues, total: action.total, loading: false };
    case "ERROR":
      return { ...state, loading: false, error: action.error };
    case "APPEND":
      return { ...state, rawIssues: [...state.rawIssues, ...action.issues] };
  }
}

interface UseHuntIssuesResult {
  issues: Issue[];
  total: number;
  loading: boolean;
  error: string | null;
  prefetchNextPage: () => void;
}

function applyClientFilters(issues: Issue[], filters: HuntFilters): Issue[] {
  return issues.filter((issue) => {
    if (filters.hasContributing && !issue.hasContributing) return false;
    if (filters.activeRecently && issue.activityScore <= 45) return false;
    return true;
  });
}

export function useHuntIssues(mode: string, filters: HuntFilters, retryKey = 0): UseHuntIssuesResult {
  const [state, dispatch] = useReducer(fetchReducer, {
    rawIssues: [],
    total: 0,
    loading: true,
    error: null,
  });

  const nextPage = useRef(2);
  const isFetching = useRef(false);

  // Only re-fetch from GitHub when server-side params change.
  // retryKey increments when the user clicks "Retry" on the error state.
  // Client filters (hasContributing, activeRecently) are applied via useMemo below.
  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "START" });
    nextPage.current = 2;
    isFetching.current = false; // reset so prefetch works after mode/filter change

    const params = new URLSearchParams({
      mode,
      page: "1",
      goodFirstIssue: String(filters.goodFirstIssue),
    });
    fetch(`/api/issues?${params}`)
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
  }, [mode, filters.goodFirstIssue, retryKey]);

  // Apply client-side filters reactively — no API call, instant re-filter.
  const issues = useMemo(
    () => applyClientFilters(state.rawIssues, filters),
    [state.rawIssues, filters]
  );

  const prefetchNextPage = useCallback(() => {
    if (isFetching.current) return;
    isFetching.current = true;
    const page = nextPage.current;

    const params = new URLSearchParams({
      mode,
      page: String(page),
      goodFirstIssue: String(filters.goodFirstIssue),
    });
    fetch(`/api/issues?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.issues?.length) {
          dispatch({ type: "APPEND", issues: data.issues });
          nextPage.current = page + 1;
        }
      })
      .catch(() => {})
      .finally(() => { isFetching.current = false; });
  }, [mode, filters.goodFirstIssue]);

  return { issues, total: state.total, loading: state.loading, error: state.error, prefetchNextPage };
}
