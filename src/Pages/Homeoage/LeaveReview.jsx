import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";

const LeaveReview = () => {
  const axiosInstance = useAxios();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please log in to leave a review.",
        confirmButtonColor: "#3B82F6",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewData = {
        ...data,
        rating: parseInt(data.rating),
        createdAt: new Date(),
        userId: user.uid,
        userEmail: user.email,
      };

      const response = await axiosInstance.post("/reviews", reviewData);

      if (response.data.reviewId) {
        Swal.fire({
          icon: "success",
          title: "Review Submitted!",
          text: "Thank you for your feedback. Your review will be published after admin approval.",
          confirmButtonColor: "#3B82F6",
        });
        reset();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "There was an error submitting your review. Please try again.",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const containerAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const headerAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } },
  };

  const formContainerAnimation = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 0.6, delay: 0.3 } 
    },
  };

  const fieldAnimation = {
    hidden: { opacity: 0, x: -20 },
    visible: (index) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, delay: 0.4 + index * 0.1 },
    }),
  };

  const buttonAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.7 } },
  };

  return (
    <motion.div 
      className="mt-10 bg-base-200 py-16"
      initial="hidden"
      whileInView="visible"
      variants={containerAnimation}
      viewport={{ once: true }}
    >
      <div className="max-w-4xl mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          variants={headerAnimation}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-secondary mb-6">
            Leave a Review
          </h2>
          <p className="text-lg text-base-content leading-relaxed">
            Share your experience with our garments ordering platform. Your
            feedback helps us improve!
          </p>
        </motion.div>

        <motion.div 
          className="bg-base-100 rounded-lg shadow-lg p-8"
          variants={formContainerAnimation}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div
                custom={0}
                variants={fieldAnimation}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </motion.div>

              <motion.div
                custom={1}
                variants={fieldAnimation}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </motion.div>
            </motion.div>

            <motion.div
              custom={2}
              variants={fieldAnimation}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating *
              </label>
              <select
                {...register("rating", { required: "Please select a rating" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">Select a rating</option>
                <option value="5">⭐⭐⭐⭐⭐ - Excellent</option>
                <option value="4">⭐⭐⭐⭐ - Very Good</option>
                <option value="3">⭐⭐⭐ - Good</option>
                <option value="2">⭐⭐ - Fair</option>
                <option value="1">⭐ - Poor</option>
              </select>
              {errors.rating && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.rating.message}
                </p>
              )}
            </motion.div>

            <motion.div
              custom={3}
              variants={fieldAnimation}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review *
              </label>
              <textarea
                {...register("comment", {
                  required: "Review comment is required",
                  minLength: {
                    value: 10,
                    message: "Review must be at least 10 characters long",
                  },
                  maxLength: {
                    value: 500,
                    message: "Review must be less than 500 characters",
                  },
                })}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                placeholder="Share your experience with our platform..."
              />
              {errors.comment && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.comment.message}
                </p>
              )}
            </motion.div>

            <motion.div 
              className="text-center"
              variants={buttonAnimation}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit Review"
                )}
              </motion.button>
            </motion.div>
          </form>

          <motion.div 
            className="mt-6 text-center text-sm text-gray-500"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <p>Your review will be published after admin approval.</p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LeaveReview;
