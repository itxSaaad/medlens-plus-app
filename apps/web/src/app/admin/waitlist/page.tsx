import type { Metadata } from "next";
import { WaitlistAdminPanel } from "@/components/admin/waitlist-admin-panel";

export const metadata: Metadata = {
  title: "Waitlist admin",
  robots: { index: false, follow: false },
};

export default function WaitlistAdminPage() {
  return (
    <main className="min-h-screen bg-paper">
      <WaitlistAdminPanel />
    </main>
  );
}
