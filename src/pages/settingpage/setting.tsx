import HeaderAd from "@/components/common/header";
import ConnectedAccounts from "@/components/settings/ConnectedAccounts";
import DangerZone from "@/components/settings/DangerZone";
import Notifications from "@/components/settings/Notifications";
import ProfileAd from "@/components/settings/ProfileAd";
import Security from "@/components/settings/Security";
import Sidebar from "@/components/Sidebar/sidebar";

const SettingsPage = () => {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80 " />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>
      <Sidebar />
      <div className="flex-1 overflow-auto relative z-10">
        <HeaderAd title="Settings" />
        <main className="max-w-4xl mx-auto py-6 px-4 lg:px-8">
          <ProfileAd />
          <Notifications />
          <Security />
          <ConnectedAccounts />
          <DangerZone />
        </main>
      </div>
    </div>
  );
};
export default SettingsPage;
