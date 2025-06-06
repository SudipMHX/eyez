"use client";
import DashboardPrintableInvoice from "@/components/shared/DashboardPrintableInvoice";
import { CreditCard, Package, Truck, User } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import Image from "next/image";
import Link from "next/link";

const OrderDetailsClient = () => {
  const { id } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);

  const [status, setStatus] = useState("");

  const invoiceRef = useRef(null);

  const handlePrint = useReactToPrint({
    documentTitle: orderData?._id,
    contentRef: invoiceRef,
  });

  const fetchOrderData = useCallback(async () => {
    setIsLoading(true);
    setIsError(null);
    try {
      const response = await fetch(`/api/dashboard/orders/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch order data.");
      }
      const data = await response.json();
      setOrderData(data.order);
      setStatus(data.order?.status);
    } catch (error) {
      setIsError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchOrderData();
    }
  }, [fetchOrderData, id]);

  const handleStatusChange = async (newStatus) => {
    const previousStatus = status;
    setStatus(newStatus);

    try {
      const response = await fetch(`/api/dashboard/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("Failed to update status", error);
      setStatus(previousStatus);
    }
  };

  if (isLoading)
    return <div className='p-6 text-center'>Loading order details...</div>;
  if (isError)
    return <div className='p-6 text-center text-red-500'>Error: {isError}</div>;
  if (!orderData)
    return <div className='p-6 text-center'>No order data found.</div>;

  // Destructure orderData for cleaner code
  const {
    _id,
    items,
    orderDate,
    paymentInfo,
    shippingAddress,
    shippingFee,
    totalAmount,
    userId,
  } = orderData;

  const grandTotal = totalAmount + shippingFee;

  const getStatusColor = (currentStatus) => {
    switch (currentStatus) {
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <section className='p-4 md:p-6 bg-gray-50 min-h-screen'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6'>
          <div>
            <h1 className='text-2xl md:text-3xl font-bold text-gray-800'>
              Order #{_id.slice(-8)}
            </h1>
            <p className='text-sm text-gray-500'>
              Order placed on {new Date(orderDate).toLocaleDateString()}
            </p>
          </div>
          <div className='mt-4 md:mt-0 flex items-center gap-3'>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={`p-2 rounded-md text-sm font-medium border border-gray-200 cursor-pointer ${getStatusColor(
                status
              )}`}>
              <option value='Processing'>Processing</option>
              <option value='Shipped'>Shipped</option>
              <option value='Delivered'>Delivered</option>
              <option value='Cancelled'>Cancelled</option>
            </select>
            <button
              onClick={handlePrint}
              className='bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-blue-700 transition duration-300 cursor-pointer'>
              Print Invoice
            </button>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Left Column */}
          <div className='lg:col-span-2 space-y-6'>
            <div className='bg-white p-6 rounded-lg shadow'>
              <h2 className='text-xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
                <Package size={20} /> Order Items ({items?.length})
              </h2>
              <div className='space-y-4'>
                {items?.map((item, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between p-2 rounded-md hover:bg-gray-50'>
                    <div className='flex items-center gap-4'>
                      <div className='w-16 h-16 bg-gray-100 rounded-md overflow-hidden'>
                        <Image
                          src={
                            item.productId?.images[0]?.src || "/placeholder.jpg"
                          }
                          alt={item?.productId?.name}
                          width={100}
                          height={100}
                          className='object-cover w-full h-full'
                        />
                      </div>
                      <div>
                        <Link
                          target='_blank'
                          href={`/shop/${item?.productId?.slug}`}
                          className='font-semibold text-gray-800'>
                          {item?.productId?.name}
                        </Link>
                        <p className='text-sm text-gray-600'>
                          SKU: {item?.productId?.sku}
                        </p>
                        <p className='text-sm text-gray-500'>
                          {item?.variant.color}, {item?.variant?.size}
                        </p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <p className='font-semibold'>
                        {item?.totalPrice?.toFixed(2)} Tk
                      </p>
                      <p className='text-sm text-gray-600'>
                        {item?.quantity} x {item?.unitPrice?.toFixed(2)} Tk
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className='bg-white p-6 rounded-lg shadow'>
              <h2 className='text-xl font-bold text-gray-800 mb-4'>
                Payment Summary
              </h2>
              <div className='space-y-2 text-gray-600'>
                <div className='flex justify-between'>
                  <span>Subtotal</span>
                  <span className='font-medium'>
                    {totalAmount?.toFixed(2)} Tk
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span>Shipping Fee</span>
                  <span className='font-medium'>
                    {shippingFee?.toFixed(2)} Tk
                  </span>
                </div>
                <div className='flex justify-between text-lg font-bold text-gray-800 border-t pt-2 mt-2'>
                  <span>Grand Total</span>
                  <span>{grandTotal?.toFixed(2)} Tk</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className='space-y-6'>
            <div className='bg-white p-6 rounded-lg shadow'>
              <h2 className='text-xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
                <User size={20} /> Customer
              </h2>
              <div className='space-y-1'>
                <p className='font-semibold'>{userId?.name}</p>
                <p className='text-sm text-gray-600'>{userId?.email}</p>
              </div>
            </div>

            <div className='bg-white p-6 rounded-lg shadow'>
              <h2 className='text-xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
                <Truck size={20} /> Shipping Address
              </h2>
              <address className='space-y-1 text-sm text-gray-600 not-italic'>
                <p className='font-semibold'>{shippingAddress?.name}</p>
                <p>{shippingAddress?.address}</p>
                <p>
                  {shippingAddress?.city}, {shippingAddress?.zipcode}
                </p>
                <p>
                  {shippingAddress?.region}, {shippingAddress?.country}
                </p>
                <p>
                  <span className='font-medium'>Phone:</span>{" "}
                  {shippingAddress?.number}
                </p>
              </address>
            </div>

            <div className='bg-white p-6 rounded-lg shadow'>
              <h2 className='text-xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
                <CreditCard size={20} /> Payment Information
              </h2>
              <div className='space-y-2 text-sm text-gray-600'>
                <p>
                  <strong>Method:</strong> {paymentInfo?.method}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      paymentInfo?.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                    {paymentInfo?.status}
                  </span>
                </p>
                <p>
                  <strong>Trx ID:</strong> {paymentInfo?.trxId}
                </p>
                <p>
                  <strong>Amount:</strong> {paymentInfo?.amount?.toFixed(2)} Tk
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* This component is hidden and only used for printing */}
      <div style={{ display: "none" }}>
        <div ref={invoiceRef}>
          <DashboardPrintableInvoice order={orderData} />
        </div>
      </div>
    </>
  );
};

export default OrderDetailsClient;
