import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import Section from "../../Components/ui/Section";
import ProductCardSkeleton from "../../Components/ui/ProductCardSkeleton";

const Help = () => {
  const axiosInstance = useAxios();

  const { data, isLoading } = useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      const res = await axiosInstance.get("/faqs");
      return res.data.faqs || [];
    },
  });

  const faqs = data || [];

  return (
    <Section
      id="help-page"
      title="Help & Support"
      subtitle="Answers to common questions about using the Garments Order & Production Tracker."
    >
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-24"></div>
          ))}
        </div>
      ) : faqs.length === 0 ? (
        <div className="text-center py-12 text-base-content/60">
          <p>No FAQs available yet.</p>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq._id}
              className="collapse collapse-plus border border-base-300 rounded"
            >
              <input type="radio" name="faqs-accordion" defaultChecked={index === 0} />
              <div className="collapse-title text-lg font-semibold text-secondary">
                {faq.question}
              </div>
              <div className="collapse-content text-base-content/80">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      </Section>
  );
};

export default Help;

