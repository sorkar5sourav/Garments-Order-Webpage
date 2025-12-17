

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const CustomerFeedback = () => {
  const axiosInstance = useAxios();

  const { data: reviewData = { reviews: [] } } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const response = await axiosInstance.get("/reviews");
      return response.data || { reviews: [] };
    },
  });

  const reviews = reviewData.reviews || [];

  // Fallback reviews if no reviews from API
  const fallbackReviews = [
    {
      _id: "fallback-1",
      name: "Sarah Johnson",
      rating: 5,
      comment: "Amazing quality garments! The tracking system made it so easy to follow my order.",
      avatar: "👩‍💼",
    },
    {
      _id: "fallback-2",
      name: "Mike Chen",
      rating: 5,
      comment: "Fast delivery and excellent customer service. Will definitely order again!",
      avatar: "👨‍💻",
    },
    {
      _id: "fallback-3",
      name: "Emily Davis",
      rating: 4,
      comment: "Love the variety of products. The payment process was smooth and secure.",
      avatar: "👩‍🎨",
    },
    {
      _id: "fallback-4",
      name: "David Wilson",
      rating: 5,
      comment: "Professional service from start to finish. Highly recommend this platform!",
      avatar: "👨‍🔬",
    },
    {
      _id: "fallback-5",
      name: "Lisa Brown",
      rating: 5,
      comment: "The garments exceeded my expectations. Great attention to detail!",
      avatar: "👩‍🏫",
    },
  ];

  const displayReviews = reviews.length > 0 ? reviews : fallbackReviews;

  return (
    <div className="my-24 bg-base-200 py-16">
      <div className="text-center max-w-4xl mx-auto mb-12 px-4">
        <h2 className="text-4xl font-bold text-secondary mb-6">
          What Our Customers Are Saying
        </h2>
        <p className="text-lg text-base-content leading-relaxed">
          Hear from our satisfied customers about their experience with our garments ordering platform.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          centeredSlides={true}
          slidesPerView={5}
          spaceBetween={20}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          loop={true}
          pagination={{ clickable: true, el: ".custom-pagination" }}
          navigation={{
            nextEl: ".next-btn",
            prevEl: ".prev-btn",
          }}
          breakpoints={{
            0: { slidesPerView: 1, centeredSlides: false },
            640: { slidesPerView: 3, centeredSlides: true },
            1024: { slidesPerView: 5, centeredSlides: true },
          }}
          className="feedback-swiper"
        >
          {displayReviews.map((review) => (
            <SwiperSlide key={review.id}>
              {({ isActive }) => (
                <div
                  className={`card bg-base-100 shadow-lg p-6 h-64 flex flex-col justify-between transition-all duration-300 ${
                    isActive ? "scale-110 opacity-100" : "scale-90 opacity-50"
                  }`}
                >
                  <div className="flex items-center mb-4">
                    <div className="text-3xl mr-3">{review.avatar}</div>
                    <div>
                      <h4 className="font-semibold text-secondary">{review.name}</h4>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${
                              i < review.rating ? "text-yellow-400" : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-base-content grow">{review.comment}</p>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="flex justify-center items-center mt-8 mx-auto space-x-4">
          <button className="prev-btn btn btn-circle btn-ghost">
            ←
          </button>
          <div className="custom-pagination"></div>
          <button className="next-btn btn btn-circle btn-ghost">
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerFeedback;