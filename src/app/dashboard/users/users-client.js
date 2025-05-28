"use client";

import { useEffect, useState } from "react";
import { Expand, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import ProfilePicture from "@/assets/freddie-marriage-iYQC9xWMvw4-unsplash.jpg";

const UsersClient = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchField, setSearchField] = useState("name");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [viewLimit, setViewLimit] = useState(20);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const handleLoadMore = () => {
    if (isFetchingMore || isLoading) return;

    setIsFetchingMore(true);
    setViewLimit((prev) => prev + viewLimit);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `/api/dashboard/users?search=${search}&field=${searchField}&role=${roleFilter}&limit=${viewLimit}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch users");
        }

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
        setIsFetchingMore(false);
      }
    };

    fetchUsers();
  }, [searchField, search, roleFilter, viewLimit]);

  return (
    <section className='font-mono'>
      <div className='bg-white shadow p-3 mb-4 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <div className='flex items-center w-full border border-gray-300 rounded-lg'>
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className='rounded-lg p-2'>
            <option value='name'>Name</option>
            <option value='email'>E-mail</option>
            <option value='phone_number'>Phone Number</option>
          </select>
          <input
            type='text'
            placeholder='Search by name, email, phone...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-full bg-gray-100 rounded-lg p-2'
          />
        </div>
        <div className='w-full md:w-2/5 flex items-start justify-end gap-3'>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className='p-2 border border-gray-300 rounded-lg'>
            <option value='all'>All Roles</option>
            <option value='admin'>Admin</option>
            <option value='manager'>Manager</option>
            <option value='user'>User</option>
          </select>
          <select
            value={viewLimit}
            onChange={(e) => setViewLimit(e.target.value)}
            className='p-2 border border-gray-300 rounded-lg'>
            <option value='20'>20</option>
            <option value='50'>50</option>
            <option value='75'>75</option>
            <option value='100'>100</option>
          </select>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='w-full overflow-hidden rounded-lg shadow-lg'>
        <div className='w-full overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='text-md font-semibold tracking-wide text-left text-gray-900 bg-white uppercase border-b border-gray-600'>
                <th className='px-4 py-3'>Name</th>
                <th className='px-4 py-3'>E-mail</th>
                <th className='px-4 py-3'>Role</th>
                <th className='px-4 py-3'>Status</th>
                <th className='px-4 py-3'>Date</th>
                <th className='px-4 py-3'>Actions</th>
              </tr>
            </thead>
            <tbody className='bg-white'>
              {isLoading ? (
                <>
                  {[...Array(6)].map((number, index) => (
                    <motion.tr
                      key={index}
                      layout
                      className='text-gray-700 border-b border-gray-200 transition-colors animate-pulse'>
                      {[...Array(6)].map((_, i) => (
                        <td key={i} className='bg-gray-200 p-2'>
                          <div className='bg-white animate-pulse h-6 p-2 rounded-full' />
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </>
              ) : (
                <>
                  {users.length > 0 ? (
                    users?.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        layout
                        className='text-gray-700 border-b border-gray-200 hover:bg-gray-50 transition-colors'>
                        <td className='px-4 py-3'>
                          <div className='flex items-center text-sm'>
                            <div className='relative w-8 h-8 mr-3 rounded-full'>
                              <Image
                                className='object-cover w-full h-full rounded-full'
                                src={ProfilePicture}
                                alt={user?.name}
                                width={56}
                                height={56}
                              />
                            </div>

                            <p className='font-semibold text-black'>
                              {user?.name}
                            </p>
                          </div>
                        </td>
                        <td className='px-4 py-3 text-ms font-semibold'>
                          {user?.email}
                        </td>
                        <td className='px-4 py-3 text-ms font-semibold'>
                          {user?.role}
                        </td>
                        <td className='px-4 py-3 text-xs'>
                          <span
                            className={`px-2 py-1 font-semibold leading-tight rounded-sm ${
                              user?.accountStatus === "active"
                                ? "text-white bg-green-500"
                                : "text-white bg-red-500"
                            }`}>
                            {user?.accountStatus}
                          </span>
                        </td>
                        <td className='px-4 py-3 text-sm'>
                          {new Date(user?.createdAt).toLocaleDateString(
                            "en-GB"
                          )}
                        </td>
                        <td className='px-4 py-3 text-sm'>
                          <Expand className='cursor-pointer' />
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className='text-center p-6 text-gray-500'>
                        No users found.
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={6}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </motion.div>
      <div className='flex justify-center pt-5'>
        <button
          onClick={handleLoadMore}
          disabled={isFetchingMore || isLoading}
          className='flex justify-center items-center gap-2 bg-green-500 text-white font-semibold px-4 py-1 rounded-full cursor-pointer'>
          {isFetchingMore || isLoading ? (
            <>
              Loading...
              <Loader2 className='animate-spin' />
            </>
          ) : (
            "Load More"
          )}
        </button>
      </div>
    </section>
  );
};

export default UsersClient;
