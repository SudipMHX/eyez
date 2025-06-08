// ClientCheckout.jsx
"use client";

import { useCart } from "@/hooks/useCart";
import { motion } from "framer-motion";
import {
  Lock,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  CreditCard,
  Wallet,
  HandCoins,
  Smartphone,
  ArrowLeftRight,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

// Mock ObjectId generator for frontend testing if needed
const newObjectId = () =>
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 6);

const ClientCheckout = () => {
  const { data: session, status: sessionStatus } = useSession();
  const [addressData, setAddressData] = useState({});
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(true);

  const [selectedMethod, setSelectedMethod] = useState(null);
  const isCardDisabled = true;

  const { cartItems, removeFromCart, clearCart } = useCart();

  const [shippingCost, setShippingCost] = useState(120);

  const calculateSubtotal = () =>
    cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const calculateTotalAmount = () => calculateSubtotal();

  const handleMethodSelect = (method) => {
    if (method === "card" && isCardDisabled) {
      return;
    }
    setSelectedMethod(method);
  };

  useEffect(() => {
    const fetchAddress = async () => {
      if (sessionStatus === "loading" || !session?.user?.id) {
        setIsLoadingAddress(false);
        if (sessionStatus !== "loading") setAddressData({}); // Clear if logged out or no session
        return;
      }

      setIsLoadingAddress(true);
      try {
        const res = await fetch(`/api/user/address`);
        const result = await res.json(); // Ensure this line is present
        if (result.success && result.data) {
          setAddressData(result.data);
        } else {
          setAddressData({}); // Set to empty if no address found or error
        }
      } catch (err) {
        console.error("Error fetching address:", err);
        setAddressData({});
      } finally {
        setIsLoadingAddress(false);
      }
    };

    fetchAddress();
  }, [session?.user?.id, sessionStatus]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const number = form.number.value;
    const address = form.address.value;
    const city = form.city.value;
    const zipcode = form.zipcode.value;
    const region = form.region.value;
    const country = form.country.value;

    if (!session?.user?.id) {
      Swal.fire(
        "Login Required",
        "Please log in to place an order.",
        "warning"
      );
      return;
    }
    if (!selectedMethod) {
      Swal.fire(
        "Payment Method Required",
        "Please select a payment method.",
        "warning"
      );
      return;
    }
    if (cartItems.length === 0) {
      Swal.fire(
        "Empty Cart",
        "Your cart is empty. Please add items to proceed.",
        "warning"
      );
      return;
    }
    if (
      !name ||
      !email ||
      !number ||
      !address ||
      !city ||
      !zipcode ||
      !region ||
      !country
    ) {
      Swal.fire(
        "Address must be full fill",
        "Please provide your shipping address",
        "warning"
      );
      return;
    }

    Swal.fire({
      title: "Confirm Order Placement",
      text: "Are you sure you want to place this order? This action cannot be undone.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, place order",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsPlacingOrder(true);

        const shippingData = {
          name: name,
          email: email,
          number: number,
          address: address,
          city: city,
          zipcode: zipcode,
          region: region,
          country: country,
        };

        const orderPayload = {
          userId: session.user.id,
          shippingAddress: shippingData,
          items: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            variant: {
              color: item?.variant?.color,
              size: item?.variant?.size,
            },
          })),
          totalAmount: calculateTotalAmount(),
          shippingFee: shippingCost,
        };

        try {
          // 1. Create Order
          const orderRes = await fetch("/api/user/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderPayload),
          });
          const orderResult = await orderRes.json();

          if (!orderResult.success) {
            throw new Error(orderResult.error || "Failed to create order.");
          }

          const orderId = orderResult.order._id;

          // 2. Create Payment
          let paymentPayload = {
            orderId: orderId,
            userId: session.user.id,
            amount: calculateTotalAmount() + shippingCost,
            currency: "BDT", // Default from schema
          };

          if (selectedMethod === "mobilewallet") {
            const mobileWalletProvider = document.getElementById(
              "mobile-banking-provider"
            )?.value;
            const trxIdInput = document.getElementById("trxId"); // Get the input element
            const trxId = trxIdInput?.value;

            if (!mobileWalletProvider || mobileWalletProvider === "none") {
              throw new Error("Please select a mobile wallet provider.");
            }
            if (!trxId) {
              // Check if trxId is empty
              Swal.fire({
                icon: "warning",
                title: "Transaction ID Required",
                text: "Please enter the Transaction ID for mobile wallet payment.",
              });
              setIsPlacingOrder(false);
              return;
            }

            paymentPayload = {
              ...paymentPayload,
              method: mobileWalletProvider, // e.g., "bKash", "Nagad"
              trxId: trxId,
              status: "processing", // Or "pending" - depends on your flow
            };
          } else if (selectedMethod === "cod") {
            paymentPayload = {
              ...paymentPayload,
              method: "CashOnDelivery",
              status: "pending", // Will be 'confirmed' upon delivery
            };
          } else {
            throw new Error(
              "Invalid payment method selected for payment processing."
            );
          }

          const paymentRes = await fetch("/api/user/payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(paymentPayload),
          });
          const paymentResult = await paymentRes.json();

          console.log(paymentResult);

          if (paymentResult?.payment._id) {
            await fetch("/api/user/order", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: orderId,
                paymentInfo: paymentResult.payment._id,
              }),
            });
          }

          if (!paymentResult.success) {
            // Potentially try to cancel/rollback order or mark as payment failed
            throw new Error(
              paymentResult.error || "Failed to process payment."
            );
          }

          Swal.fire({
            title: "Order Placed!",
            text: `Thank you! Your order has been successfully placed. Your order ID is ${orderId.slice(
              -8
            )}.`,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });

          // 3. Save address if not saved by user
          if (Object.keys(addressData).length === 0) {
            await fetch("/api/user/address", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(shippingData),
            });
          }
          // Optionally redirect or clear cart:
          clearCart();
          // setSelectedMethod(null);
          // router.push('/order-success-page');
        } catch (error) {
          console.log(error);
          Swal.fire("Order Placement Failed", error.message, "error");
        } finally {
          setIsPlacingOrder(false);
        }
      }
    });
  };

  const containerVariants = {
    /* ... your variants ... */
  };
  const itemVariants = {
    /* ... your variants ... */
  };

  if (sessionStatus === "loading" || isLoadingAddress) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-xl'>Loading checkout...</p>
        {/* You can add a spinner here */}
      </div>
    );
  }

  const handleRemoveItem = (productId, variant) => {
    removeFromCart(productId, variant);
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100'>
      <div className='container mx-auto py-20 px-5'>
        <form onSubmit={handlePlaceOrder} className='max-w-6xl mx-auto'>
          <motion.div
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className='flex items-center gap-4 mb-12'>
            <ArrowLeft className='w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors' />
            <h2 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              Secure Checkout
            </h2>
          </motion.div>
          {/* Main Grid - Using div instead of form for the grid container */}
          <div className='grid lg:grid-cols-3 gap-8'>
            {/* Left Column - Checkout Form */}
            <motion.div
              variants={containerVariants}
              initial='hidden'
              animate='visible'
              className='lg:col-span-2 space-y-8'>
              {/* Shipping Info Form */}

              <motion.div
                variants={itemVariants}
                className='bg-white p-6 rounded-xl shadow-md'>
                <h2 className='text-xl font-semibold mb-4 text-gray-800'>
                  Contact Information
                </h2>
                <div className='space-y-4'>
                  <input
                    type='text'
                    name='name'
                    placeholder='Full Name'
                    required
                    defaultValue={
                      addressData?.name || session?.user?.name || ""
                    }
                    className='w-full p-3 rounded-lg focus:ring-2 ring ring-gray-200 focus:ring-blue-500 outline-none border border-gray-300'
                  />
                  <input
                    type='email'
                    name='email'
                    placeholder='Email Address'
                    required
                    defaultValue={
                      addressData?.email || session?.user?.email || ""
                    }
                    className='w-full p-3 rounded-lg focus:ring-2 ring ring-gray-200 focus:ring-blue-500 outline-none border border-gray-300'
                  />
                  <input
                    type='tel'
                    name='number'
                    placeholder='Phone Number'
                    required
                    defaultValue={addressData?.number || ""}
                    className='w-full p-3 rounded-lg focus:ring-2 ring ring-gray-200 focus:ring-blue-500 outline-none border border-gray-300'
                  />
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className='bg-white p-6 rounded-xl shadow-md mt-8'>
                <h2 className='text-xl font-semibold mb-4 text-gray-800'>
                  Shipping Address
                </h2>
                <div className='space-y-4'>
                  <input
                    type='text'
                    name='address'
                    placeholder='Street Address'
                    required
                    defaultValue={addressData?.address || ""}
                    className='w-full p-3 rounded-lg focus:ring-2 ring ring-gray-200 focus:ring-blue-500 outline-none border border-gray-300'
                  />
                  <div className='grid grid-cols-2 gap-4'>
                    <input
                      type='text'
                      name='city'
                      placeholder='City'
                      required
                      defaultValue={addressData?.city || ""}
                      className='p-3 rounded-lg ring ring-gray-200 focus:ring-2 focus:ring-blue-500 outline-none border border-gray-300'
                    />
                    <input
                      type='text'
                      name='zipcode'
                      placeholder='Postal Code'
                      required
                      defaultValue={addressData?.zipcode || ""}
                      className='p-3 rounded-lg ring ring-gray-200 focus:ring-2 focus:ring-blue-500 outline-none border border-gray-300'
                    />
                  </div>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div>
                      <label className='text-xs text-gray-600' htmlFor='region'>
                        Province / Region
                      </label>
                      <select
                        id='region'
                        name='region'
                        required
                        defaultValue={addressData?.region || "none"}
                        className='w-full p-3 rounded-lg focus:ring-2 ring ring-gray-200 focus:ring-blue-500 outline-none border border-gray-300 mt-1'>
                        <option value='none' disabled>
                          Province / Region
                        </option>
                        <option value='Dhaka'>Dhaka</option>
                        <option value='Chittagong'>Chittagong</option>
                        <option value='Rajshahi'>Rajshahi</option>
                        <option value='Sylhet'>Sylhet</option>
                        <option value='Mymensingh'>Mymensingh</option>
                        <option value='Rangpur'>Rangpur</option>
                        <option value='Khulna'>Khulna</option>
                        <option value='Barisal'>Barisal</option>
                      </select>
                    </div>
                    <div>
                      <label
                        className='text-xs text-gray-600'
                        htmlFor='country'>
                        Country
                      </label>
                      <select
                        id='country'
                        name='country'
                        required
                        defaultValue={addressData?.country || "Bangladesh"}
                        className='w-full p-3 rounded-lg focus:ring-2 ring ring-gray-200 focus:ring-blue-500 outline-none border border-gray-300 mt-1'>
                        <option disabled>Select Country</option>
                        <option value='Bangladesh'>Bangladesh</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Payment Method Section */}
              <motion.div
                variants={itemVariants}
                className='bg-white p-6 rounded-xl shadow-md'>
                <h2 className='text-xl font-semibold mb-6 text-gray-800'>
                  Payment Method
                </h2>
                <div className='space-y-4'>
                  {/* Card Option (Disabled) */}
                  <motion.div
                    variants={itemVariants}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 ease-in-out ${
                      isCardDisabled
                        ? "bg-gray-100 opacity-60 cursor-not-allowed border-gray-300"
                        : selectedMethod === "card"
                        ? "ring-2 ring-blue-500 border-blue-500 shadow-md"
                        : "cursor-pointer hover:ring-2 hover:ring-blue-400 hover:border-blue-400 border-gray-300"
                    }`}
                    onClick={() => handleMethodSelect("card")}>
                    <CreditCard
                      className={`w-6 h-6 ${
                        isCardDisabled ? "text-gray-400" : "text-blue-600"
                      }`}
                    />
                    <input
                      type='radio'
                      name='paymentMethod'
                      id='card'
                      checked={selectedMethod === "card"}
                      onChange={() => handleMethodSelect("card")}
                      disabled={isCardDisabled}
                      className='form-radio text-blue-600 focus:ring-blue-500 disabled:opacity-50'
                    />
                    <label
                      htmlFor='card'
                      className={`flex-grow ${
                        isCardDisabled
                          ? "text-gray-500 cursor-not-allowed"
                          : "text-gray-700 cursor-pointer"
                      }`}>
                      Credit/Debit Card{" "}
                      <span className='text-sm text-gray-400'>(Disabled)</span>
                    </label>
                  </motion.div>

                  {/* Mobile Wallet Option */}
                  <motion.div variants={itemVariants}>
                    <div
                      className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 ease-in-out ${
                        selectedMethod === "mobilewallet"
                          ? "ring-2 ring-green-500 border-green-500 shadow-md"
                          : "cursor-pointer hover:ring-2 hover:ring-green-400 hover:border-green-400 border-gray-300"
                      }`}
                      onClick={() => handleMethodSelect("mobilewallet")}>
                      <Wallet className='w-6 h-6 text-green-600' />
                      <input
                        type='radio'
                        name='paymentMethod'
                        id='mobile-wallet'
                        checked={selectedMethod === "mobilewallet"}
                        onChange={() => handleMethodSelect("mobilewallet")}
                        className='form-radio text-green-600 focus:ring-green-500'
                      />
                      <label
                        htmlFor='mobile-wallet'
                        className='flex-grow text-gray-700 cursor-pointer'>
                        Mobile Wallet
                      </label>
                    </div>
                    {selectedMethod === "mobilewallet" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{
                          opacity: 1,
                          height: "auto",
                          marginTop: "1rem",
                        }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className='ml-6 pl-6 border-l-2 border-green-200 space-y-4'>
                        <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-md border border-gray-200 shadow-sm'>
                          <Smartphone className='w-5 h-5 text-blue-500 flex-shrink-0' />
                          <select
                            name='MobileBankingProvider'
                            id='mobile-banking-provider'
                            defaultValue='none'
                            className='w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white'
                            aria-label='Select mobile banking provider'>
                            <option value='none' disabled>
                              Select a wallet
                            </option>
                            <option value='bKash'>bKash</option>
                            <option value='Nagad'>Nagad</option>
                            <option value='Rocket'>Rocket</option>
                          </select>
                        </div>
                        <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-md border border-gray-200 shadow-sm'>
                          <ArrowLeftRight className='w-5 h-5 text-blue-500 flex-shrink-0' />
                          <input
                            type='text'
                            id='trxId'
                            name='TrxID'
                            placeholder='Enter TrxID'
                            className='w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white'
                            aria-label='Transaction ID'
                          />
                        </div>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Cash on Delivery Option */}
                  <motion.div
                    variants={itemVariants}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 ease-in-out ${
                      selectedMethod === "cod"
                        ? "ring-2 ring-purple-500 border-purple-500 shadow-md"
                        : "cursor-pointer hover:ring-2 hover:ring-purple-400 hover:border-purple-400 border-gray-300"
                    }`}
                    onClick={() => handleMethodSelect("cod")}>
                    <HandCoins className='w-6 h-6 text-purple-600' />
                    <input
                      type='radio'
                      name='paymentMethod'
                      id='cod'
                      checked={selectedMethod === "cod"}
                      onChange={() => handleMethodSelect("cod")}
                      className='form-radio text-purple-600 focus:ring-purple-500'
                    />
                    <label
                      htmlFor='cod'
                      className='flex-grow text-gray-700 cursor-pointer'>
                      Cash on Delivery
                    </label>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Order Summary */}
            <motion.div
              initial={{ x: 20 }}
              animate={{ x: 0 }}
              className='bg-white rounded-xl shadow-lg h-fit sticky top-8'>
              <h2 className='text-center text-xl font-semibold text-gray-800 pt-8 pb-4'>
                Order Summary
              </h2>

              <div className='space-y-4 p-2 mb-6 max-h-72 overflow-y-auto'>
                {cartItems.length > 0 ? (
                  cartItems.map((item, index) => (
                    <motion.div
                      variants={itemVariants}
                      key={index}
                      className='flex items-center p-2 rounded-lg hover:bg-gray-100 relative'>
                      <Image
                        width={150}
                        height={150}
                        src={item.productImage?.src || "/placeholder-image.jpg"}
                        alt={item.productName}
                        className='w-20 h-20 bg-gray-100 rounded-lg object-cover'
                      />

                      <div className='flex flex-col gap-1 flex-1 p-2'>
                        <h3 className='font-medium text-sm text-gray-800'>
                          {item.productName}
                        </h3>
                        <p className='text-xs text-gray-500'>
                          {item.quantity} × {item.unitPrice} Tk
                        </p>
                        <div className='flex flex-wrap gap-2 mt-1'>
                          {item?.variant?.size && (
                            <span className='bg-gray-50 px-2 py-0.5 rounded-full text-xs'>
                              Size: {item.variant.size}
                            </span>
                          )}
                          {item?.variant?.color && (
                            <span className='bg-gray-50 px-2 py-0.5 rounded-full text-xs'>
                              Color: {item.variant.color}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className='ml-auto font-medium text-sm text-gray-800 p-2'>
                        {item.totalPrice} Tk
                      </p>
                      <span
                        onClick={() => {
                          handleRemoveItem(item.productId, item.variant);
                        }}
                        className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full cursor-pointer'>
                        <X />
                      </span>
                    </motion.div>
                  ))
                ) : (
                  <p className='text-gray-500 text-sm text-center mb-10 mt-5'>
                    Your cart is empty.
                  </p>
                )}
              </div>

              <div className='space-y-3 text-sm px-4 '>
                <div className='flex justify-between'>
                  <span>Subtotal:</span>
                  <span className='font-medium'>{calculateSubtotal()}৳</span>
                </div>
                <div className='flex justify-between'>
                  <span>Shipping:</span>
                  <span className='font-medium'>{shippingCost}৳</span>
                </div>
                <div className='flex justify-between pt-3 border-t border-t-gray-200'>
                  <span className='font-semibold text-base'>Total:</span>
                  <span className='text-lg font-bold text-blue-600'>
                    {calculateTotalAmount() + shippingCost}৳
                  </span>
                </div>
              </div>

              <div className='px-4 pb-4'>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  disabled={
                    isPlacingOrder ||
                    sessionStatus === "loading" ||
                    cartItems.length === 0
                  }
                  className='cursor-pointer w-full py-4 bg-blue-600 text-white rounded-lg font-semibold mt-8 hover:bg-blue-700 transition-colors disabled:opacity-50'>
                  {isPlacingOrder ? "Placing Order..." : "Place Order"}
                </motion.button>

                <div className='mt-6 text-center text-sm text-gray-500'>
                  <Lock className='inline-block w-4 h-4 mr-2' />
                  Secure SSL Encryption
                </div>
              </div>
            </motion.div>
          </div>
          {/* End of Main Grid */}
          {/* Security Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className='flex flex-wrap justify-center gap-6 mt-12'>
            <div className='flex items-center gap-2 text-sm text-gray-600'>
              <ShieldCheck className='w-5 h-5 text-green-600' />
              100% Purchase Protection
            </div>
            {/* ... other badges */}
          </motion.div>
        </form>
      </div>
    </motion.section>
  );
};

export default ClientCheckout;
