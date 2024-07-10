"use client";
import CombustionPage from "@/components/combustion/components/CombustionPage";
import { FormCombustion } from "@/components/combustion/components/FormCombustion";
import LayoutWrapper from "@/components/Layout/layout";

export default function Page() {
  return (
    <LayoutWrapper>
      {/* <FormCombustion />; */}
      <CombustionPage />
    </LayoutWrapper>
  );
}
