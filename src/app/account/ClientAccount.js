"use client";
import { useSession } from "next-auth/react";

import profilePicture from "@/assets/freddie-marriage-iYQC9xWMvw4-unsplash.jpg";
import Image from "next/image";

const ClientAccount = () => {
  const { data: session, status } = useSession();

  return (
    <section>
      <div>
        <h2>
          Welcome back <strong>{session?.user?.name.split(" ")[0]}</strong>!
        </h2>
        <div className='flex flex-wrap items-center gap-5 bg-white p-5 rounded-xl shadow-xs mt-5'>
          <Image
            src={profilePicture}
            alt={session?.user?.name}
            width={256}
            height={256}
            className='w-28 h-28 object-cover rounded-full'
            draggable={false}
          />
          <div>
            <p className='text-xl font-semibold'>{session?.user?.name}</p>
            <p>E-mail : {session?.user?.email}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientAccount;
