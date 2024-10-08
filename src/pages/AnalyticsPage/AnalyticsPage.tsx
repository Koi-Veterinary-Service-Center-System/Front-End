import HeaderAd from "@/components/common/header";
import OverviewCards from "@/components/analyics/OverviewCards";
import RevenueChart from "@/components/analyics/RevenueChart";
import ChannelPerformance from "@/components/analyics/ChannelPerformance";
import ProductPerformance from "@/components/analyics/ProductPerformance";
import UserRetention from "@/components/analyics/UserRetension";
import Sidebar from "@/components/Sidebar/sidebar";

const AnalyticsPage = () => {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80 " />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>
      <Sidebar />
      <div className="flex-1 overflow-auto relative z-10">
        <HeaderAd title={"Analytics Dashboard"} />

        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          <OverviewCards />
          <RevenueChart />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <ChannelPerformance />
            <ProductPerformance />
            <UserRetention />
          </div>
        </main>
      </div>
    </div>
  );
};
export default AnalyticsPage;
