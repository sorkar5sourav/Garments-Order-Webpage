import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Section from "../../../Components/ui/Section";

const PostBlog = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    featuredImage: "",
    category: "General",
    isPublished: false,
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch blogs (all for admin, not just published)
  const { data, isLoading } = useQuery({
    queryKey: ["blogs-admin"],
    queryFn: async () => {
      const res = await axiosSecure.get("/blogs?limit=100");
      return res.data.blogs || [];
    },
  });

  // Create blog mutation
  const createMutation = useMutation({
    mutationFn: async (newBlog) => {
      const res = await axiosSecure.post("/blogs", newBlog);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Success", "Blog posted successfully", "success");
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        author: "",
        featuredImage: "",
        category: "General",
        isPublished: false,
      });
      queryClient.invalidateQueries({ queryKey: ["blogs-admin"] });
    },
    onError: (error) => {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to post blog",
        "error"
      );
    },
  });

  // Update blog mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await axiosSecure.patch(`/blogs/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Success", "Blog updated successfully", "success");
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        author: "",
        featuredImage: "",
        category: "General",
        isPublished: false,
      });
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ["blogs-admin"] });
    },
    onError: (error) => {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to update blog",
        "error"
      );
    },
  });

  // Delete blog mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/blogs/${id}`);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Success", "Blog deleted successfully", "success");
      queryClient.invalidateQueries({ queryKey: ["blogs-admin"] });
    },
    onError: (error) => {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to delete blog",
        "error"
      );
    },
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      Swal.fire("Validation", "Title and content are required", "warning");
      return;
    }

    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        data: formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (blog) => {
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      author: blog.author,
      featuredImage: blog.featuredImage,
      category: blog.category,
      isPublished: blog.isPublished || false,
    });
    setEditingId(blog._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      author: "",
      featuredImage: "",
      category: "General",
      isPublished: false,
    });
    setEditingId(null);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete Blog?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Form Section */}
      <Section title={editingId ? "Edit Blog" : "Post New Blog"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Blog Title</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter blog title"
              className="input input-bordered"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Featured Image URL</span>
            </label>
            <input
              type="url"
              name="featuredImage"
              value={formData.featuredImage}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="input input-bordered"
            />
            {formData.featuredImage && (
              <img
                src={formData.featuredImage}
                alt="preview"
                className="mt-2 max-h-32 rounded"
                onError={() => {
                  Swal.fire("Error", "Failed to load image", "error");
                }}
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Author Name</span>
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Your name or Anonymous"
                className="input input-bordered"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Category</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="select select-bordered"
              >
                <option>General</option>
                <option>Fashion Tips</option>
                <option>News</option>
                <option>Trends</option>
                <option>Tutorial</option>
              </select>
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Excerpt (optional)</span>
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Short summary of the blog (will be auto-generated if empty)"
              className="textarea textarea-bordered h-20"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Content</span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your blog content here..."
              className="textarea textarea-bordered h-64"
              required
            />
          </div>

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text font-semibold">Publish now?</span>
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
                className="checkbox"
              />
            </label>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="btn btn-primary"
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : editingId ? (
                "Update Blog"
              ) : (
                "Post Blog"
              )}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-ghost"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </Section>

      {/* Blogs List Section */}
      <Section title="Blog List">
        {isLoading ? (
          <div className="text-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : !data || data.length === 0 ? (
          <div className="text-center py-8 text-base-content/60">
            No blogs posted yet
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((blog) => (
              <div
                key={blog._id}
                className="card bg-base-100 shadow-md p-4 space-y-3"
              >
                <div className="flex gap-4">
                  {blog.featuredImage && (
                    <img
                      src={blog.featuredImage}
                      alt={blog.title}
                      className="w-24 h-24 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          {blog.title}
                        </h3>
                        <p className="text-base-content/70 text-sm mb-2">
                          {blog.excerpt}
                        </p>
                      </div>
                      <span
                        className={`badge ${
                          blog.isPublished
                            ? "badge-success"
                            : "badge-warning"
                        }`}
                      >
                        {blog.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                    <div className="flex gap-2 text-xs text-base-content/50">
                      <span>By {blog.author}</span>
                      <span>•</span>
                      <span>{blog.category}</span>
                      <span>•</span>
                      <span>
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="btn btn-sm btn-outline btn-primary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    disabled={deleteMutation.isPending}
                    className="btn btn-sm btn-outline btn-error"
                  >
                    {deleteMutation.isPending ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
};

export default PostBlog;
