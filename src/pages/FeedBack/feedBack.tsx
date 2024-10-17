import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HomeIcon, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import api from "@/configs/axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";

// Confetti Effect Function
function launchConfetti() {
  const end = Date.now() + 3 * 1000; // 3 seconds
  const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

  (function frame() {
    if (Date.now() > end) return;

    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      startVelocity: 60,
      origin: { x: 0, y: 0.5 },
      colors: colors,
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      startVelocity: 60,
      origin: { x: 1, y: 0.5 },
      colors: colors,
    });

    requestAnimationFrame(frame);
  })();
}

export default function FeedbackForm() {
  const { bookingID } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const starVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.2 },
    tap: { scale: 0.9 },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bookingID) {
      console.error("Booking ID is missing. Cannot submit feedback.");
      return;
    }

    const feedbackData = {
      rate: rating,
      comments: comment,
    };

    try {
      const response = await api.post(
        `/Feedback/create-feedback/${bookingID}`,
        feedbackData
      );
      if (response.status === 200 || response.status === 201) {
        setSubmitted(true);
        launchConfetti();
      } else {
        console.error("Failed to submit feedback");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  // Trigger confetti effect when submitted state changes to true
  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        navigate("/"); // Redirect to home page after 10 seconds
      }, 5000);

      return () => clearTimeout(timer); // Clear the timer if the component unmounts
    }
  }, [submitted, navigate]);

  if (submitted) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-green-100"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="flex justify-center space-x-1"
            >
              {[...Array(rating)].map((_, index) => (
                <Star
                  key={index}
                  className="w-8 h-8 text-yellow-400 fill-current"
                />
              ))}
            </motion.div>
            <h2 className="mt-4 text-2xl font-bold text-green-700">
              Thank You for Your Feedback!
            </h2>
            <p className="mt-2 text-gray-600">
              Your input helps us improve our services.
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Redirecting to the homepage in 10 seconds...
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-green-100"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Service feedback</CardTitle>
          <CardDescription>Please rate your experience below</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="flex justify-center space-x-1 items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  variants={starVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Star
                    className={`w-8 h-8 ${
                      rating >= star
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                </motion.button>
              ))}
              <span className="ml-2 text-gray-600">{rating}/5 stars</span>
            </div>
            <Textarea
              placeholder="Share your thoughts about our service..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800"
            >
              Submit feedback
            </Button>
            <div className="text-center text-gray-500">OR</div>
            <Button variant="outline" className="w-full">
              <Link to="/" className="flex justify-items-center justify-center">
                <HomeIcon className="text-base mr-1.5" />
                Home
              </Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}
