import { Suspense } from "react";
import { HuntPageInner } from "@/components/hunt/HuntPageInner";

export default function HuntPage() {
  return (
    <Suspense fallback={null}>
      <HuntPageInner />
    </Suspense>
  );
}
