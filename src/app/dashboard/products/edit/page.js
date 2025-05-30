import Link from "next/link";

const EditPage = () => {
  return (
    <section>
      <div>
        <h2 className='text-center text-xl font-semibold p-3 rounded-lg'>
         product ID not found
        </h2>
      </div>
      <div className='flex flex-wrap justify-center gap-2 py-10'>
        <Link
          className='bg-green-500 text-white font-semibold px-3 py-2 rounded-lg'
          href={"/dashboard/products"}>
          Back To Products
        </Link>
        <Link
          className='bg-green-500 text-white font-semibold px-3 py-2 rounded-lg'
          href={"/dashboard"}>
          Back To Overview
        </Link>
      </div>
    </section>
  );
};

export default EditPage;
