import type { Metadata } from "next";
import { Label, Input } from "@/components/ui/form-fields";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Settings", robots: { index: false, follow: false } };

export default function PublisherSettingsPage() {
  return (
    <div className="max-w-lg space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Account and payout preferences.</p>
      </div>
      <form className="space-y-5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-6">
        <div>
          <Label htmlFor="settings-name">Full name</Label>
          <Input id="settings-name" placeholder="Jordan Lee" disabled />
        </div>
        <div>
          <Label htmlFor="settings-payout-email">Payout email</Label>
          <Input id="settings-payout-email" type="email" placeholder="payouts@yourcompany.com" disabled />
        </div>
        <Button type="button" disabled className="w-full">
          Save changes
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Editing isn&rsquo;t wired to an account backend in this build.
        </p>
      </form>
    </div>
  );
}
