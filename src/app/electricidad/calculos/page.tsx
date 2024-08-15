"use client";
import LayoutWrapper from "@/components/Layout/layout";
import ElectricidadCalculate from "@/components/consumoElectricidad/components/ElectricidadCalculate";

export default function Page() {
    return (
        <LayoutWrapper>
            <ElectricidadCalculate/>
        </LayoutWrapper>
    );
}
