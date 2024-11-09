import DangerZone from "@/components/settings/DangerZone";
import ProfileAd from "@/components/settings/ProfileAd";
import Sidebar from "@/components/Sidebar/sidebar";

const SettingsPage = () => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-white text-gray-800 overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-80 " />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>
      <Sidebar />
      <div className="flex-1 overflow-auto relative z-10">
        <main className="max-w-4xl mx-auto py-6 px-4 lg:px-8">
          <ProfileAd />
          <DangerZone />
        </main>
      </div>
    </div>
  );
};
export default SettingsPage;
