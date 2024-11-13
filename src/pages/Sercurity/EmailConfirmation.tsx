import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaCheck } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import api from "@/configs/axios";
import { toast } from "sonner";
import { Spin } from "antd";

export default function EmailConfirmation() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value)) || element.value.length > 1) return;

    setCode((prevCode) =>
      prevCode.map((d, idx) => (idx === index ? element.value : d))
    );

    if (element.value !== "" && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      if (index > 0 && code[index] === "") {
        inputs.current[index - 1]?.focus();
        setCode(code.map((d, idx) => (idx === index - 1 ? "" : d)));
      } else {
        setCode(code.map((d, idx) => (idx === index ? "" : d)));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post("/User/verify-email", {
        code: code.join(""),
      });

      if (response.status === 200) {
        setIsSubmitted(true);
        toast.success("Email confirmed! Redirecting to login page...");
      } else {
        toast.error("Failed to verify. Please check your code and try again.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("An error occurred while verifying your code.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isSubmitted, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-100">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="flex justify-center mb-6"
        >
          <FaEnvelope className="text-blue-500 text-5xl" />
        </motion.div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Email Confirmation
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Please enter the verification code sent to your email
        </p>
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-2">
              {code.map((digit, idx) => (
                <motion.input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  ref={(el) => (inputs.current[idx] = el)}
                  onChange={(e) => handleChange(e.target, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                />
              ))}
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              disabled={code.some((digit) => digit === "") || isLoading}
            >
              {isLoading ? <Spin /> : "Verify Code"}
            </Button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="flex justify-center mb-4"
            >
              <FaCheck className="text-green-500 text-5xl" />
            </motion.div>
            <p className="text-xl font-semibold text-gray-800">
              Email Confirmed!
            </p>
            <p className="text-gray-600 mt-2">
              Thank you for verifying your email address. You will be redirected
              to the login page in 3 seconds...
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
