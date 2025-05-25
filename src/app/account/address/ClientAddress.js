"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { SpinnerLoader } from "@/components/ui/LoadingAnimations";

const ClientAddress = () => {
  const { data: session, status } = useSession();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressData, setAddressData] = useState({});

  const [isLoading, setIsLoading] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.target;

    const name = form.name.value;
    const email = form.email.value;
    const number = form.number.value;
    const address = form.address.value;
    const city = form.city.value;
    const zipcode = form.zipcode.value;
    const region = form.region.value;
    const country = form.country.value;
    const _id = addressData?._id;

    const formData = {
      userId: session?.user?.id,
      name,
      email,
      number,
      address,
      city,
      zipcode,
      region,
      country,
      ...(!!_id && { _id }),
    };

    const method = _id ? "PUT" : "POST";

    try {
      const res = await fetch("/api/address", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.success) {
        Swal.fire({
          title: _id ? "Address Updated!" : "Address Saved!",
          timer: 1500,
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: result.error || "Something went wrong",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Request Failed",
        text: error.message,
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    const fetchAddress = async () => {
      if (status === "authenticated" && session?.user?.id) {
        try {
          const res = await fetch(`/api/address?userId=${session.user.id}`);
          const data = await res.json();
          setIsLoading(false);
          setAddressData(data?.data);
        } catch (err) {
          setIsLoading(false);
          console.error("Failed to fetch address:", err);
        }
      }
    };

    fetchAddress();
  }, [status, session?.user?.id]);

  return (
    <section>
      {isLoading ? (
        <>
          <SpinnerLoader />
        </>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <motion.div variants={itemVariants}>
              <h2 className='text-xl font-semibold mb-4 text-gray-800'>
                Shipping Address
              </h2>
              <div className='space-y-4'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <label className='text-xs text-gray-600' htmlFor='name'>
                      Full Name
                    </label>
                    <input
                      type='text'
                      id='name'
                      name='name'
                      defaultValue={addressData?.name || session?.user?.name}
                      placeholder='Full Name'
                      className='w-full p-3 rounded-lg focus:ring-2 ring ring-blue-400 focus:ring-blue-500 outline-none'
                      required
                    />
                  </div>
                  <div>
                    <label className='text-xs text-gray-600' htmlFor='email'>
                      E-mail Address
                    </label>
                    <input
                      type='email'
                      id='email'
                      name='email'
                      defaultValue={addressData?.email || session?.user?.email}
                      placeholder='E-mail Address'
                      className='w-full p-3 rounded-lg focus:ring-2 ring ring-blue-400 focus:ring-blue-500 outline-none'
                      required
                    />
                  </div>
                  <div>
                    <label className='text-xs text-gray-600' htmlFor='number'>
                      Phone Number
                    </label>
                    <input
                      type='number'
                      id='number'
                      name='number'
                      defaultValue={addressData?.number}
                      placeholder='Phone Number'
                      className='w-full p-3 rounded-lg focus:ring-2 ring ring-blue-400 focus:ring-blue-500 outline-none'
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className='text-xs text-gray-600' htmlFor='address'>
                    Street Address
                  </label>
                  <input
                    type='text'
                    id='address'
                    name='address'
                    defaultValue={addressData?.address}
                    placeholder='Street Address'
                    className='w-full p-3 rounded-lg focus:ring-2 ring ring-blue-400 focus:ring-blue-500 outline-none'
                    required
                  />
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <label className='text-xs text-gray-600' htmlFor='city'>
                      City
                    </label>
                    <input
                      type='text'
                      id='city'
                      name='city'
                      defaultValue={addressData?.city}
                      placeholder='City'
                      className='p-3 rounded-lg ring ring-blue-400 focus:ring-2 focus:ring-blue-500 outline-none w-full'
                      required
                    />
                  </div>
                  <div>
                    <label className='text-xs text-gray-600' htmlFor='zipcode'>
                      Postal Code
                    </label>
                    <input
                      type='text'
                      id='zipcode'
                      defaultValue={addressData?.zipcode}
                      name='zipcode'
                      placeholder='Postal Code'
                      className='p-3 rounded-lg ring ring-blue-400 focus:ring-2 focus:ring-blue-500 outline-none w-full'
                      required
                    />
                  </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <label className='text-xs text-gray-600' htmlFor='region'>
                      Province / Region
                    </label>
                    <select
                      id='region'
                      name='region'
                      defaultValue={addressData?.region || "none"}
                      className='w-full p-3 rounded-lg focus:ring-2 ring ring-blue-400 focus:ring-blue-500 outline-none'
                      required>
                      <option disabled value='none'>
                        Province / Region
                      </option>
                      <option>Dhaka</option>
                      <option>Chittagong</option>
                      <option>Rajshahi</option>
                      <option>Sylhet</option>
                      <option>Mymensingh</option>
                      <option>Rangpur</option>
                      <option>Khulna</option>
                      <option>Barisal</option>
                    </select>
                  </div>
                  <div>
                    <label className='text-xs text-gray-600' htmlFor='country'>
                      Country
                    </label>
                    <select
                      id='country'
                      defaultValue={addressData?.country || "Bangladesh"}
                      className='w-full p-3 rounded-lg focus:ring-2 ring ring-blue-400 focus:ring-blue-500 outline-none'
                      required>
                      <option disabled>Select Country</option>
                      <option>Bangladesh</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className='flex justify-end mt-4'>
                <button
                  type='submit'
                  className='bg-green-500 text-white font-semibold px-5 py-2 rounded-lg hover:bg-green-600 transition-colors cursor-pointer flex items-center gap-3'>
                  {addressData ? "Update" : "Save"}
                  {isSubmitting && (
                    <div className='w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin' />
                  )}
                </button>
              </div>
            </motion.div>
          </form>
        </>
      )}
    </section>
  );
};

export default ClientAddress;
