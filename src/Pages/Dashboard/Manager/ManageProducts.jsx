import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Loading from "../../../Components/atoms/Loading";

const ManageProducts = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const {
    data: products = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["manager-products", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/products", {
        params: { createdBy: user.email },
      });
      // API returns an object: { products: [...], pagination: { ... } }
      // Ensure we return an array for react-query data so callers can use .filter
      const data = res?.data;
      if (Array.isArray(data)) return data;
      return data?.products || [];
    },
  });

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return products.filter(
      (p) =>
        p.productName?.toLowerCase().includes(term) ||
        p.category?.toLowerCase().includes(term)
    );
  }, [products, search]);

  const handleDelete = async (product) => {
    const confirm = await Swal.fire({
      title: `Delete ${product.productName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });
    if (!confirm.isConfirmed) return;
    await axiosSecure.delete(`/products/${product._id}`);
    Swal.fire("Deleted", "Product removed", "success");
    refetch();
  };

  const handleQuickUpdate = async (product) => {
    const { value: formValues } = await Swal.fire({
      title: "Update Product",
      html: `
        <input id="swal-name" class="input input-bordered w-full my-2" placeholder="Name" value="${product.productName || ""}" />
        <input id="swal-price" type="number" class="input input-bordered w-full my-2" placeholder="Price" value="${product.price || ""}" />
        <input id="swal-payment" class="input input-bordered w-full my-2" placeholder="Payment Mode" value="${product.paymentMode || ""}" />
      `,
      showCancelButton: true,
      focusConfirm: false,
      preConfirm: () => {
        return {
          productName: document.getElementById("swal-name").value,
          price: Number(document.getElementById("swal-price").value),
          paymentMode: document.getElementById("swal-payment").value,
        };
      },
    });

    if (!formValues) return;
    await axiosSecure.patch(`/products/${product._id}`, formValues);
    Swal.fire("Updated", "Product updated", "success");
    refetch();
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Manage Products</h2>
          <p className="text-sm text-gray-500">
            Products you created. Search, update, or delete.
          </p>
        </div>
        <input
          className="input input-bordered w-64"
          placeholder="Search name or category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-box shadow">
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Payment Mode</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
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
                <td>{product.paymentMode || product.paymentOptions}</td>
                <td className="flex justify-end gap-2">
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => handleQuickUpdate(product)}
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
            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-4">
                  No products match the search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProducts;

