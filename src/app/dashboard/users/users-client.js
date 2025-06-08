"use client";

import { useCallback, useEffect, useState } from "react";
import { Expand, Eye, Loader2, Mail, UserRound } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import ProfilePicture from "@/assets/freddie-marriage-iYQC9xWMvw4-unsplash.jpg";
import Modal from "@/components/ui/Modal";
import Swal from "sweetalert2";

const UsersClient = () => {
  const [users, setUsers] = useState([]);
  const [loadMore, setLoadMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const [searchField, setSearchField] = useState("name");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [viewLimit, setViewLimit] = useState(20);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    role: "",
    accountStatus: "",
  });

  const handleOpenModal = async (id) => {
    setOpen(true);
    setSelectedUserId(id);

    try {
      const res = await fetch(`/api/dashboard/users/${id}`);
      const data = await res.json();
      setUserData({
        name: data?.user?.name,
        email: data?.user?.email,
        role: data?.user?.role,
        accountStatus: data?.user?.accountStatus,
      });
    } catch (error) {
      console.error("Failed to load user:", error);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/dashboard/users/${selectedUserId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: userData.role,
          accountStatus: userData.accountStatus,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      await fetchUsers();

      Swal.fire({
        title: "User updated successfully",
        timer: 1500,
        icon: "success",
        showConfirmButton: false,
      });
      setOpen(false);
    } catch (err) {
      Swal.fire({
        title: "Error updating user:",
        text: err.message,
        timer: 1500,
        icon: "error",
        showConfirmButton: false,
      });
    }
  };

  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the user.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`/api/dashboard/users/${selectedUserId}`, {
        method: "DELETE",
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      await fetchUsers();
      await Swal.fire({
        title: "Deleted!",
        text: "User has been deleted.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      setOpen(false);
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: err.message || "Failed to delete user.",
        icon: "error",
      });
    }
  };

  const handleLoadMore = () => {
    if (isFetchingMore || isLoading) return;

    setIsFetchingMore(true);
    setViewLimit((prev) => prev + viewLimit);
  };

  const fetchUsers = useCallback(async () => {
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
      setUsers(data.users);
      setLoadMore(data.loadMore);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  }, [search, searchField, roleFilter, viewLimit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <>
      <section>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold text-gray-800'>Manage All User</h1>
          {/* <p className='text-gray-600'>Manage user</p> */}
        </div>

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
            <table className='w-full font-sans'>
              <thead className='bg-gray-100'>
                <tr>
                  <th className='w-1/5 px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider'>
                    Name
                  </th>
                  <th className='w-1/4 px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider'>
                    E-mail
                  </th>
                  <th className='w-32 px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider'>
                    Role
                  </th>
                  <th className='w-32 px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='w-32 px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider'>
                    Date
                  </th>
                  <th className='w-20 px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white'>
                {isLoading ? (
                  <>
                    {[...Array(6)].map((number, index) => (
                      <motion.tr key={index} layout className='animate-pulse'>
                        {[...Array(6)].map((_, i) => (
                          <td key={i} className='p-5'>
                            <div className='h-4 bg-gray-300 rounded w-full'></div>
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
                          <td className='px-4 py-3 text-sm flex justify-center'>
                            <Expand
                              onClick={() => handleOpenModal(user._id)}
                              className='cursor-pointer'
                            />
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className='text-center p-6 text-gray-500'>
                          No users found.
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
        <div className='flex justify-center pt-5'>
          {loadMore && (
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
          )}
        </div>
      </section>

      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <div className='flex flex-col items-center gap-2'>
          <Image
            className='object-cover rounded-full w-16 h-16'
            src={ProfilePicture}
            width={156}
            height={156}
            alt=''
          />
          <h2 className='text-center text-xl font-semibold mb-2'>
            {userData?.name}
          </h2>
        </div>
        <div>
          <label
            htmlFor='email'
            className='block text-sm font-medium text-gray-700 mb-1'>
            User E-mail
          </label>
          <div className='relative'>
            <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
            <input
              type='email'
              id='email'
              value={userData.email}
              className='w-full pl-10 pr-3 py-3 rounded-lg ring ring-blue-400 focus:ring-2 focus:ring-blue-500 outline-none'
              disabled
            />
          </div>
        </div>
        <div className='grid sm:grid-cols-2 gap-2 sm:gap-5 my-3'>
          <div>
            <label
              htmlFor='user_role'
              className='block text-sm font-medium text-gray-700 mb-1'>
              Role
            </label>
            <div className='relative'>
              <UserRound className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
              <select
                id='user_role'
                value={userData.role}
                onChange={(e) =>
                  setUserData({ ...userData, role: e.target.value })
                }
                className='w-full pl-10 pr-3 py-3 rounded-lg ring ring-blue-400 focus:ring-2 focus:ring-blue-500 outline-none'>
                <option value='admin'>Admin</option>
                <option value='manager'>Manager</option>
                <option value='user'>User</option>
              </select>
            </div>
          </div>
          <div>
            <label
              htmlFor='active_status'
              className='block text-sm font-medium text-gray-700 mb-1'>
              Status
            </label>
            <div className='relative'>
              <Eye className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
              <select
                id='active_status'
                value={userData.accountStatus}
                onChange={(e) =>
                  setUserData({ ...userData, accountStatus: e.target.value })
                }
                className='w-full pl-10 pr-3 py-3 rounded-lg ring ring-blue-400 focus:ring-2 focus:ring-blue-500 outline-none'>
                <option value='active'>Active</option>
                <option value='suspended'>Suspended</option>
                <option value='deleted'>Deleted</option>
              </select>
            </div>
          </div>
        </div>
        <div className='flex justify-end gap-2'>
          <button
            onClick={handleDelete}
            className='bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow cursor-pointer'>
            Delete Account
          </button>
          <button
            onClick={handleSave}
            className='bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow cursor-pointer'>
            Save
          </button>
        </div>
      </Modal>
    </>
  );
};

export default UsersClient;
