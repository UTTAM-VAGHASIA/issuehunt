export interface Issue {
  id: string;
  number: number;
  title: string;
  body: string;
  repoName: string;
  repoStars: string;
  repoAvatar: string;
  language: string;
  labels: string[];
  openedAgo: string;
  commentCount: number;
  hasAssignee: boolean;
  hasContributing: boolean;
  maintainerResponseTime: string;
  repoActivity: "Very active" | "Active" | "Moderate";
  activityScore: number;
  responseScore: number;
}

export interface SavedIssue extends Issue {
  status: "todo" | "in-progress" | "done";
  savedAt: string;
}

export const MOCK_USER = {
  name: "Uttam Patel",
  username: "uttam-patel",
  avatar: "https://github.com/ghost.png",
  languages: ["Python", "TypeScript", "JavaScript"],
  streak: 4,
  savedCount: 12,
  totalSwiped: 47,
};

export const MOCK_ISSUES: Issue[] = [
  {
    id: "1",
    number: 28441,
    title: "Fix hydration mismatch in Server Components when using dynamic imports",
    body: "When using next/dynamic with ssr: false inside a Server Component, React throws a hydration mismatch warning in development. The issue is reproducible with the minimal example in the linked discussion. Expected behavior: no hydration warnings when using dynamic imports correctly.",
    repoName: "vercel/next.js",
    repoStars: "124k",
    repoAvatar: "https://github.com/vercel.png",
    language: "TypeScript",
    labels: ["good first issue", "bug"],
    openedAgo: "2 days ago",
    commentCount: 7,
    hasAssignee: false,
    hasContributing: true,
    maintainerResponseTime: "~6hr avg",
    repoActivity: "Very active",
    activityScore: 95,
    responseScore: 88,
  },
  {
    id: "2",
    number: 27112,
    title: "Add aria-label support to Button component in extension API",
    body: "The Button contribution point in the VS Code extension API does not support aria-label, making it inaccessible for screen reader users. This is a relatively small change — we need to thread the ariaLabel property through the contribution point schema and the button renderer.",
    repoName: "microsoft/vscode",
    repoStars: "162k",
    repoAvatar: "https://github.com/microsoft.png",
    language: "TypeScript",
    labels: ["good first issue", "accessibility"],
    openedAgo: "5 days ago",
    commentCount: 3,
    hasAssignee: false,
    hasContributing: true,
    maintainerResponseTime: "~12hr avg",
    repoActivity: "Very active",
    activityScore: 92,
    responseScore: 72,
  },
  {
    id: "3",
    number: 29834,
    title: "useEffect cleanup not called on StrictMode double-invoke in React 18",
    body: "In React 18 with StrictMode enabled, useEffect cleanup functions are not consistently called during the second invocation in development mode. This causes state leaks when effects subscribe to external stores. Minimal repro attached.",
    repoName: "facebook/react",
    repoStars: "221k",
    repoAvatar: "https://github.com/facebook.png",
    language: "JavaScript",
    labels: ["bug", "help wanted"],
    openedAgo: "1 day ago",
    commentCount: 12,
    hasAssignee: false,
    hasContributing: true,
    maintainerResponseTime: "~4hr avg",
    repoActivity: "Very active",
    activityScore: 98,
    responseScore: 94,
  },
  {
    id: "4",
    number: 6721,
    title: "v-model modifier .trim not working with composition API defineModel",
    body: "When using defineModel() in Vue 3.4+ with the .trim modifier, the trimming is not applied to the emitted value. It works correctly with Options API but fails silently with Composition API. Steps to reproduce are in the playground link below.",
    repoName: "vuejs/vue",
    repoStars: "46k",
    repoAvatar: "https://github.com/vuejs.png",
    language: "TypeScript",
    labels: ["good first issue", "bug"],
    openedAgo: "3 days ago",
    commentCount: 5,
    hasAssignee: false,
    hasContributing: true,
    maintainerResponseTime: "~8hr avg",
    repoActivity: "Active",
    activityScore: 78,
    responseScore: 81,
  },
  {
    id: "5",
    number: 21934,
    title: "Deno.serve() does not respect AbortSignal timeout in HTTP/2 mode",
    body: "When passing an AbortSignal with a timeout to Deno.serve(), the server correctly aborts for HTTP/1.1 connections but ignores the signal for HTTP/2 multiplexed streams. This leads to hung connections in production environments.",
    repoName: "denoland/deno",
    repoStars: "93k",
    repoAvatar: "https://github.com/denoland.png",
    language: "Rust",
    labels: ["bug", "help wanted"],
    openedAgo: "6 days ago",
    commentCount: 9,
    hasAssignee: false,
    hasContributing: true,
    maintainerResponseTime: "~10hr avg",
    repoActivity: "Very active",
    activityScore: 89,
    responseScore: 76,
  },
  {
    id: "6",
    number: 115840,
    title: "Improve error message for trait object size mismatch in async fn",
    body: "When returning a trait object from an async fn with the wrong size, the compiler error message is unhelpful and doesn't suggest the fix (boxing). This is a good beginner contribution — just improving the diagnostic message in the compiler.",
    repoName: "rust-lang/rust",
    repoStars: "96k",
    repoAvatar: "https://github.com/rust-lang.png",
    language: "Rust",
    labels: ["good first issue", "diagnostics"],
    openedAgo: "4 days ago",
    commentCount: 2,
    hasAssignee: false,
    hasContributing: true,
    maintainerResponseTime: "~24hr avg",
    repoActivity: "Very active",
    activityScore: 91,
    responseScore: 62,
  },
  {
    id: "7",
    number: 17342,
    title: "Add support for async validators in ModelForm clean() method",
    body: "Django's ModelForm.clean() method currently does not support async validators, which means async database checks cannot be performed during form validation. This blocks adoption of Django's async ORM features in forms. A proposed API is outlined in the issue thread.",
    repoName: "django/django",
    repoStars: "79k",
    repoAvatar: "https://github.com/django.png",
    language: "Python",
    labels: ["help wanted", "enhancement"],
    openedAgo: "8 days ago",
    commentCount: 18,
    hasAssignee: false,
    hasContributing: true,
    maintainerResponseTime: "~18hr avg",
    repoActivity: "Active",
    activityScore: 75,
    responseScore: 68,
  },
  {
    id: "8",
    number: 1337,
    title: "Kernel panic when developer submits PR at 3am with unreviewed code",
    body: "Reproducible 100% of the time. Root cause: caffeine deficiency combined with git push --force on main. Fix requires hardware intervention (sleep). This is a joke issue but we really do appreciate contributors who take breaks.",
    repoName: "torvalds/linux",
    repoStars: "172k",
    repoAvatar: "https://github.com/torvalds.png",
    language: "C++",
    labels: ["good first issue", "wontfix"],
    openedAgo: "12 days ago",
    commentCount: 42,
    hasAssignee: false,
    hasContributing: false,
    maintainerResponseTime: "~never",
    repoActivity: "Very active",
    activityScore: 99,
    responseScore: 10,
  },
  {
    id: "9",
    number: 3892,
    title: "Add variant prop to built-in button plugin for outlined style",
    body: "Tailwind CSS's button examples in the docs only show filled variants. Adding an outlined variant to the plugin system would make it easier for teams standardizing their design systems. This is a documentation + plugin contribution.",
    repoName: "tailwindlabs/tailwindcss",
    repoStars: "82k",
    repoAvatar: "https://github.com/tailwindlabs.png",
    language: "JavaScript",
    labels: ["good first issue", "enhancement"],
    openedAgo: "2 days ago",
    commentCount: 6,
    hasAssignee: false,
    hasContributing: true,
    maintainerResponseTime: "~5hr avg",
    repoActivity: "Very active",
    activityScore: 93,
    responseScore: 90,
  },
  {
    id: "10",
    number: 14221,
    title: "CSS @import resolution fails when using virtual modules in plugins",
    body: "When a Vite plugin creates a virtual module that contains a CSS @import statement, the imported CSS path is resolved relative to the plugin's virtual ID rather than the project root. This breaks CSS preprocessor imports in custom plugin setups.",
    repoName: "vitejs/vite",
    repoStars: "67k",
    repoAvatar: "https://github.com/vitejs.png",
    language: "TypeScript",
    labels: ["bug", "good first issue"],
    openedAgo: "1 day ago",
    commentCount: 4,
    hasAssignee: false,
    hasContributing: true,
    maintainerResponseTime: "~3hr avg",
    repoActivity: "Very active",
    activityScore: 96,
    responseScore: 95,
  },
];

export const MOCK_SAVED_ISSUES: SavedIssue[] = [
  {
    ...MOCK_ISSUES[0],
    status: "in-progress",
    savedAt: "2 hours ago",
  },
  {
    ...MOCK_ISSUES[2],
    status: "todo",
    savedAt: "5 hours ago",
  },
  {
    ...MOCK_ISSUES[5],
    id: "saved-3",
    status: "done",
    savedAt: "1 day ago",
  },
  {
    ...MOCK_ISSUES[8],
    id: "saved-4",
    status: "todo",
    savedAt: "2 days ago",
  },
  {
    ...MOCK_ISSUES[9],
    id: "saved-5",
    status: "in-progress",
    savedAt: "3 days ago",
  },
];

export interface HistoryEntry {
  id: string;
  issue: Issue;
  action: "saved" | "skipped";
  date: string; // ISO date string "YYYY-MM-DD"
  timeAgo: string; // display string e.g. "2 hours ago"
}

// Simulated activity spread across recent days
export const MOCK_HISTORY: HistoryEntry[] = [
  { id: "h1", issue: MOCK_ISSUES[0], action: "saved",   date: "2026-03-10", timeAgo: "2 hours ago" },
  { id: "h2", issue: MOCK_ISSUES[1], action: "skipped", date: "2026-03-10", timeAgo: "2 hours ago" },
  { id: "h3", issue: MOCK_ISSUES[2], action: "saved",   date: "2026-03-10", timeAgo: "3 hours ago" },
  { id: "h4", issue: MOCK_ISSUES[3], action: "skipped", date: "2026-03-10", timeAgo: "5 hours ago" },
  { id: "h5", issue: MOCK_ISSUES[4], action: "saved",   date: "2026-03-09", timeAgo: "1 day ago" },
  { id: "h6", issue: MOCK_ISSUES[5], action: "skipped", date: "2026-03-09", timeAgo: "1 day ago" },
  { id: "h7", issue: MOCK_ISSUES[6], action: "saved",   date: "2026-03-09", timeAgo: "1 day ago" },
  { id: "h8", issue: MOCK_ISSUES[7], action: "skipped", date: "2026-03-08", timeAgo: "2 days ago" },
  { id: "h9", issue: MOCK_ISSUES[8], action: "saved",   date: "2026-03-08", timeAgo: "2 days ago" },
  { id: "h10", issue: MOCK_ISSUES[9], action: "skipped", date: "2026-03-07", timeAgo: "3 days ago" },
  // Re-uses issues from earlier days to simulate revisiting the same repo
  { id: "h11", issue: MOCK_ISSUES[0], action: "saved",  date: "2026-03-06", timeAgo: "4 days ago" },
  { id: "h12", issue: MOCK_ISSUES[3], action: "saved",  date: "2026-03-05", timeAgo: "5 days ago" },
];

// Activity by month (keyed "YYYY-MM"), used by StreakCalendar component
export const MOCK_ACTIVE_DAYS: Record<string, number[]> = {
  "2026-03": [5, 6, 7, 8, 9, 10],
};
