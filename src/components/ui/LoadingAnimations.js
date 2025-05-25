import "@/styles/loading-animations.css";

export const SpinnerLoader = () => (
  <div className='flex items-center justify-center w-full h-full'>
    <div className='w-12 h-12 border-4 border-blue-500 border-l-transparent rounded-full animate-[spin_1s_linear_infinite]'></div>
  </div>
);

export const BouncingDotsLoader = () => (
  <div className='flex items-center justify-center w-full h-full space-x-2'>
    <div className='w-3 h-3 bg-blue-500 rounded-full animate-[bounce_1s_infinite_-0.32s]'></div>
    <div className='w-3 h-3 bg-blue-500 rounded-full animate-[bounce_1s_infinite_-0.16s]'></div>
    <div className='w-3 h-3 bg-blue-500 rounded-full animate-[bounce_1s_infinite]'></div>
  </div>
);

export const BarsLoader = () => (
  <div className='flex items-center justify-center w-full h-full space-x-1.5'>
    <div className='w-1.5 h-6 bg-blue-500 animate-[barPulse_1.2s_ease-in-out_infinite]'></div>
    <div className='w-1.5 h-6 bg-blue-500 animate-[barPulse_1.2s_ease-in-out_infinite_0.4s]'></div>
    <div className='w-1.5 h-6 bg-blue-500 animate-[barPulse_1.2s_ease-in-out_infinite_0.8s]'></div>
  </div>
);

export const FullscreenLoadingScreen = () => (
  <section className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-gray-900'>
    <div className='flex flex-col items-center space-y-4'>
      <div className='relative w-24 h-24'>
        <div className='absolute inset-0 border-4 border-blue-200 rounded-full'></div>
        <div className='absolute inset-0 border-4 border-blue-500 border-l-transparent rounded-full animate-[spin_1.2s_cubic-bezier(0.4,0,0.2,1)_infinite]'></div>
      </div>
      <div className='w-32 h-1 bg-blue-100 rounded-full overflow-hidden'>
        <div className='w-1/2 h-full bg-blue-500 animate-[progress_2s_ease-in-out_infinite]'></div>
      </div>
    </div>
  </section>
);
