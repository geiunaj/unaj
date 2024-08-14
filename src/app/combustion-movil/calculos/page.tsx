"use client";
import LayoutWrapper from "@/components/Layout/layout";
import CombustibleCalculate from "@/components/combustion/components/CombustibleCalculate";

export default function Page() {
    return (
        <LayoutWrapper>
            <CombustibleCalculate tipo="movil"/>
        </LayoutWrapper>
    );
}
