"use client";
import CombustionPage from "@/components/combustion/components/CombustionPage";
import { FormCombustion } from "@/components/combustion/components/FormCombustion";
import CombustionTable from "@/components/combustion/components/prueba";
import LayoutWrapper from "@/components/Layout/layout";

export default function Page() {
  return (
    <LayoutWrapper>
      {/* <CombustionTable /> */}
      <CombustionPage />
    </LayoutWrapper>
  );
}
