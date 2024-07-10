"use client";

import { useSession } from "next-auth/react";
import LoginPage from "../login/login";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();

  
  return session ? (
    <div className="flex flex-col h-screen">
      {/* <Header></Header> */}
      <div className="border-4 border-blue-200 min-h-[56px]"></div>
      <div className="flex h-full">
        {/* <Sidebar className="w-1/4"></Sidebar> */}
        <div className="border-4 border-amber-200 w-1/4"></div>
        <div className="w-3/4 border-4 border-gray-200 flex justify-center items-center">
          {children}
        </div>
      </div>
    </div>
  ) : (
    <LoginPage />
  );
};

export default LayoutWrapper;
