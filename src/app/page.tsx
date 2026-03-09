import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/landing/Hero";
import { GhostCards } from "@/components/landing/GhostCards";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <Navbar variant="landing" />

      {/* Hero — vertically centered with room for cards below */}
      <div className="flex-1 flex items-center justify-center pt-20 pb-64 px-4">
        <Hero />
      </div>

      {/* Ghost cards preview at bottom */}
      <GhostCards />
    </div>
  );
}
