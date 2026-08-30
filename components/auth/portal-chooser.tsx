import { Link2, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PortalChooser({ mode }: { mode: "login" | "register" }) {
  const affHref = `https://aff.daotra.io/${mode}`;
  const advHref = `https://adv.daotra.io/${mode}`;
  const verb = mode === "login" ? "Login" : "Register";

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Button asChild variant="outline" size="lg" className="h-14 justify-start gap-3 text-base">
        <a href={affHref}>
          <Link2 className="h-5 w-5 text-accent-silver" />
          Publisher {verb}
        </a>
      </Button>
      <Button asChild variant="outline" size="lg" className="h-14 justify-start gap-3 text-base">
        <a href={advHref}>
          <Megaphone className="h-5 w-5 text-accent-silver" />
          Advertiser {verb}
        </a>
      </Button>
    </div>
  );
}
