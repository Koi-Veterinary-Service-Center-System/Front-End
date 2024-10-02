import Sidebar from "@/components/Sidebar/sidebar";
import { Link } from "react-router-dom";

function AdminDashbroad({ name }) {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* BG */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80 " />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>

      <Sidebar />
      {/* <Link to="/overview">Overview</Link>
      <Link to="/service">Service</Link> */}
    </div>
  );
}

export default AdminDashbroad;
