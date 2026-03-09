import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <span className="font-mono text-accent text-[14px] tracking-widest uppercase">404</span>
      <h1 className="font-sans font-medium text-[28px] text-text-primary">Page not found</h1>
      <p className="font-sans text-[14px] text-text-muted">
        This issue has been closed. Or never existed.
      </p>
      <Link
        href="/"
        className="mt-4 font-sans text-[14px] text-accent hover:underline"
      >
        ← Back to home
      </Link>
    </div>
  );
}
