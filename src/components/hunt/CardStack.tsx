"use client";

import { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { IssueCard } from "./IssueCard";
import { ActionButtons } from "./ActionButtons";
import { Issue } from "@/lib/mock-data";

export interface CardStackHandle {
  pushBack: () => void;
}

interface CardStackProps {
  issues: Issue[];
  onSave: (issue: Issue) => void;
  onSkip: (issue: Issue) => void;
  onNearingEnd?: () => void;
  emptySlot?: React.ReactNode;
}

export const CardStack = forwardRef<CardStackHandle, CardStackProps>(function CardStack(
  { issues, onSave, onSkip, onNearingEnd, emptySlot },
  ref
) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const nearingEndFired = useRef(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);
  const skipOpacity = useTransform(x, [-150, -30, 0], [1, 1, 0]);
  const saveOpacity = useTransform(x, [0, 30, 150], [0, 1, 1]);

  // Expose pushBack so HuntPageInner can return a failed card to the top of the deck.
  useImperativeHandle(ref, () => ({
    pushBack: () => {
      setCurrentIndex((i) => Math.max(0, i - 1));
      x.set(0);
    },
  }));

  const currentIssue = issues[currentIndex];
  const nextIssue = issues[currentIndex + 1];
  const nextNextIssue = issues[currentIndex + 2];

  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      if (!currentIssue || isAnimating) return;
      setIsAnimating(true);

      animate(x, direction === "right" ? 600 : -600, {
        duration: 0.35,
        ease: "easeIn",
        onComplete: () => {
          if (direction === "right") {
            onSave(currentIssue);
          } else {
            onSkip(currentIssue);
          }
          setCurrentIndex((i) => {
            const next = i + 1;
            const remaining = issues.length - next;
            if (remaining <= 3 && !nearingEndFired.current) {
              nearingEndFired.current = true;
              onNearingEnd?.();
            }
            return next;
          });
          x.set(0);
          setIsAnimating(false);
        },
      });
    },
    [currentIssue, isAnimating, x, onSave, onSkip, onNearingEnd, issues.length]
  );

  useEffect(() => {
    nearingEndFired.current = false;
  }, [issues.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handleSwipe("left");
      if (e.key === "ArrowRight") handleSwipe("right");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleSwipe]);

  if (!currentIssue) {
    if (emptySlot) return <>{emptySlot}</>;
    return (
      <div className="flex flex-col items-center justify-center h-[520px] gap-3">
        <p className="font-mono text-[14px] text-text-muted">You&apos;ve seen all issues!</p>
        <p className="font-sans text-[12px] text-text-muted">Check back tomorrow for more.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Card stack */}
      <div className="relative" style={{ height: "520px" }}>
        {/* Back ghost card */}
        {nextNextIssue && (
          <div
            className="absolute inset-x-0 top-0 pointer-events-none"
            style={{
              transform: "scale(0.90) translateY(20px)",
              opacity: 0.2,
              transformOrigin: "bottom center",
            }}
          >
            <IssueCard key={nextNextIssue.id} issue={nextNextIssue} />
          </div>
        )}

        {/* Middle ghost card */}
        {nextIssue && (
          <div
            className="absolute inset-x-0 top-0 pointer-events-none"
            style={{
              transform: "scale(0.95) translateY(10px)",
              opacity: 0.4,
              transformOrigin: "bottom center",
            }}
          >
            <IssueCard key={nextIssue.id} issue={nextIssue} />
          </div>
        )}

        {/* Active draggable card */}
        <motion.div
          className="absolute inset-x-0 top-0 select-none cursor-grab active:cursor-grabbing"
          style={{ x, rotate }}
          draggable={false}
          drag={isAnimating ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          onDragEnd={(_, info) => {
            if (isAnimating) return;
            if (info.offset.x > 100) {
              handleSwipe("right");
            } else if (info.offset.x < -100) {
              handleSwipe("left");
            } else {
              animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
            }
          }}
        >
          {/* SKIP label overlay */}
          <motion.div
            className="absolute top-8 left-8 z-10 pointer-events-none select-none"
            style={{ opacity: skipOpacity }}
          >
            <span
              className="font-sans font-bold text-[32px] text-danger border-[3px] border-danger px-3 py-1 rounded inline-block"
              style={{ transform: "rotate(-15deg)" }}
            >
              SKIP
            </span>
          </motion.div>

          {/* SAVE label overlay */}
          <motion.div
            className="absolute top-8 right-8 z-10 pointer-events-none select-none"
            style={{ opacity: saveOpacity }}
          >
            <span
              className="font-sans font-bold text-[32px] text-success border-[3px] border-success px-3 py-1 rounded inline-block"
              style={{ transform: "rotate(15deg)" }}
            >
              SAVE
            </span>
          </motion.div>

          <IssueCard key={currentIssue.id} issue={currentIssue} showClaims />
        </motion.div>
      </div>

      {/* Action buttons */}
      <ActionButtons
        onSkip={() => handleSwipe("left")}
        onSave={() => handleSwipe("right")}
      />
    </div>
  );
});
