"use client";

import React from "react";

// ---------------------------------------------------------------------------
// Inline parser: handles **bold** and `code` within a text string
// ---------------------------------------------------------------------------
function parseInline(text: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  // Split on **bold** or `code` patterns
  const re = /(\*\*([^*]+)\*\*|`([^`]+)`)/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      tokens.push(text.slice(last, match.index));
    }
    if (match[2]) {
      tokens.push(
        <strong key={match.index} className="text-gray-200 font-semibold">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      tokens.push(
        <code
          key={match.index}
          className="px-1.5 py-0.5 rounded bg-white/[0.07] text-blue-300 text-[0.85em] font-mono"
        >
          {match[3]}
        </code>
      );
    }
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    tokens.push(text.slice(last));
  }

  return tokens;
}

// ---------------------------------------------------------------------------
// Block renderer
// ---------------------------------------------------------------------------
function renderBlock(block: string, i: number): React.ReactNode {
  // H2
  if (block.startsWith("## ")) {
    return (
      <h2 key={i} className="text-xl md:text-2xl font-semibold text-white mt-14 mb-5 tracking-tight">
        {parseInline(block.slice(3))}
      </h2>
    );
  }

  // H3
  if (block.startsWith("### ")) {
    return (
      <h3 key={i} className="text-lg md:text-xl font-semibold text-gray-200 mt-10 mb-3 tracking-tight">
        {parseInline(block.slice(4))}
      </h3>
    );
  }

  // Blockquote (lines starting with "> ")
  if (block.startsWith("> ")) {
    const lines = block
      .split("\n")
      .filter(Boolean)
      .map((l) => l.replace(/^>\s?/, ""));
    return (
      <blockquote
        key={i}
        className="border-l-2 border-blue-500/50 pl-5 py-1 my-8 text-gray-300 font-light leading-relaxed italic"
      >
        {lines.map((l, j) => (
          <p key={j} className="mb-1 last:mb-0">
            {parseInline(l)}
          </p>
        ))}
      </blockquote>
    );
  }

  // Horizontal rule
  if (block === "---" || block === "***") {
    return <div key={i} className="h-px w-full bg-white/5 my-10" />;
  }

  // Bullet list (lines starting with "- " or "* ")
  if (block.match(/^[-*] /m)) {
    const items = block
      .split("\n")
      .filter((l) => l.match(/^[-*] /));
    return (
      <ul
        key={i}
        className="list-none space-y-2.5 my-6 ml-1"
      >
        {items.map((item, j) => (
          <li key={j} className="flex items-start gap-3 text-gray-400 font-light leading-relaxed">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
            <span>{parseInline(item.replace(/^[-*]\s/, ""))}</span>
          </li>
        ))}
      </ul>
    );
  }

  // Numbered list (lines starting with "1. ", "2. " etc.)
  if (block.match(/^\d+\. /m)) {
    const items = block
      .split("\n")
      .filter((l) => l.match(/^\d+\. /));
    return (
      <ol key={i} className="space-y-3 my-6 ml-1 counter-reset-none">
        {items.map((item, j) => (
          <li key={j} className="flex items-start gap-3 text-gray-400 font-light leading-relaxed">
            <span className="shrink-0 w-6 text-right text-blue-500 font-medium text-sm mt-0.5">
              {j + 1}.
            </span>
            <span>{parseInline(item.replace(/^\d+\.\s/, ""))}</span>
          </li>
        ))}
      </ol>
    );
  }

  // Default: paragraph
  const lines = block.split("\n");
  return (
    <p key={i} className="text-gray-400 font-light leading-relaxed mb-6">
      {lines.map((line, j) => (
        <React.Fragment key={j}>
          {parseInline(line)}
          {j < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </p>
  );
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------
export default function ArticleRenderer({ content }: { content: string }) {
  const blocks = content.split("\n\n").filter(Boolean);
  return (
    <article className="max-w-none">
      {blocks.map((block, i) => renderBlock(block.trim(), i))}
    </article>
  );
}
