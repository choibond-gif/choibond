import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import BriefingCard from "@/components/BriefingCard";
import FxRateCard from "@/components/FxRateCard";
import EventCalendarCard from "@/components/EventCalendarCard";
import NewsCard from "@/components/NewsCard";

export default function DashboardPage() {
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
