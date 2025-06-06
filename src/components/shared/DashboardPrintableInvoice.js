"use client";
import React from "react";
import Barcode from "react-barcode";

const DashboardPrintableInvoice = ({ order }) => {
  if (!order) {
    return null;
  }

  const {
    _id,
    items,
    orderDate,
    paymentInfo,
    shippingAddress,
    shippingFee,
    totalAmount,
    userId,
  } = order;

  const grandTotal = totalAmount + shippingFee;

  return (
    <div className='p-8 font-sans text-gray-800 bg-white'>
      {/* Header */}
      <header className='flex justify-between items-center pb-6 border-b-2 border-gray-200'>
        <div>
          <h2 className='text-3xl font-bold text-gray-900'>INVOICE</h2>
          <p className='text-sm'>Invoice #: {_id}</p>
        </div>
        <div className='text-right'>
          <h2 className='text-2xl font-semibold'>EYEZ</h2>
          <p className='text-sm'>123 Street, City, Country</p>
          <p className='text-sm'>sudipmhx@gmail.com</p>
        </div>
      </header>

      {/* Customer and Order Details */}
      <section className='grid grid-cols-2 gap-8 mt-6'>
        <div>
          <h3 className='text-lg font-semibold mb-2'>Bill To:</h3>
          <address className='not-italic text-sm'>
            <p className='font-bold'>{shippingAddress.name}</p>
            <p>{shippingAddress.address}</p>
            <p>
              {shippingAddress.city}, {shippingAddress.zipcode}
            </p>
            <p>{shippingAddress.country}</p>
            <p>Email: {userId.email}</p>
            <p>Phone: {shippingAddress.number}</p>
          </address>
        </div>
        <div className='text-right'>
          <p>
            <strong>Order Date:</strong>{" "}
            {new Date(orderDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Payment Method:</strong> {paymentInfo.method}
          </p>
          <p>
            <strong>Transaction ID:</strong> {paymentInfo.trxId}
          </p>
        </div>
      </section>

      {/* Items Table */}
      <section className='mt-8'>
        <table className='w-full text-left'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='p-3 text-sm font-semibold'>Product</th>
              <th className='p-3 text-sm font-semibold text-center'>
                Quantity
              </th>
              <th className='p-3 text-sm font-semibold text-right'>
                Unit Price
              </th>
              <th className='p-3 text-sm font-semibold text-right'>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className='border-b border-gray-100'>
                <td className='p-3'>
                  <p className='font-medium'>{item.productId.name}</p>
                  <p className='text-xs text-gray-500'>
                    {item.variant.color}, {item.variant.size}
                  </p>
                </td>
                <td className='p-3 text-center'>{item.quantity}</td>
                <td className='p-3 text-right'>
                  {item.unitPrice.toFixed(2)} Tk
                </td>
                <td className='p-3 text-right font-medium'>
                  {item.totalPrice.toFixed(2)} Tk
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Totals */}
      <section className='flex justify-end mt-6'>
        <div className='w-full max-w-xs space-y-2'>
          <div className='flex justify-between text-sm'>
            <span className='text-gray-600'>Subtotal:</span>
            <span className='font-medium'>{totalAmount.toFixed(2)} Tk</span>
          </div>
          <div className='flex justify-between text-sm'>
            <span className='text-gray-600'>Shipping Fee:</span>
            <span className='font-medium'>{shippingFee.toFixed(2)} Tk</span>
          </div>
          <div className='flex justify-between text-lg font-bold pt-2 border-t mt-2'>
            <span>Grand Total:</span>
            <span>{grandTotal.toFixed(2)} Tk</span>
          </div>
        </div>
      </section>

      <section className='flex justify-center mt-4'>
        <Barcode value={order._id} width={1} height={40} fontSize={16} />
      </section>

      {/* Footer */}
      <footer className='mt-12 pt-6 border-t-2 border-gray-200 text-center text-sm text-gray-500'>
        <p>Thank you for your purchase!</p>
      </footer>
    </div>
  );
};

DashboardPrintableInvoice.displayName = "DashboardPrintableInvoice";

export default DashboardPrintableInvoice;
