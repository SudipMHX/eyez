"use client";

import Modal from "@/components/ui/Modal";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const OrdersClient = () => {
  const [ordersData, setOrdersData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [open, setOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [limit, setLimit] = useState(10);

  const [search, setSearch] = useState("");
  const [searchBy, setSearchBy] = useState("orderId");

  const [isSaving, setIsSaving] = useState(false);
  const [productId, setProductId] = useState("");
  const [changeStatus, setChangeStatus] = useState({
    status: "",
    paymentStatus: "",
  });

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        search: search,
        searchBy: searchBy,
      });
      const response = await fetch(
        `/api/dashboard/orders?${queryParams.toString()}`
      );

      if (!response.ok) {
        const errData = await response.json();
        console.log(errData);
        throw new Error(errData.error || "Failed to fetch orders");
      }
      const data = await response.json();
      setOrdersData(data.orders);
      setTotalPages(data.pagination.totalPages);
      setTotalOrders(data.pagination.totalOrders);
    } catch (err) {
      setError(err.message);
      console.error("Fetch orders error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit, search, searchBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleOpenModal = async (id, status, paymentStatus) => {
    setOpen(true);
    setProductId(id);
    setChangeStatus({
      status: status,
      paymentStatus: paymentStatus,
    });
  };
  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const form = e.target;
    const productStatus = form.status.value;
    const paymentStatus = form.paymentStatus.value;

    const payload = {
      status: productStatus,
      paymentStatus: paymentStatus,
    };

    try {
      const res = await fetch(`/api/dashboard/orders/${productId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update order");
      }

      // Optionally, you can show a success message here
      await fetchProducts(); // Refresh the orders list
      setOpen(false); // Close modal
    } catch (error) {
      setError(error.message);
      console.error("Failed to update order:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = (orderId) => {
    if (orderId) {
      navigator.clipboard.writeText(orderId);
    }
  };
  return (
    <>
      <section className='p-4 md:p-6 lg:p-8'>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold text-gray-800'>Customer Orders</h1>
          <p className='text-gray-600'>Manage and view order details.</p>
        </div>

        <div className='mb-5'>
          <div className='grid grid-cols-3 sm:grid-cols-4 gap-4'>
            <div>
              <label className='text-sm text-gray-600' htmlFor='searchBy'>
                Search By :
              </label>
              <select
                id='searchBy'
                name='searchBy'
                onChangeCapture={(e) => setSearchBy(e.target.value)}
                className='w-full text-xs sm:text-base p-3 rounded-lg focus:ring-2 ring ring-blue-400 focus:ring-blue-500 outline-none'
                required>
                <option value='orderId'>Order Id</option>
                <option value='email'>E-mail</option>
                <option value='trxId'>Transaction ID</option>
              </select>
            </div>
            <div className='col-span-2 sm:col-span-3'>
              <label className='text-sm text-gray-600' htmlFor='search'>
                Search
              </label>
              <input
                type='text'
                id='search'
                onChangeCapture={(e) => setSearch(e.target.value)}
                name='search'
                placeholder='Type here...'
                className='p-3 text-xs sm:text-base rounded-lg ring ring-blue-400 focus:ring-2 focus:ring-blue-500 outline-none w-full'
                required
              />
            </div>
          </div>
        </div>

        <div className='bg-white shadow-md rounded-lg overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='min-w-full leading-normal'>
              <thead className='bg-gray-100 select-none'>
                <tr>
                  <th className='px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                    Order ID
                  </th>
                  <th className='px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                    Customer
                  </th>
                  <th className='px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                    Date
                  </th>
                  <th className='px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                    Total
                  </th>
                  <th className='px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                    Payment
                  </th>
                  <th className='px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white'>
                {isLoading ? (
                  <>
                    {Array.from({ length: 4 }).map((_, index) => (
                      <tr className='animate-pulse' key={index}>
                        <td className='p-5'>
                          <div className='h-4 bg-gray-300 rounded w-24'></div>
                        </td>
                        <td className='p-5'>
                          <div className='h-4 bg-gray-200 rounded w-32'></div>
                        </td>
                        <td className='p-5'>
                          <div className='h-4 bg-gray-300 rounded w-20'></div>
                        </td>
                        <td className='p-5'>
                          <div className='h-4 bg-gray-100 rounded w-28'></div>
                        </td>
                        <td className='p-5'>
                          <div className='h-4 bg-gray-300 rounded w-16'></div>
                        </td>
                        <td className='p-5'>
                          <div className='h-4 bg-gray-200 rounded w-20'></div>
                        </td>
                        <td className='p-5'>
                          <div className='h-4 bg-gray-100 rounded w-12'></div>
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  ordersData.map((order) => (
                    <tr
                      key={order._id}
                      className='hover:bg-gray-50 transition-colors duration-150'>
                      <td className='px-5 py-4 border-b border-gray-200 text-sm'>
                        <p
                          onClick={() => handleCopy(order._id)}
                          title='Click to copy'
                          className='text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium cursor-pointer underline underline-offset-2'>
                          {order._id.slice(-8)}
                        </p>
                      </td>
                      <td className='px-5 py-4 border-b border-gray-200 text-sm'>
                        <div>
                          <p className='text-gray-900 whitespace-no-wrap'>
                            {order?.userId?.name}
                          </p>
                          <p className='text-gray-600 whitespace-no-wrap text-xs'>
                            {order?.userId?.email}
                          </p>
                        </div>
                      </td>
                      <td className='px-5 py-4 border-b border-gray-200 text-sm'>
                        <p className='text-gray-900 whitespace-no-wrap'>
                          {new Date(order.createdAt).toLocaleString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                          <br />
                          {new Date(order.createdAt).toLocaleString("en-US", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })}
                        </p>
                      </td>
                      <td className='px-5 py-4 border-b border-gray-200 text-sm'>
                        <p className='text-gray-900 whitespace-no-wrap font-semibold'>
                          {order.totalAmount.toFixed(2)} Tk
                        </p>
                      </td>
                      <td className='px-5 py-4 border-b border-gray-200 text-sm select-none'>
                        <span
                          className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full
                            ${
                              order.status === "Delivered"
                                ? "text-green-900 bg-green-200"
                                : ""
                            }
                            ${
                              order.status === "Shipped"
                                ? "text-blue-900 bg-blue-200"
                                : ""
                            }
                            ${
                              order.status === "Processing"
                                ? "text-yellow-900 bg-yellow-200"
                                : ""
                            }
                            ${
                              order.status === "Pending Payment"
                                ? "text-orange-900 bg-orange-200"
                                : ""
                            }
                            ${
                              order.status === "Cancelled"
                                ? "text-red-900 bg-red-200"
                                : ""
                            }
                          `}>
                          <span className='relative'>{order.status}</span>
                        </span>
                      </td>
                      <td className='px-5 py-4 border-b border-gray-200 text-sm select-none'>
                        <span
                          className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full
                            ${
                              order?.paymentInfo?.status === "pending"
                                ? "text-green-900 bg-green-200"
                                : ""
                            }
                            ${
                              order?.paymentInfo?.status === "confirmed"
                                ? "text-blue-900 bg-blue-200"
                                : ""
                            }
                            ${
                              order?.paymentInfo?.status === "processing"
                                ? "text-yellow-900 bg-yellow-200"
                                : ""
                            }
                            ${
                              order?.paymentInfo?.status === "refunded"
                                ? "text-orange-900 bg-orange-200"
                                : ""
                            }
                            ${
                              order?.paymentInfo?.status === "failed" ||
                              order?.paymentInfo?.status === "cancelled"
                                ? "text-red-900 bg-red-200"
                                : ""
                            }
                          `}>
                          <span className='relative capitalize'>
                            {order?.paymentInfo?.status}
                          </span>
                        </span>
                      </td>
                      <td className='px-5 py-4 border-b border-gray-200 text-sm'>
                        {/* Replace with actual links or functions */}
                        <Link
                          href={`/dashboard/orders/${order._id}`}
                          className='text-indigo-600 hover:text-indigo-900 font-medium mr-3 cursor-pointer'>
                          Details
                        </Link>
                        <button
                          onClick={() => {
                            handleOpenModal(
                              order._id,
                              order?.status,
                              order?.paymentInfo?.status
                            );
                          }}
                          className='text-teal-600 hover:text-teal-900 font-medium cursor-pointer'>
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
                {!isLoading && ordersData.length === 0 && (
                  <>
                    <tr>
                      <td
                        colSpan='7'
                        className='px-5 py-10 border-b border-gray-200 text-center text-gray-500'>
                        No orders found.
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className='px-5 py-5 flex flex-col xs:flex-row items-center xs:justify-between'>
          <span className='text-xs xs:text-sm text-gray-900'>
            Showing {Math.min(currentPage * limit - limit + 1, totalOrders)} to{" "}
            {Math.min(currentPage * limit, totalOrders)} of {totalOrders}{" "}
            Entries
          </span>
          <div className='inline-flex mt-2 xs:mt-0'>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className='text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200'>
              Prev
            </button>
            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`text-sm font-semibold py-2 px-4 ${
                  currentPage === index + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-300 hover:bg-gray-400 text-gray-800"
                } transition-colors duration-200`}>
                {index + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className='text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200'>
              Next
            </button>
          </div>
        </div>

        {/* Pagination controls (optional) */}
      </section>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleUpdateInfo}>
          <div className=''>
            <label htmlFor='status'>Product Status:</label>
            <select
              className='w-full p-3 mt-2 rounded-lg focus:ring-2 ring ring-blue-400 focus:ring-blue-500 outline-none'
              name='status'
              defaultValue={changeStatus.status}
              id='status'>
              <option>Pending</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
              <option>Refunded</option>
            </select>
          </div>
          <div className='mt-2'>
            <label htmlFor='payment-status'>Payment Status:</label>
            <select
              className='w-full p-3 mt-2 rounded-lg focus:ring-2 ring ring-blue-400 focus:ring-blue-500 outline-none'
              name='paymentStatus'
              defaultValue={changeStatus.paymentStatus}
              id='payment-status'>
              <option value='pending'>Pending</option>
              <option value='confirmed'>Confirmed</option>
              <option value='failed'>Failed</option>
              <option value='cancelled'>Cancelled</option>
            </select>
          </div>
          <div className='flex justify-end mt-4'>
            <button
              type='submit'
              className='bg-green-500 text-white font-semibold px-5 py-2 rounded-lg hover:bg-green-600 transition-colors cursor-pointer flex items-center gap-3'>
              Update
              {isSaving && (
                <div className='w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin' />
              )}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default OrdersClient;
