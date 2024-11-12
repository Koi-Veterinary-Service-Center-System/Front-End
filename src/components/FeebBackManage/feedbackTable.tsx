import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Trash, AlertTriangle } from "lucide-react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import api from "../../configs/axios";
import { toast } from "sonner";
import { Feedback } from "@/types/info";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Mock userRole for demonstration, replace with actual role from context or state
const userRole = "Manager"; // Replace with the actual user role

const FeedbackTable = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState<Feedback | null>(
    null
  );
  const [profile, setProfile] = useState<Profile | null>(null);

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

  const openDeleteModal = (feedback: Feedback) => {
    setFeedbackToDelete(feedback);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteFeedback = async () => {
    if (!feedbackToDelete) return;
    try {
      const response = await api.delete(
        `/Feedback/delete-feedback/${feedbackToDelete.feedbackID}`
      );
      if (response.status === 200) {
        setFeedbacks((prevFeedbacks) =>
          prevFeedbacks.filter(
            (feedback) => feedback.feedbackID !== feedbackToDelete.feedbackID
          )
        );
        toast.success("Feedback deleted successfully!");
      }
    } catch (error: any) {
      toast.error(error.response?.data || "Failed to delete feedback");
    } finally {
      setIsDeleteModalOpen(false);
      setFeedbackToDelete(null);
    }
  };

  useEffect(() => {
    fetchFeedbackData();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await api.get("/User/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfile();
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
                    {feedback.comments.length > 50 ? (
                      <span
                        data-tooltip-id={`tooltip-${feedback.feedbackID}`}
                        data-tooltip-content={feedback.comments}
                        className="text-black cursor-pointer"
                      >
                        {feedback.comments.slice(0, 50)}...
                      </span>
                    ) : (
                      feedback.comments
                    )}
                    <Tooltip
                      id={`tooltip-${feedback.feedbackID}`}
                      style={{
                        maxWidth: "200px",
                        whiteSpace: "normal",
                      }}
                    />
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm flex space-x-2">
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
                    {profile?.role === "Manager" && (
                      <button
                        onClick={() => openDeleteModal(feedback)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash size={18} />
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {feedbackToDelete && (
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="bg-white sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="flex items-center text-red-600">
                <AlertTriangle className="w-6 h-6 mr-2" />
                Confirm Deletion
              </DialogTitle>
            </DialogHeader>
            <p className="text-gray-600">
              Are you sure you want to delete this feedback? This action cannot
              be undone.
            </p>
            <DialogFooter className="flex justify-end space-x-4 mt-4">
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteFeedback}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
};

export default FeedbackTable;
