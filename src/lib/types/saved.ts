export type IssueStatus = "todo" | "in-progress" | "done";
export type GhState = "open" | "closed" | "solved";

export interface RealSavedIssue {
  id: string;
  githubIssueId: number;
  repoName: string;
  number: number;
  title: string;
  labels: string[];
  language: string;
  repoAvatar: string;
  status: IssueStatus;
  savedAt: string;
  ghState?: GhState;
}
