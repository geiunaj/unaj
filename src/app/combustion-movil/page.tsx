"use client";
import CombustiblePage, {CombustionMovilPage} from "@/components/combustion/components/CombustiblePage";
import {FormCombustible} from "@/components/combustion/components/FormCombustible";
import LayoutWrapper from "@/components/Layout/layout";

export default function Page() {
    return (
        <LayoutWrapper>
            {/* <CombustionTable /> */}
            <CombustionMovilPage/>
        </LayoutWrapper>
    );
}
