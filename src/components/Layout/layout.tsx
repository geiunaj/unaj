"use client";

import { useSession } from "next-auth/react";
import LoginPage from "../login/login";
import Header from "../header";
import Sidebar from "../sidebar";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();

  return session ? (
    <div className="flex h-screen">
      <div className="border-e h-full w-64">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-auto w-full  bg-muted/40">
        <div className="">
          <Header />
        </div>
        <div className="flex-auto m-4">{children}</div>
      </div>
    </div>
  ) : (
    <LoginPage />
  );
};

// return (
//   <html lang="en">
//     <body className={inter.className}>
//       <div className="flex h-screen">
//         <div className="border w-64 h-full">
//           <Lista />
//         </div>
//         <div className="flex-auto w-2/3 p-0 h-full mx-auto max-w-screen-xl">
//           <Header />
//           <div>{children}</div>
//         </div>
//       </div>
//     </body>
//   </html>
// );
export default LayoutWrapper;
