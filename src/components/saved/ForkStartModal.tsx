"use client";

import { useState } from "react";
import { X, Copy, Check, ExternalLink } from "lucide-react";

interface ForkStartModalProps {
  repoName: string;
  forkName: string;
  issueNumber: number;
  onClose: () => void;
}

interface CommandRowProps {
  label: string;
  command: string;
}

function CommandRow({ label, command }: CommandRowProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[11px] text-text-muted">{label}</span>
      <div className="flex items-center gap-2 bg-surface border border-border rounded-btn px-3 py-2">
        <code className="font-mono text-[12px] text-text-primary flex-1 break-all">
          {command}
        </code>
        <button
          onClick={handleCopy}
          className="flex-shrink-0 text-text-muted hover:text-accent transition-colors"
          aria-label={`Copy ${label}`}
        >
          {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
}

export function ForkStartModal({
  repoName,
  forkName,
  issueNumber,
  onClose,
}: ForkStartModalProps) {
  const branchName = `fix/issue-${issueNumber}`;
  const repoSlug = repoName.split("/")[1] ?? repoName;

  const commands = [
    { label: "1. Clone your fork", command: `git clone https://github.com/${forkName}.git` },
    { label: "2. Enter the directory", command: `cd ${repoSlug}` },
    { label: "3. Create a branch", command: `git checkout -b ${branchName}` },
    { label: "4. Stage your changes", command: "git add ." },
    { label: "5. Commit", command: `git commit -m "fix: resolve issue #${issueNumber}"` },
    { label: "6. Push", command: `git push origin ${branchName}` },
    {
      label: "7. Open a pull request",
      command: `gh pr create --title "Fix #${issueNumber}" --body "Closes #${issueNumber}" --repo ${repoName}`,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-lg bg-background border border-border rounded-2xl p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-sans font-bold text-[18px] text-text-primary">
              Fork &amp; Start
            </h2>
            <p className="font-mono text-[12px] text-text-muted mt-0.5">
              {repoName} · issue #{issueNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors flex-shrink-0"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Commands */}
        <div className="flex flex-col gap-3">
          {commands.map((c) => (
            <CommandRow key={c.label} label={c.label} command={c.command} />
          ))}
        </div>

        {/* Footer */}
        <a
          href={`https://github.com/${repoName}/issues/${issueNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-mono text-[13px] text-accent hover:underline self-start"
        >
          Open issue on GitHub
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}
