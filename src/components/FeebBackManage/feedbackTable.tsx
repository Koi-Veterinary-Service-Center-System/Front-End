import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import api from "../../configs/axios"; // Make sure this path is correct
import { Eye, EyeOff } from "lucide-react"; // Import both icons
import { Feedback } from "@/types/info";

const FeedbackTable = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch feedback data from API
  const fetchFeedbackData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/Feedback/all-feedback");
      setFeedbacks(response.data);
    } catch (error) {
      console.error("Failed to fetch feedback data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle visibility toggle
  const handleToggleVisibility = async (
    feedbackID: number,
    currentStatus: boolean
  ) => {
    try {
      const response = await api.put(
        `/Feedback/show-hide-feedback/${feedbackID}`,
        {
          isVisible: !currentStatus, // Toggle visibility
        }
      );

      if (response.status === 200) {
        // Optionally, update local state immediately for better UX
        setFeedbacks((prevFeedbacks) =>
          prevFeedbacks.map((feedback) =>
            feedback.feedbackID === feedbackID
              ? { ...feedback, isVisible: !currentStatus }
              : feedback
          )
        );

        // Fetch updated feedback data
        fetchFeedbackData(); // Refresh feedback data to ensure the UI reflects changes
      }
    } catch (error) {
      console.error("Failed to update feedback visibility:", error);
    }
  };

  // Fetch feedback data on component mount
  useEffect(() => {
    fetchFeedbackData();
  }, []);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-4">
        Feedback List
      </h2>

      {loading ? (
        <div className="text-white">Loading feedback...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Feedback ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Comments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Visibility
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide divide-gray-700">
              {feedbacks.map((feedback) => (
                <motion.tr
                  key={feedback.feedbackID}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                    {feedback.feedbackID}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                    {feedback.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                    {feedback.rate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                    {feedback.comments}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        feedback.isVisible
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {feedback.isVisible ? "Visible" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <button
                      onClick={() =>
                        handleToggleVisibility(
                          feedback.feedbackID,
                          feedback.isVisible
                        )
                      }
                      className="text-indigo-400 hover:text-indigo-300"
                    >
                      {feedback.isVisible ? (
                        <Eye size={18} />
                      ) : (
                        <EyeOff size={18} />
                      )}{" "}
                      {/* Conditional rendering */}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default FeedbackTable;
