import HeaderAd from "@/components/Header/headerAd";
import RevenueChart from "@/components/analyics/RevenueChart";
import ChannelPerformance from "@/components/analyics/ChannelPerformance";
import UserRetention from "@/components/analyics/UserRetension";
import Sidebar from "@/components/Sidebar/sidebar";
import FeedbackTable from "@/components/FeebBackManage/feedbackTable";

const FeedbackManagement = () => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-white text-gray-800 overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white " />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>
      <Sidebar />
      <div className="flex-1 overflow-auto relative z-10">
        <HeaderAd title={"Analytics Dashboard"} />

        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          <FeedbackTable />
          <RevenueChart />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <ChannelPerformance />
            <UserRetention />
          </div>
        </main>
      </div>
    </div>
  );
};
export default FeedbackManagement;
