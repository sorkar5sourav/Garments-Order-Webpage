import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import Section from "../../Components/ui/Section";
import ProductCardSkeleton from "../../Components/ui/ProductCardSkeleton";

const Blog = () => {
  const axiosInstance = useAxios();

  const { data, isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const res = await axiosInstance.get("/blogs?limit=100");
      return res.data.blogs || [];
    },
  });

  const blogs = data || [];

  return (
    <Section
      id="blog-page"
      title="Production Insights & Updates"
      subtitle="Curated articles about garment production workflows, quality control, and buyer communication."
    >
      {isLoading ? (
        <div className="grid gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-12 text-base-content/60">
          <p>No blog posts yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid gap-6 max-w-4xl mx-auto">
          {blogs.map((blog) => (
            <article
              key={blog._id}
              className="card bg-base-100 shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {blog.featuredImage && (
                <figure className="aspect-video overflow-hidden">
                  <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </figure>
              )}
              <div className="card-body">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h2 className="card-title text-secondary">{blog.title}</h2>
                    <p className="text-base-content/70 mb-2">
                      {blog.excerpt}
                    </p>
                  </div>
                  <span className="badge badge-primary">
                    {blog.category}
                  </span>
                </div>
                <div className="flex gap-4 text-sm text-base-content/50">
                  <span>By {blog.author}</span>
                  <span>•</span>
                  <span>
                    {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-sm btn-outline">Read More</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </Section>
  );
};

export default Blog;


