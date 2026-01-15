import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Section from "../../../Components/ui/Section";

const PostFAQ = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    order: 0,
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch FAQs
  const { data, isLoading } = useQuery({
    queryKey: ["faqs-admin"],
    queryFn: async () => {
      const res = await axiosSecure.get("/faqs");
      return res.data.faqs || [];
    },
  });

  // Create FAQ mutation
  const createMutation = useMutation({
    mutationFn: async (newFAQ) => {
      const res = await axiosSecure.post("/faqs", newFAQ);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Success", "FAQ posted successfully", "success");
      setFormData({ question: "", answer: "", order: 0 });
      queryClient.invalidateQueries({ queryKey: ["faqs-admin"] });
    },
    onError: (error) => {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to post FAQ",
        "error"
      );
    },
  });

  // Update FAQ mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await axiosSecure.patch(`/faqs/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Success", "FAQ updated successfully", "success");
      setFormData({ question: "", answer: "", order: 0 });
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ["faqs-admin"] });
    },
    onError: (error) => {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to update FAQ",
        "error"
      );
    },
  });

  // Delete FAQ mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/faqs/${id}`);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Success", "FAQ deleted successfully", "success");
      queryClient.invalidateQueries({ queryKey: ["faqs-admin"] });
    },
    onError: (error) => {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to delete FAQ",
        "error"
      );
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "order" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.question.trim() || !formData.answer.trim()) {
      Swal.fire("Validation", "Question and answer are required", "warning");
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

  const handleEdit = (faq) => {
    setFormData({
      question: faq.question,
      answer: faq.answer,
      order: faq.order || 0,
    });
    setEditingId(faq._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setFormData({ question: "", answer: "", order: 0 });
    setEditingId(null);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete FAQ?",
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
      <Section title={editingId ? "Edit FAQ" : "Post New FAQ"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Question</span>
            </label>
            <input
              type="text"
              name="question"
              value={formData.question}
              onChange={handleChange}
              placeholder="Enter FAQ question"
              className="input input-bordered"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Answer</span>
            </label>
            <textarea
              name="answer"
              value={formData.answer}
              onChange={handleChange}
              placeholder="Enter detailed answer"
              className="textarea textarea-bordered h-32"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Display Order</span>
            </label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              className="input input-bordered"
              min="0"
            />
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
                "Update FAQ"
              ) : (
                "Post FAQ"
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

      {/* FAQs List Section */}
      <Section title="FAQ List">
        {isLoading ? (
          <div className="text-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : !data || data.length === 0 ? (
          <div className="text-center py-8 text-base-content/60">
            No FAQs posted yet
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((faq) => (
              <div
                key={faq._id}
                className="card bg-base-100 shadow-md p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-base-content/70 text-sm">{faq.answer}</p>
                    <div className="flex gap-2 mt-3 text-xs text-base-content/50">
                      <span>Order: {faq.order}</span>
                      <span>•</span>
                      <span>
                        {new Date(faq.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => handleEdit(faq)}
                    className="btn btn-sm btn-outline btn-primary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(faq._id)}
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

export default PostFAQ;
