"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  language: string;
  code: string;
}

export function CodeBlock({ language, code }: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    // Dynamically import Prism to avoid SSR issues
    const loadPrism = async () => {
      try {
        // Import Prism core
        const Prism = (await import("prismjs")).default;

        // Import language components based on the language prop
        if (language === "bash")
          await import("prismjs/components/prism-bash" as any);
        if (language === "json")
          await import("prismjs/components/prism-json" as any);
        if (language === "javascript")
          await import("prismjs/components/prism-javascript" as any);
        if (language === "python")
          await import("prismjs/components/prism-python" as any);
        if (language === "go")
          await import("prismjs/components/prism-go" as any);
        if (language === "java")
          await import("prismjs/components/prism-java" as any);
        if (language === "php")
          await import("prismjs/components/prism-php" as any);

        // Only highlight if we have a valid code element
        if (preRef.current) {
          // Add the language class to the pre element
          preRef.current.className = `language-${language}`;

          // Highlight the code
          Prism.highlightElement(preRef.current);
        }
      } catch (error) {
        console.error("Error loading Prism:", error);
      }
    };

    loadPrism();
  }, [language, code]);

  return (
    <pre
      ref={preRef}
      className={cn(
        "rounded-md bg-zinc-950 p-4 overflow-auto max-h-[500px]",
        `language-${language}`
      )}
    >
      {code}
    </pre>
  );
}
