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
} from "recharts";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  MapPin,
  Loader,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import CustomTooltip from "@/components/ui/CustomTooltip";
import { DashboardLoading } from "@/components/ui/LoadingAnimations";

// Helper to format data for charts
const formatChartData = (data) => {
  if (!data) return [];
  return Object.entries(data).map(([name, value]) => ({ name, value }));
};

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor='middle'
        fill={fill}
        className='font-bold text-lg'>
        {payload.name}
      </text>
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
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill='none'
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke='none' />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill='#333'>{`Count ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill='#999'>
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const DashboardOverview = () => {
  const [stats, setStats] = useState(null);
  const [regionData, setRegionData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const getAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsRes, regionRes, topProductsRes, statusRes] =
          await Promise.all([
            fetch(`/api/dashboard/statistics`),
            fetch(`/api/dashboard/statistics/orders-by-region`),
            fetch(`/api/dashboard/statistics/top-selling-products`),
            fetch(`/api/dashboard/statistics/orders-by-status`),
          ]);

        // Check for failed requests
        if (
          !statsRes.ok ||
          !regionRes.ok ||
          !topProductsRes.ok ||
          !statusRes.ok
        ) {
          throw new Error("Network response was not ok");
        }

        const statsJson = await statsRes.json();
        const regionJson = await regionRes.json();
        const topProductsJson = await topProductsRes.json();
        const statusJson = await statusRes.json();

        if (statsJson.success) setStats(statsJson.data);
        if (regionJson.success) setRegionData(formatChartData(regionJson.data));
        if (topProductsJson.success) setTopProducts(topProductsJson.data);
        if (statusJson.success) setStatusData(formatChartData(statusJson.data));
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError(
          "Could not load dashboard data. Please make sure the API server is running."
        );
      } finally {
        setLoading(false);
      }
    };

    getAllData();
  }, []);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const PIE_COLORS = {
    Delivered: "#22c55e", // green-500
    Pending: "#f97316", // orange-500
    Shipped: "#3b82f6", // blue-500
  };

  if (loading) return <DashboardLoading />;

  if (error) {
    return (
      <div className='flex flex-col justify-center items-center h-screen bg-red-50 text-red-600'>
        <div className='bg-white p-8 rounded-2xl shadow-lg text-center'>
          <AlertCircle size={48} className='mx-auto text-red-500' />
          <p className='text-xl mt-4 font-semibold'>{error}</p>
          <p className='text-gray-500 mt-2'>
            Please check your connection and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-gray-50 text-gray-800 font-sans'>
      <header className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 tracking-tight'>
          Dashboard
        </h1>
        <p className='text-gray-500'>
          Welcome back, here&apos;s your business overview.
        </p>
      </header>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <StatCard
          icon={<DollarSign size={24} />}
          title='Total Revenue'
          value={`$${stats?.totalRevenue || 0}`}
          color='green'
        />
        <StatCard
          icon={<ShoppingCart size={24} />}
          title='Total Orders'
          value={stats?.totalOrders || 0}
          color='blue'
        />
        <StatCard
          icon={<Users size={24} />}
          title='Total Customers'
          value={stats?.totalCustomers || 0}
          color='purple'
        />
        <StatCard
          icon={<Package size={24} />}
          title='Total Products'
          value={stats?.totalProducts || 0}
          color='yellow'
        />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Charts Section */}
        <div className='lg:col-span-2 space-y-8'>
          {/* Orders by Region Chart */}
          <div className='bg-white p-6 rounded-2xl border border-gray-200'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
              <MapPin className='mr-2 text-cyan-500' size={20} />
              Orders by Region
            </h3>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart
                  data={regionData}
                  margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
                  <XAxis dataKey='name' stroke='#6b7280' fontSize={12} />
                  <YAxis stroke='#6b7280' fontSize={12} />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(100, 116, 139, 0.1)" }}
                  />
                  <Legend />
                  <Bar dataKey='value' name='Orders' fill='url(#colorUv)' />
                </BarChart>
              </ResponsiveContainer>
              <svg width='0' height='0'>
                <defs>
                  <linearGradient id='colorUv' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#22d3ee' stopOpacity={0.8} />
                    <stop offset='95%' stopColor='#0891b2' stopOpacity={0.4} />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          {/* Order Status Chart */}
          <div className='bg-white p-6 rounded-2xl border border-gray-200'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
              <TrendingUp className='mr-2 text-fuchsia-500' size={20} />
              Order Status Distribution
            </h3>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={statusData}
                    cx='50%'
                    cy='50%'
                    innerRadius={70}
                    outerRadius={90}
                    fill='#8884d8'
                    dataKey='value'
                    onMouseEnter={onPieEnter}>
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[entry.name] || "#cccccc"}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className='lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-200'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Top Selling Products
          </h3>
          <div className='space-y-3'>
            {topProducts.map((product, index) => (
              <div
                key={product.productId}
                className='flex items-center justify-between p-3 bg-gray-50 rounded-lg transition-all hover:bg-gray-100 border border-transparent hover:border-gray-200'>
                <div className='flex items-center'>
                  <span className='text-cyan-500 font-bold mr-3 text-sm'>
                    #{index + 1}
                  </span>
                  <div>
                    <p className='font-medium text-gray-800 text-sm'>
                      {product.name}
                    </p>
                  </div>
                </div>
                <span className='font-bold text-gray-700 bg-gray-200 px-3 py-1 rounded-full text-xs'>
                  {product.totalQuantity} sold
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
