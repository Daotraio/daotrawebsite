import { LayoutDashboard, Megaphone, LineChart, CreditCard, Settings } from "lucide-react";
import { DashboardShell, type DashboardNavItem } from "@/components/dashboard/dashboard-shell";

const NAV_ITEMS: DashboardNavItem[] = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/reports", label: "Reports", icon: LineChart },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function AdvertiserDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell roleLabel="Advertiser Dashboard" navItems={NAV_ITEMS}>
      {children}
    </DashboardShell>
  );
}
