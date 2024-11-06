import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import api from "../../configs/axios"; // Make sure this path is correct
import { Eye, EyeOff } from "lucide-react";
import { Feedback } from "@/types/info";
import { toast } from "sonner";

const FeedbackTable = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFullCommentId, setShowFullCommentId] = useState<number | null>(
    null
  ); // New state for comment visibility

  const fetchFeedbackData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/Feedback/all-feedback");
      const sortedFeedbacks = response.data.sort(
        (a: any, b: any) => b.feedbackID - a.feedbackID
      );

      setFeedbacks(sortedFeedbacks);
    } catch (error) {
      console.error("Failed to fetch feedback data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async (
    feedbackID: number,
    currentStatus: boolean
  ) => {
    try {
      const response = await api.put(
        `/Feedback/show-hide-feedback/${feedbackID}?isVisible=${!currentStatus}`
      );

      if (response.status === 200) {
        setFeedbacks((prevFeedbacks) =>
          prevFeedbacks.map((feedback) =>
            feedback.feedbackID === feedbackID
              ? { ...feedback, isVisible: !currentStatus }
              : feedback
          )
        );
        toast.success("Feedback visibility updated successfully!");
      }
    } catch (error: any) {
      toast.error(error.response?.data || "Failed to update visibility");
    }
  };

  useEffect(() => {
    fetchFeedbackData();
  }, []);

  return (
    <motion.div
      className="bg-gradient-to-br from-blue-50 to-white shadow-lg rounded-xl p-6 border border-blue-200 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-xl font-semibold text-blue-800 mb-4">
        Feedback List
      </h2>

      {loading ? (
        <div className="text-blue-600">Loading feedback...</div>
      ) : feedbacks.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <img
            src="/src/assets/images/No-Messages-1--Streamline-Bruxelles.png"
            alt="No Feedback"
            className="w-32 h-32 object-contain mb-4"
          />
          <p className="text-muted-foreground">No Feedback found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-blue-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                  Feedback ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                  Comments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                  Visibility
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-blue-100">
              {feedbacks.map((feedback) => (
                <motion.tr
                  key={feedback.feedbackID}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {feedback.feedbackID}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {feedback.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {feedback.rate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {showFullCommentId === feedback.feedbackID
                      ? feedback.comments
                      : feedback.comments.length > 50
                      ? `${feedback.comments.substring(0, 50)}...`
                      : feedback.comments}
                    {feedback.comments.length > 50 && (
                      <button
                        onClick={() =>
                          setShowFullCommentId((prev) =>
                            prev === feedback.feedbackID
                              ? null
                              : feedback.feedbackID
                          )
                        }
                        className="text-blue-600 ml-2"
                      >
                        {showFullCommentId === feedback.feedbackID
                          ? "View Less"
                          : "View More"}
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() =>
                        handleToggleVisibility(
                          feedback.feedbackID,
                          feedback.isVisible
                        )
                      }
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {feedback.isVisible ? (
                        <Eye size={18} />
                      ) : (
                        <EyeOff size={18} />
                      )}
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
