"use client";
import Modal from "@/components/ui/Modal";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const OrderHistoryClient = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  //   const modalToggle = setIsOpen(!isOpen);

  useEffect(() => {
    // This function fetches the order data from your API.
    const fetchOrders = async () => {
      try {
        // Set loading to true before starting the fetch
        setLoading(true);
        setError(null);

        const response = await fetch("/api/user/order");

        // Check if the request was successful
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Set the orders from the response
        if (data.success) {
          setOrders(data.orders);
        } else {
          throw new Error("Failed to fetch orders.");
        }
      } catch (e) {
        // If an error occurs, update the error state
        console.error("Fetch error:", e);
        setError(e.message);
      } finally {
        // Set loading to false after the fetch is complete
        setLoading(false);
      }
    };

    fetchOrders();
  }, []); // The empty dependency array ensures this effect runs only once on mount

  // Handle loading state
  if (loading) {
    return (
      <div className='p-8 text-center text-gray-500'>
        Loading your order history...
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className='p-8 text-center text-red-500 bg-red-100 rounded-lg'>
        Error: {error}
      </div>
    );
  }

  // Handle no orders found
  if (orders.length === 0) {
    return (
      <div className='p-8 text-center text-gray-500'>
        You haven&apos;t placed any orders yet.
      </div>
    );
  }

  return (
    <>
      <section className='bg-gray-50'>
        <div className='max-w-7xl mx-auto'>
          <h1 className='text-3xl font-bold text-gray-800 mb-6'>
            Your Order History
          </h1>
          <div className='bg-white shadow-md rounded-lg overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-100'>
                  <tr>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Order ID
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Date
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Status
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Total
                    </th>
                    <th scope='col' className='relative px-6 py-3'>
                      <span className='sr-only'>View</span>
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {orders.map((order) => (
                    <tr key={order._id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        #{order._id.slice(-6)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === "Processing"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "Shipped"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {order.paymentInfo.amount} {order.paymentInfo.currency}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                        <button
                          onClick={() => {
                            setSelectedOrder(order), setIsOpen(true);
                          }}
                          className='text-indigo-600 hover:text-indigo-900'>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Modal for viewing order details */}
      {selectedOrder && (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className=' max-h-[80vh] overflow-y-auto'>
            <div className='p-6 border-b border-gray-200 sticky top-0 bg-white z-10'>
              <div className='flex justify-between items-center'>
                <h2 className='text-2xl font-bold text-gray-800'>
                  Order Details
                </h2>
              </div>
              <p className='text-sm text-gray-500'>
                Order ID: {selectedOrder._id}
              </p>
            </div>

            <div className='p-6 space-y-6'>
              {/* Shipping & Payment Info */}
              <div className='grid md:grid-cols-2 gap-6'>
                <div className='bg-gray-50 p-4 rounded-lg'>
                  <h3 className='font-semibold text-lg text-gray-700 mb-2'>
                    Shipping Address
                  </h3>
                  <p className='text-gray-600'>
                    {selectedOrder.shippingAddress.name}
                  </p>
                  <p className='text-gray-600'>
                    {selectedOrder.shippingAddress.address},{" "}
                    {selectedOrder.shippingAddress.city}
                  </p>
                  <p className='text-gray-600'>
                    {selectedOrder.shippingAddress.country}
                  </p>
                  <p className='text-gray-600'>
                    Email: {selectedOrder.shippingAddress.email}
                  </p>
                </div>
                <div className='bg-gray-50 p-4 rounded-lg'>
                  <h3 className='font-semibold text-lg text-gray-700 mb-2'>
                    Payment Details
                  </h3>
                  <p className='text-gray-600'>
                    Method:{" "}
                    <span className='font-medium text-gray-800'>
                      {selectedOrder.paymentInfo.method}
                    </span>
                  </p>
                  <p className='text-gray-600'>
                    Status:{" "}
                    <span className='capitalize font-medium text-green-600'>
                      {selectedOrder.paymentInfo.status}
                    </span>
                  </p>
                  <p className='text-gray-600'>
                    Total Paid:{" "}
                    <span className='font-medium text-gray-800'>
                      {selectedOrder.paymentInfo.amount}{" "}
                      {selectedOrder.paymentInfo.currency}
                    </span>
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h3 className='font-semibold text-lg text-gray-700 mb-3'>
                  Items Ordered
                </h3>
                <div className='space-y-4'>
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className='flex items-center bg-white hover:bg-gray-100 p-3 rounded-lg'>
                      <Image
                        src={
                          item.productId.images[0]?.src ||
                          "https://placehold.co/100x100/F3F4F6/9CA3AF?text=Image"
                        }
                        width={100}
                        height={100}
                        alt={item.productId.images[0]?.alt || "Product Image"}
                        className='w-20 h-20 rounded-md object-cover mr-4'
                      />
                      <div className='flex-grow'>
                        <Link
                          href={`/shop/${item.productId.slug}`}
                          target='_blank'
                          className='font-semibold text-gray-800'>
                          {item.productId.name}
                        </Link>
                        <p className='text-sm text-gray-500'>
                          Brand: {item.productId.brand}
                        </p>
                        <p className='text-sm text-gray-500'>
                          Color: {item.variant.color}, Size: {item.variant.size}
                        </p>
                      </div>
                      <div className='text-right'>
                        <p className='font-semibold text-gray-800'>
                          {item.totalPrice} {selectedOrder.paymentInfo.currency}
                        </p>
                        <p className='text-sm text-gray-500'>
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default OrderHistoryClient;
