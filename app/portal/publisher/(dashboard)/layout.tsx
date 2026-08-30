import { LayoutDashboard, Link2, Wallet, LineChart, Settings } from "lucide-react";
import { DashboardShell, type DashboardNavItem } from "@/components/dashboard/dashboard-shell";

const NAV_ITEMS: DashboardNavItem[] = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/offers", label: "Offers", icon: Link2 },
  { href: "/reports", label: "Reports", icon: LineChart },
  { href: "/payouts", label: "Payouts", icon: Wallet },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function PublisherDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell roleLabel="Publisher Dashboard" navItems={NAV_ITEMS}>
      {children}
    </DashboardShell>
  );
}
