"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import LoginPage from "../login/login";
import Header from "../header";
import Sidebar from "../sidebar";
import LayoutSkeleton from "./layoutSkeleton";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "loading") {
      setLoading(false);
    }
  }, [status]);

  if (loading) {
    return <LayoutSkeleton />;
  }

  return session ? (
    <div className="flex h-screen">
      <div className="border-e h-full w-64">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-auto w-full bg-muted/40">
        <div className="">
          <Header />
        </div>
        <div className="flex-auto m-4 flex justify-center items-center p-6 bg-white rounded-xl shadow">
          {children}
        </div>
      </div>
    </div>
  ) : (
    <LoginPage />
  );
};

export default LayoutWrapper;
