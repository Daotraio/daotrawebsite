import * as React from "react";
import { cn } from "@/lib/utils";

export const TelegramInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, id, ...props }, ref) => {
  return (
    <div
      className={cn(
        "flex items-center rounded-md border border-white/15 bg-white/[0.03] pl-4 transition-colors",
        "focus-within:border-accent-cyan focus-within:ring-1 focus-within:ring-accent-cyan"
      )}
    >
      <span aria-hidden="true" className="select-none text-sm text-muted-foreground">
        @
      </span>
      <input
        ref={ref}
        id={id}
        type="text"
        inputMode="text"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        placeholder="username"
        aria-label="Telegram username, without the @ symbol"
        className={cn(
          "w-full bg-transparent px-1 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none disabled:opacity-50",
          className
        )}
        // Users can't type or paste a leading "@" - it's already shown as a
        // fixed prefix outside the editable value, so a pasted "@handle"
        // would otherwise silently double up.
        onChange={(e) => {
          e.target.value = e.target.value.replace(/^@+/, "");
          props.onChange?.(e);
        }}
        {...props}
      />
    </div>
  );
});
TelegramInput.displayName = "TelegramInput";
