import React, { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const categories = ["Shirt", "Pant", "Jacket", "Accessories"];
const paymentModes = ["Cash on Delivery", "PayFirst"];

const ManagerAddProduct = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [form, setForm] = useState({
    productName: "",
    productDescription: "",
    category: "",
    price: "",
    availableQuantity: "",
    minimumOrder: "",
    demoVideo: "",
    paymentMode: paymentModes[0],
    showOnHome: false,
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
    const readers = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target.result);
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then(setPreviews);
  };

  const validate = () => {
    if (!form.productName || !form.productDescription || !form.category) return false;
    if (!form.price || Number(form.price) <= 0) return false;
    if (!form.availableQuantity || Number(form.availableQuantity) <= 0) return false;
    if (!form.minimumOrder || Number(form.minimumOrder) <= 0) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      Swal.fire("Validation", "Please fill all required fields correctly.", "warning");
      return;
    }

    try {
      setSubmitting(true);
      const imageData = await Promise.all(
        images.map(
          (file) =>
            new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = (ev) => resolve(ev.target.result);
              reader.readAsDataURL(file);
            })
        )
      );

      const payload = {
        ...form,
        price: Number(form.price),
        availableQuantity: Number(form.availableQuantity),
        minimumOrder: Number(form.minimumOrder),
        productImage: imageData[0] || "",
        gallery: imageData,
        createdBy: user?.email,
      };

      await axiosSecure.post("/products", payload);
      Swal.fire("Success", "Product created successfully", "success");
      setForm({
        productName: "",
        productDescription: "",
        category: "",
        price: "",
        availableQuantity: "",
        minimumOrder: "",
        demoVideo: "",
        paymentMode: paymentModes[0],
        showOnHome: false,
      });
      setImages([]);
      setPreviews([]);
    } catch (err) {
      Swal.fire("Error", "Failed to create product", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold">Add Product</h2>
        <p className="text-sm text-gray-500">
          Managers can add new products with details and media.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Product Name*</label>
            <input
              className="input input-bordered w-full"
              value={form.productName}
              onChange={(e) => updateField("productName", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Category*</label>
            <select
              className="select select-bordered w-full"
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
              required
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Price*</label>
            <input
              type="number"
              className="input input-bordered w-full"
              value={form.price}
              onChange={(e) => updateField("price", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Available Quantity*</label>
            <input
              type="number"
              className="input input-bordered w-full"
              value={form.availableQuantity}
              onChange={(e) => updateField("availableQuantity", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Minimum Order Quantity*</label>
            <input
              type="number"
              className="input input-bordered w-full"
              value={form.minimumOrder}
              onChange={(e) => updateField("minimumOrder", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Payment Option*</label>
            <select
              className="select select-bordered w-full"
              value={form.paymentMode}
              onChange={(e) => updateField("paymentMode", e.target.value)}
            >
              {paymentModes.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Demo Video Link</label>
            <input
              className="input input-bordered w-full"
              value={form.demoVideo}
              onChange={(e) => updateField("demoVideo", e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              className="toggle toggle-success"
              checked={form.showOnHome}
              onChange={(e) => updateField("showOnHome", e.target.checked)}
            />
            <span>Show on Home Page</span>
          </div>
        </div>

        <div>
          <label className="label">Product Description*</label>
          <textarea
            className="textarea textarea-bordered w-full"
            rows={4}
            value={form.productDescription}
            onChange={(e) => updateField("productDescription", e.target.value)}
            required
          ></textarea>
        </div>

        <div>
          <label className="label">Images (multiple)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            className="file-input file-input-bordered w-full"
            onChange={handleImages}
          />
          {previews.length > 0 && (
            <div className="flex gap-3 flex-wrap mt-3">
              {previews.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt="preview"
                  className="w-24 h-24 object-cover rounded border"
                />
              ))}
            </div>
          )}
        </div>

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default ManagerAddProduct;

