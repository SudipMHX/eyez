"use client";

import { BarsLoader } from "@/components/ui/LoadingAnimations";
import { ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const statusColors = {
  pending: "bg-yellow-200 text-yellow-800",
  confirmed: "bg-green-200 text-green-800",
  processing: "bg-blue-200 text-blue-800",
  failed: "bg-red-200 text-red-800",
  cancelled: "bg-gray-200 text-gray-800",
  refunded: "bg-purple-200 text-purple-800",
};

const TransactionsClient = () => {
  const [transactionsData, setTransactionsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);

  // --- pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [limit, setLimit] = useState(10);

  // --- searching ---
  const [trxId, setTrxId] = useState("");
  const [email, setEmail] = useState("");
  const [orderId, setOrderId] = useState("");
  const [method, setMethod] = useState("");

  const fetchTransactionsData = useCallback(async () => {
    setIsLoading(true);
    setIsError(null);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        trxId: trxId,
        email: email,
        orderId: orderId,
        method: method,
      });
      const response = await fetch(
        `/api/dashboard/transactions?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error(`An error occurred: ${response.statusText}`);
      }

      const data = await response.json();

      setTransactionsData(
        Array.isArray(data.transactions) ? data.transactions : []
      );
      setTotalPages(data.pagination.totalPages || 1);
      setTotalTransactions(data.pagination.totalTransactions || 0);
    } catch (error) {
      setIsError(error.message);
      setTransactionsData([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit, trxId, email, orderId, method]);

  useEffect(() => {
    fetchTransactionsData();
  }, [fetchTransactionsData]);

  const handleUpdateStatus = async (transactionId, newStatus) => {
    setTransactionsData((prevData) =>
      prevData.map((trx) =>
        trx._id === transactionId ? { ...trx, status: newStatus } : trx
      )
    );
    try {
      const response = await fetch(
        `/api/dashboard/transactions/${transactionId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (!response.ok) throw new Error("Status update failed on the server.");
    } catch (error) {
      console.error("Error updating status:", error);
      fetchTransactionsData();
    }
  };

  return (
    <section>
      <h1 className='text-3xl font-bold text-gray-800 mb-2'>Transactions</h1>
      <p className='text-gray-600 mb-6'>
        View and manage all user payments, search by email, transaction ID,
        order ID, and more.
      </p>

      <div className='mb-6 bg-white p-4 rounded-lg shadow-sm'>
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end'>
          <input
            type='text'
            defaultValue={trxId}
            onChange={(e) => setTrxId(e.target.value)}
            placeholder='Transaction ID'
            className='w-full p-3 rounded-lg ring ring-blue-400 focus:ring-2 focus:ring-blue-500 outline-none'
          />
          <input
            type='email'
            defaultValue={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='User Email'
            className='w-full p-3 rounded-lg ring ring-blue-400 focus:ring-2 focus:ring-blue-500 outline-none'
          />
          <input
            type='text'
            defaultValue={orderId}
            onChangeCapture={(e) => setOrderId(e.target.value)}
            placeholder='Order ID'
            className='w-full p-3 rounded-lg ring ring-blue-400 focus:ring-2 focus:ring-blue-500 outline-none'
          />
          <select
            defaultValue={""}
            onChange={(e) => setMethod(e.target.value)}
            placeholder='Payment Method'
            className='w-full p-3 rounded-lg ring ring-blue-400 focus:ring-2 focus:ring-blue-500 outline-none'>
            <option value=''>All</option>
            <option value='bKash'>bKash</option>
            <option value='Nagad'>Nagad</option>
            <option value='Rocket'>Rocket</option>
            <option value='CashOnDelivery'>CashOnDelivery</option>
          </select>
        </div>
      </div>

      <div className='bg-white rounded-lg shadow-md overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200 font-sans'>
            <thead className='bg-gray-100'>
              <tr>
                <th className='w-1/4 px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider'>
                  User
                </th>
                <th className='w-40 px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider'>
                  Amount
                </th>
                <th className='w-32 px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider'>
                  Method
                </th>
                <th className='w-48 px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider'>
                  Trx ID
                </th>
                <th className='w-32 px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider'>
                  Date
                </th>
                <th className='w-40 px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider'>
                  Status
                </th>
                <th className='w-20 px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider'>
                  Order Details
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {isLoading ? (
                <>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <tr className='animate-pulse' key={index}>
                      <td className='p-5 w-1/4'>
                        <div className='h-4 bg-gray-300 rounded'></div>
                      </td>
                      <td className='p-5 w-40'>
                        <div className='h-4 bg-gray-200 rounded'></div>
                      </td>
                      <td className='p-5 w-32'>
                        <div className='h-4 bg-gray-300 rounded'></div>
                      </td>
                      <td className='p-5 w-48'>
                        <div className='h-4 bg-gray-100 rounded'></div>
                      </td>
                      <td className='p-5 w-32'>
                        <div className='h-4 bg-gray-300 rounded'></div>
                      </td>
                      <td className='p-5 w-40'>
                        <div className='h-4 bg-gray-200 rounded'></div>
                      </td>
                      <td className='p-5 w-20'>
                        <div className='h-4 bg-gray-100 rounded'></div>
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                transactionsData?.map((trx) => (
                  <tr key={trx._id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap w-1/4'>
                      <div className='text-sm font-medium text-gray-900 truncate'>
                        {trx.userId?.name || "N/A"}
                      </div>
                      <div className='text-sm text-gray-500 truncate'>
                        {trx.userId?.email || "N/A"}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap font-semibold w-40'>
                      {trx.amount} {trx.currency}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm w-32'>
                      {trx.method}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-mono w-48'>
                      {trx?.trxId}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm w-32'>
                      {new Date(trx.paymentDate).toLocaleDateString()}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap w-40'>
                      <select
                        value={trx.status}
                        onChange={(e) =>
                          handleUpdateStatus(trx._id, e.target.value)
                        }
                        className={`text-sm font-semibold rounded-full px-3 py-1 border-0 ${
                          statusColors[trx.status] || "bg-gray-200"
                        }`}>
                        <option value='pending'>Pending</option>
                        <option value='confirmed'>Confirmed</option>
                        <option value='processing'>Processing</option>
                        <option value='failed'>Failed</option>
                        <option value='cancelled'>Cancelled</option>
                        <option value='refunded'>Refunded</option>
                      </select>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm w-20 flex justify-end'>
                      <Link href={`/dashboard/orders/${trx?.orderId}`}>
                        <ExternalLink size={18} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
              {/* {isLoading ? (
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
                transactionsData?.map((trx) => (
                  <tr key={trx._id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900'>
                        {trx.userId?.name || "N/A"}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {trx.userId?.email || "N/A"}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap font-semibold'>
                      {trx.amount} {trx.currency}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm'>
                      {trx.method}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-mono'>
                      {trx?.trxId}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm'>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'></td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm'></td>
                  </tr>
                ))
              )} */}

              {!isLoading && transactionsData.length === 0 && (
                <>
                  <tr>
                    <td
                      colSpan='7'
                      className='px-5 py-10 border-b border-gray-200 text-center text-gray-500'>
                      No transactions found.
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        <div className='px-6 py-4 border-t border-gray-200 flex items-center justify-between'>
          <p className='text-sm text-gray-700'>
            Page <span className='font-medium'>{currentPage}</span> of{" "}
            <span className='font-medium'>{totalPages}</span>
          </p>
          <div className='flex gap-2'>
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage <= 1 || isLoading}
              className='px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400'>
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage >= totalPages || isLoading}
              className='px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400'>
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransactionsClient;
