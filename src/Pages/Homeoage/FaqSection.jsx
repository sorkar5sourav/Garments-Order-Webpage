import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import useAxios from "../../hooks/useAxios";
import Section from "../../Components/ui/Section";
import Loading from "../../Components/atoms/Loading";
import EmptyState from "../../Components/ui/EmptyState";
import { staggerContainer, staggerItem } from "../../utils/animations";

const FaqSection = () => {
  const axiosInstance = useAxios();

  const { data, isLoading } = useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      const res = await axiosInstance.get("/faqs");
      return res.data || { faqs: [] };
    },
  });

  const faqs = data?.faqs || [];

  return (
    <Section
      title="Frequently Asked Questions"
      subtitle="Quick answers to the most common questions about ordering and tracking garments."
      className="bg-base-100"
    >
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loading />
        </div>
      ) : faqs.length === 0 ? (
        <EmptyState
          title="No FAQs published yet"
          message="Admins can add FAQs from the dashboard to help buyers and managers."
        />
      ) : (
        <motion.div 
          className="join join-vertical w-full"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {faqs.map((faq, index) => (
            <motion.div 
              key={faq._id} 
              variants={staggerItem}
              className="collapse collapse-arrow join-item"
            >
              <input type="radio" name="faq-accordion" defaultChecked={index === 0} />
              <div className="collapse-title text-base font-medium">
                {faq.question}
              </div>
              <div className="collapse-content text-sm text-base-content/80">
                <p>{faq.answer}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
  )}
</Section>
);
};
export default FaqSection;