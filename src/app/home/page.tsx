"use client";
import LayoutWrapper from "@/components/Layout/layout";

export default function Page() {
  return (
    <LayoutWrapper>
      <div className="flex flex-col card bg-blue-100 shadow-xl w-96 p-5 rounded-lg">
        <div className="text-lg">Home Page, Welcome to the App</div>
        <div className="text-gray-500 text-sm">Please choose a form</div>
      </div>
    </LayoutWrapper>
  );
}
