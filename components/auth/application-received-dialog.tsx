"use client";

import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Confirmation popup shown after a successful registration. Built on the
// native <dialog> element: showModal() gives us the focus trap, Esc-to-close,
// inert page behind it, and a top-layer backdrop for free.
export function ApplicationReceivedDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const ref = React.useRef<HTMLDialogElement>(null);

  React.useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      // The dialog element itself is only the click target when the dimmed
      // backdrop is clicked (the content div fills the rest) - close on that.
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
      aria-labelledby="application-received-title"
      aria-describedby="application-received-body"
      // m-auto: Tailwind's reset zeroes the margins the browser uses to center a dialog.
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-white/10 bg-obsidian-800 p-0 text-foreground shadow-glow backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div className="flex flex-col items-center p-8 text-center sm:p-10">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/[0.04]">
          <CheckCircle2 className="h-7 w-7 text-accent-silver" aria-hidden="true" />
        </span>
        <h2
          id="application-received-title"
          className="mt-5 font-display text-xl font-semibold text-foreground"
        >
          Application received
        </h2>
        <p id="application-received-body" className="mt-2 text-sm text-muted-foreground">
          Thank you for registering with Daotra. Your Affiliate Manager will contact you soon.
        </p>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="mt-7 w-full"
          onClick={() => ref.current?.close()}
        >
          Done
        </Button>
      </div>
    </dialog>
  );
}
