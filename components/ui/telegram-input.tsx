import * as React from "react";
import { Input } from "@/components/ui/form-fields";
import { normalizeTelegramHandle } from "@/lib/validation/telegram";

// A text field for a Telegram handle. The "@" is part of the value: it's
// added automatically on the first character typed, and a pasted "@name"
// keeps a single "@" (see normalizeTelegramHandle). The form schema
// (lib/validation/telegram.ts) then requires it.
//
// onChange is applied AFTER the incoming props are spread: react-hook-form's
// register() hands us its own onChange, and spreading it last would replace
// the normalizing handler (which is how the old version of this component
// silently stopped normalizing anything).
export const TelegramInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ onChange, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      type="text"
      inputMode="text"
      autoCapitalize="none"
      autoCorrect="off"
      autoComplete="off"
      spellCheck={false}
      placeholder="@username"
      {...props}
      onChange={(e) => {
        e.target.value = normalizeTelegramHandle(e.target.value);
        onChange?.(e);
      }}
    />
  );
});
TelegramInput.displayName = "TelegramInput";
