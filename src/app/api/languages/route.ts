import { NextResponse } from "next/server";

const LINGUIST_URL =
  "https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml";

/**
 * Minimal YAML parser — extracts top-level keys and their `type:` field.
 * Linguist YAML structure:
 *   Python:
 *     type: programming
 *     ...
 *   HTML:
 *     type: markup
 *     ...
 */
function extractProgrammingLanguages(yaml: string): string[] {
  const languages: string[] = [];
  const lines = yaml.split("\n");

  let currentLang: string | null = null;
  let currentType: string | null = null;

  for (const line of lines) {
    // Top-level key: starts at col 0, not indented, ends with ":"
    const topKey = line.match(/^([A-Za-z][^:#\n]*[A-Za-z0-9*+#]):\s*$/);
    if (topKey) {
      // Save previous
      if (currentLang && currentType === "programming") {
        languages.push(currentLang);
      }
      currentLang = topKey[1].trim();
      currentType = null;
      continue;
    }

    // type field (indented)
    const typeMatch = line.match(/^\s+type:\s+(\w+)/);
    if (typeMatch && currentLang) {
      currentType = typeMatch[1];
    }
  }

  // Save last entry
  if (currentLang && currentType === "programming") {
    languages.push(currentLang);
  }

  return languages.sort();
}

export async function GET() {
  try {
    const res = await fetch(LINGUIST_URL, {
      next: { revalidate: 86400 }, // cache for 24 hours
    });

    if (!res.ok) throw new Error("Failed to fetch linguist");

    const yaml = await res.text();
    const languages = extractProgrammingLanguages(yaml);

    return NextResponse.json({ languages });
  } catch {
    // Fallback to a minimal list if GitHub is unreachable
    return NextResponse.json({
      languages: [
        "C", "C#", "C++", "Clojure", "Crystal", "Dart", "Elixir", "Elm",
        "Erlang", "F#", "Go", "Groovy", "Haskell", "Java", "JavaScript",
        "Julia", "Kotlin", "Lua", "Nim", "OCaml", "Perl", "PHP", "Python",
        "R", "Ruby", "Rust", "Scala", "Shell", "Swift", "TypeScript", "Zig",
      ].sort(),
    });
  }
}
