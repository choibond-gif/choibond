import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import BriefingCard from "@/components/BriefingCard";
import FxRateCard from "@/components/FxRateCard";
import EventCalendarCard from "@/components/EventCalendarCard";
import NewsCard from "@/components/NewsCard";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("approved")
    .eq("id", user.id)
    .single();

  if (!profile?.approved) redirect("/pending");

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto bg-gray-50 px-8 py-8">
        <Header />
        <BriefingCard />

        <div className="grid grid-cols-2 gap-6 mb-6">
          <FxRateCard />
          <EventCalendarCard />
        </div>

        <NewsCard />
      </main>
    </div>
  );
}
