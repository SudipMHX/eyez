"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sector,
  RadialBarChart,
  RadialBar,
} from "recharts";
import {
  DollarSign,
  Users,
  Package,
  CreditCard,
  ShoppingBag,
  AlertCircle,
  TrendingUp,
  UserCheck,
  Star,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { DashboardLoading } from "@/components/ui/LoadingAnimations";

// --- HELPER & WRAPPER COMPONENTS ---

/**
 * A styled card wrapper for each dashboard widget.
 * Provides a consistent look and feel.
 */
const StatCard = ({ title, icon, children, className = "" }) => (
  <div
    className={`bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col ${className}`}>
    <div className='flex items-center mb-4'>
      <div className='bg-slate-100 p-2 rounded-lg'>{icon}</div>
      <h3 className='text-base sm:text-lg font-semibold text-gray-800 ml-3'>
        {title}
      </h3>
    </div>
    <div className='flex-grow'>{children}</div>
  </div>
);

// --- CHART COMPONENTS (Unchanged) ---

/**
 * Sales Chart: A Bar Chart with custom-shaped bars for a unique look.
 */
const SalesChart = ({ data }) => {
  const getPath = (x, y, width, height) => {
    const radius = 6;
    return `M${x},${y + radius} A${radius},${radius},0,0,1,${
      x + radius
    },${y} L${x + width - radius},${y} A${radius},${radius},0,0,1,${
      x + width
    },${y + radius} L${x + width},${y + height} L${x},${y + height} Z`;
  };

  const CustomBar = (props) => {
    const { fill, x, y, width, height } = props;
    return <path d={getPath(x, y, width, height)} stroke='none' fill={fill} />;
  };

  return (
    <ResponsiveContainer width='100%' height={300}>
      <BarChart
        data={data}
        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <defs>
          <linearGradient id='salesGradient' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor='#4f46e5' stopOpacity={0.8} />
            <stop offset='95%' stopColor='#818cf8' stopOpacity={0.9} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray='3 3'
          vertical={false}
          stroke='#e0e0e0'
        />
        <XAxis
          dataKey='date'
          tick={{ fontSize: 12, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(value) => `$${value}`}
          tick={{ fontSize: 12, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "rgba(239, 246, 255, 0.5)" }}
          contentStyle={{
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "0.75rem",
            boxShadow:
              "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          }}
        />
        <Bar
          dataKey='totalSales'
          fill='url(#salesGradient)'
          shape={<CustomBar />}
          barSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

/**
 * Payment Methods Chart: A Donut Chart with an active shape and custom label.
 */
const PaymentMethodsChart = ({ data }) => {
  const COLORS = ["#4f46e5", "#60a5fa", "#a78bfa", "#fb923c"];

  const renderActiveShape = (props) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
    } = props;
    return (
      <g>
        <text
          x={cx}
          y={cy - 10}
          dy={8}
          textAnchor='middle'
          fill='#1f2937'
          className='font-bold'>
          {payload.name}
        </text>
        <text
          x={cx}
          y={cy + 10}
          dy={8}
          textAnchor='middle'
          fill='#6b7280'
          className='text-sm'>{`${(percent * 100).toFixed(0)}%`}</text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
      </g>
    );
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = (_, index) => setActiveIndex(index);

  return (
    <ResponsiveContainer width='100%' height={250}>
      <PieChart>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={data}
          cx='50%'
          cy='50%'
          innerRadius={65}
          outerRadius={90}
          fill='#8884d8'
          dataKey='value'
          onMouseEnter={onPieEnter}
          paddingAngle={2}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

/**
 * Category Sales Chart: A Radial Bar Chart for a unique comparison view.
 */
const CategorySalesChart = ({ data }) => {
  const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f97316", "#10b981"];
  const style = {
    top: "50%",
    right: 0,
    transform: "translate(0, -50%)",
    lineHeight: "24px",
  };
  return (
    <ResponsiveContainer width='100%' height={250}>
      <RadialBarChart
        cx='50%'
        cy='50%'
        innerRadius='20%'
        outerRadius='90%'
        barSize={12}
        data={data}
        startAngle={90}
        endAngle={-270}>
        <RadialBar minAngle={15} background clockWise dataKey='totalQuantity'>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              className='stroke-transparent'
            />
          ))}
        </RadialBar>
        <Legend
          iconSize={10}
          layout='vertical'
          verticalAlign='middle'
          wrapperStyle={style}
          formatter={(value) => <span className='text-gray-600'>{value}</span>}
        />
        <Tooltip
          contentStyle={{
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "0.75rem",
            boxShadow:
              "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          }}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
};

// --- MAIN DASHBOARD COMPONENT ---

const AnalyticsClient = () => {
  // State for all dashboard data, loading, and errors
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch all data from APIs
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        // List of API endpoints to fetch
        const endpoints = [
          "sales-chart",
          "payment-method-usage",
          "category-sales",
          "top-tier-customers",
          "top-tier-products",
          "low-stock-products",
        ];

        // Fetch all endpoints concurrently
        const responses = await Promise.all(
          endpoints.map((endpoint) =>
            fetch(`/api/dashboard/statistics/${endpoint}`)
          )
        );

        // Check for any failed responses
        for (const res of responses) {
          if (!res.ok) {
            throw new Error(`Failed to fetch data: ${res.statusText}`);
          }
        }

        // Parse all responses as JSON
        const jsonData = await Promise.all(responses.map((res) => res.json()));

        // Ensure all API calls were successful
        for (const result of jsonData) {
          if (!result.success) {
            throw new Error("An API call returned success: false");
          }
        }

        // Process and set the fetched data into state
        const [
          salesChart,
          paymentUsage,
          categorySales,
          topCustomers,
          topProducts,
          lowStock,
        ] = jsonData.map((item) => item.data);

        // Format data for the charts
        const formattedSales = salesChart.map((d) => ({
          ...d,
          date: new Date(d._id).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
        }));

        const formattedPayment = Object.entries(paymentUsage).map(
          ([name, value]) => ({ name, value })
        );

        const formattedCategory = categorySales.map((c) => ({
          name: c.categoryName,
          totalQuantity: c.totalQuantity,
        }));

        setDashboardData({
          salesData: formattedSales,
          paymentData: formattedPayment,
          categoryData: formattedCategory,
          topCustomers,
          topProducts,
          lowStock,
          rawSalesData: salesChart, // Keep raw data for calculations
          rawPaymentData: paymentUsage, // Keep raw data for calculations
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) return <DashboardLoading />;

  if (error) {
    return (
      <div className='flex justify-center items-center h-screen bg-gray-50 text-red-600'>
        <AlertCircle className='h-8 w-8 mr-4' />
        <p className='text-lg'>
          Failed to load dashboard data. Please try again later.
        </p>
      </div>
    );
  }

  if (!dashboardData) {
    return null; // Or some other placeholder if data is null after loading
  }

  // Calculate total sales and orders from fetched data
  const totalSalesValue = dashboardData.rawSalesData.reduce(
    (sum, item) => sum + item.totalSales,
    0
  );
  const totalOrders = Object.values(dashboardData.rawPaymentData).reduce(
    (sum, count) => sum + count,
    0
  );
  const totalCustomers = dashboardData.topCustomers.length;

  return (
    <section className='font-sans'>
      <div className=''>
        {/* --- Top Level Stat Cards --- */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
          <StatCard
            title='Total Revenue'
            icon={<DollarSign className='text-green-500' />}>
            <p className='text-2xl sm:text-3xl font-bold text-gray-900'>
              ${totalSalesValue.toLocaleString()}
            </p>
            <p className='text-sm text-green-600 flex items-center mt-1'>
              +20.1% from last month
            </p>
          </StatCard>
          <StatCard
            title='Total Orders'
            icon={<ShoppingBag className='text-blue-500' />}>
            <p className='text-2xl sm:text-3xl font-bold text-gray-900'>
              {totalOrders}
            </p>
            <p className='text-sm text-green-600 flex items-center mt-1'>
              +15.5% from last month
            </p>
          </StatCard>
          <StatCard
            title='Total Customers'
            icon={<Users className='text-purple-500' />}>
            <p className='text-2xl sm:text-3xl font-bold text-gray-900'>
              {totalCustomers}
            </p>
            <p className='text-sm text-green-600 flex items-center mt-1'>
              +12 from last month
            </p>
          </StatCard>
          <StatCard
            title='Low Stock Items'
            icon={<AlertCircle className='text-red-500' />}>
            <p className='text-2xl sm:text-3xl font-bold text-gray-900'>
              {dashboardData.lowStock.length}
            </p>
            <p className='text-sm text-gray-500 mt-1'>
              Items needing attention
            </p>
          </StatCard>
        </div>

        {/* --- Charts --- */}
        <div className='grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6'>
          <StatCard
            title='Sales Overview'
            icon={<TrendingUp className='text-indigo-500' />}
            className='lg:col-span-3'>
            <SalesChart data={dashboardData.salesData} />
          </StatCard>
          <StatCard
            title='Payment Methods'
            icon={<CreditCard className='text-amber-500' />}
            className='lg:col-span-2'>
            <PaymentMethodsChart data={dashboardData.paymentData} />
          </StatCard>
        </div>

        {/* --- Lists and Category Chart --- */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <StatCard
            title='Top Selling Products'
            icon={<Package className='text-cyan-500' />}
            className='lg:col-span-1'>
            <ul className='space-y-4'>
              {dashboardData.topProducts.map((product) => (
                <li key={product._id} className='flex items-center'>
                  <Image
                    width={100}
                    height={100}
                    src={
                      product.productImage[0] ||
                      "https://placehold.co/40x40/e2e8f0/475569?text=?"
                    }
                    alt={product.productName}
                    className='w-10 h-10 rounded-md object-cover'
                  />
                  <div className='ml-3 flex-1'>
                    <p className='font-medium text-sm text-gray-800 truncate'>
                      {product.productName}
                    </p>
                    <p className='text-xs text-gray-500'>
                      {product.totalQuantitySold} units sold
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </StatCard>
          <StatCard
            title='Top Customers'
            icon={<UserCheck className='text-pink-500' />}
            className='lg:col-span-1'>
            <ul className='space-y-4'>
              {dashboardData.topCustomers.map((customer) => (
                <li key={customer.userId} className='flex items-center'>
                  <div className='w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600'>
                    {customer.name.charAt(0)}
                  </div>
                  <div className='ml-3 flex-1'>
                    <p className='font-medium text-sm text-gray-800'>
                      {customer.name}
                    </p>
                    <p className='text-xs text-gray-500'>
                      ${customer.totalSpent.toLocaleString()} spent
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </StatCard>
          <StatCard
            title='Sales by Category'
            icon={<Star className='text-lime-500' />}
            className='lg:col-span-1'>
            <CategorySalesChart data={dashboardData.categoryData} />
          </StatCard>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsClient;
