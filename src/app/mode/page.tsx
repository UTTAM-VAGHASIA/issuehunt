"use client";

import { useState } from "react";
import { Target, Compass } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { ModeCard } from "@/components/mode/ModeCard";
import { LanguagePicker } from "@/components/mode/LanguagePicker";
import { Tag } from "@/components/ui/Tag";
import { MOCK_USER } from "@/lib/mock-data";

export default function ModePage() {
  const [exploreLanguage, setExploreLanguage] = useState("");
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "good morning" : hour < 17 ? "good afternoon" : "good evening";

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="app" />

      <div className="flex items-center justify-center min-h-screen px-4 pt-20">
        <div className="w-full max-w-[640px]">
          <p className="font-sans text-[15px] text-text-muted lowercase">
            {greeting}, {MOCK_USER.name.split(" ")[0].toLowerCase()}
          </p>
          <h2 className="font-sans font-medium text-[28px] text-text-primary mt-3 mb-8">
            What are you hunting for today?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ModeCard
              href="/hunt"
              accentColor="#F97316"
              icon={<Target size={24} />}
              title="Match My Skills"
              subtitle="Issues matched to your existing stack"
            >
              <div className="flex flex-wrap gap-2 mt-5">
                {MOCK_USER.languages.map((lang) => (
                  <Tag key={lang} label={lang} variant="language" />
                ))}
              </div>
            </ModeCard>

            <ModeCard
              href={exploreLanguage ? "/hunt" : "#"}
              accentColor="#14B8A6"
              icon={<Compass size={24} />}
              title="Explore New Language"
              subtitle="Beginner-friendly issues in any language"
            >
              <LanguagePicker value={exploreLanguage} onChange={setExploreLanguage} />
            </ModeCard>
          </div>
        </div>
      </div>
    </div>
  );
}
