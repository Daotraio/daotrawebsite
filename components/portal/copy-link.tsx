"use client";

// Copies one tracking link. The link itself is rendered by the server from what
// Daotra returned; nothing here creates, changes or requests a link (BD-73: links
// are provisioned by Daotra and read only in the portal).

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyLink({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };
  return (
    <button type="button" className="btn sm" onClick={copy} aria-label="Copy tracking link">
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
