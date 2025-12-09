import { useQuery } from "@tanstack/react-query";
import React from "react";
import Swal from "sweetalert2";
import Loading from "../../../Components/atoms/Loading";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AdminProducts = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: products = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const res = await axiosSecure.get("/products");
      return res.data || [];
    },
  });

  const handleToggleHome = async (product) => {
    await axiosSecure.patch(`/products/${product._id}`, {
      showOnHome: !product.showOnHome,
    });
    Swal.fire("Updated", "Home page visibility updated.", "success");
    refetch();
  };

  const handleDelete = async (product) => {
    const confirm = await Swal.fire({
      title: `Delete ${product.productName}?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });
    if (!confirm.isConfirmed) return;

    await axiosSecure.delete(`/products/${product._id}`);
    Swal.fire("Deleted", "Product removed successfully.", "success");
    refetch();
  };

  const handleEdit = async (product) => {
    const { value: formValues } = await Swal.fire({
      title: "Update Product",
      html: `
        <input id="swal-name" class="input input-bordered w-full my-2" placeholder="Name" value="${
          product.productName || ""
        }" />
        <input id="swal-price" type="number" class="input input-bordered w-full my-2" placeholder="Price" value="${
          product.price || ""
        }" />
        <input id="swal-category" class="input input-bordered w-full my-2" placeholder="Category" value="${
          product.category || ""
        }" />
        <input id="swal-image" class="input input-bordered w-full my-2" placeholder="Image URL" value="${
          product.productImage || ""
        }" />
      `,
    showCancelButton: true,
    focusConfirm: false,
    preConfirm: () => {
        const name = document.getElementById("swal-name").value;
        const price = Number(document.getElementById("swal-price").value);
        const category = document.getElementById("swal-category").value;
        const productImage = document.getElementById("swal-image").value;
        return { productName: name, price, category, productImage };
      },
    });

    if (!formValues) return;

    await axiosSecure.patch(`/products/${product._id}`, formValues);
    Swal.fire("Saved", "Product information updated.", "success");
    refetch();
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">All Products</h2>
          <p className="text-sm text-gray-500">
            Manage product info and home page visibility.
          </p>
        </div>
        <div className="badge badge-info badge-outline">
          Total: {products.length}
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-box shadow">
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Created By</th>
              <th>Show on Home</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                      <img
                        src={
                          product.productImage ||
                          "https://via.placeholder.com/150"
                        }
                        alt={product.productName}
                      />
                    </div>
                  </div>
                </td>
                <td className="font-semibold">{product.productName}</td>
                <td className="text-blue-600 font-bold">৳{product.price}</td>
                <td>{product.category}</td>
                <td>{product.createdBy || product.sellerEmail || "N/A"}</td>
                <td>
                  <input
                    type="checkbox"
                    className="toggle toggle-success"
                    checked={product.showOnHome || false}
                    onChange={() => handleToggleHome(product)}
                  />
                </td>
                <td className="flex justify-end gap-2">
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => handleEdit(product)}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleDelete(product)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 py-4">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;

