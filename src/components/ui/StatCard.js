const StatCard = ({ icon, title, value, color }) => (
  <div className='bg-white p-6 rounded-2xl border border-gray-200 flex items-center space-x-4 transition-all duration-300 hover:border-cyan-400/50 hover:shadow-xl'>
    <div className={`p-3 rounded-full bg-gray-100 text-${color}-500`}>
      {icon}
    </div>
    <div>
      <p className='text-sm text-gray-500'>{title}</p>
      <p className='text-2xl font-bold text-gray-900'>{value}</p>
    </div>
  </div>
);
export default StatCard;
