import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import useAxios from "../../hooks/useAxios";
import Section from "../../Components/ui/Section";
import EmptyState from "../../Components/ui/EmptyState";
import ProductCardSkeleton from "../../Components/ui/ProductCardSkeleton";
import { Link } from "react-router";
import { staggerContainer, staggerItem, fadeInUp } from "../../utils/animations";

const BlogHighlights = () => {
  const axiosInstance = useAxios();

  const { data, isLoading } = useQuery({
    queryKey: ["blog-highlights"],
    queryFn: async () => {
      const res = await axiosInstance.get("/blogs", { params: { limit: 3 } });
      return res.data || { blogs: [] };
    },
  });

  const blogs = data?.blogs || [];

  return (
    <Section
      title="Production Insights"
      subtitle="Latest learnings and best practices from garment production workflows."
      className="bg-base-200"
    >
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <EmptyState
          title="No blog posts yet"
          message="When admins publish articles, they will appear here as highlights."
          action={
            <Link to="/blog" className="btn btn-primary text-base-300 mt-3">
              Visit Blog
            </Link>
          }
        />
      ) : (
        <>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {blogs.map((post) => (
              <motion.article
                key={post._id}
                variants={staggerItem}
                className="bg-base-100 rounded-2xl shadow-md p-5 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <h3 className="text-lg font-semibold text-secondary mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-base-content/70 mb-3 line-clamp-3">
                  {post.excerpt}
                </p>
                <p className="text-xs text-base-content/60 mb-4">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString()
                    : ""}
                </p>
                <span className="text-xs uppercase tracking-wide text-primary mt-auto">
                  {post.category || "Production"}
                </span>
              </motion.article>
            ))}
          </motion.div>
          <motion.div 
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link to="/blog" className="btn btn-outline">
              View all articles
            </Link>
          </motion.div>
        </>
      )}
    </Section>
  );
};

export default BlogHighlights;

