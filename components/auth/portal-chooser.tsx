import { Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPublisherPortalUrls } from "@/lib/portal-urls";

// Publisher is the only self-serve portal - advertisers are onboarded via
// Telegram (see the Advertisers page), so there's no advertiser option here.
export function PortalChooser({ mode }: { mode: "login" | "register" }) {
  const affHref = getPublisherPortalUrls()[mode];
  const verb = mode === "login" ? "Login" : "Register";

  return (
    <Button asChild variant="outline" size="lg" className="h-14 w-full justify-start gap-3 text-base">
      <a href={affHref}>
        <Link2 className="h-5 w-5 text-accent-silver" />
        Publisher {verb}
      </a>
    </Button>
  );
}
