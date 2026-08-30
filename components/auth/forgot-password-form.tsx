import Link from "next/link";
import { Label, Input } from "@/components/ui/form-fields";
import { Button } from "@/components/ui/button";

// UI-only stub: wire this to a real email-based reset flow once an email
// provider and database are configured (see .env.example).
export function ForgotPasswordForm() {
  return (
    <form className="space-y-5">
      <div>
        <Label htmlFor="reset-email">Email</Label>
        <Input id="reset-email" type="email" autoComplete="email" placeholder="you@company.com" />
      </div>
      <Button type="submit" size="lg" className="w-full" disabled>
        Send reset link
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Password reset delivery isn&rsquo;t wired up yet in this build.
      </p>
      <p className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="text-accent-cyan hover:underline">
          Back to log in
        </Link>
      </p>
    </form>
  );
}
