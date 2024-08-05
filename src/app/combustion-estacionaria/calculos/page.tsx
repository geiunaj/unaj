"use client";
import LayoutWrapper from "@/components/Layout/layout";
import CombustionCalculate from "@/components/combustion/components/CombustionCalculate";

export default function Page() {
    return (
        <LayoutWrapper>
            <CombustionCalculate tipo="estacionaria"/>
        </LayoutWrapper>
    );
}