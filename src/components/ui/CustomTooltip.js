const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className='bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-gray-200 shadow-lg'>
        <p className='label text-gray-800 font-bold'>{`${label}`}</p>
        <p className='intro text-cyan-500'>{`Orders: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};
export default CustomTooltip;
