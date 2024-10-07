"use client";

import LayoutWrapper from "@/components/Layout/layout";
import TipoConsumiblePage from "@/components/tipoConsumible/components/TipoConsumiblePage";
import DescripcionConsumiblePage from "@/components/tipoConsumible/components/descripcion/DescripcionConsumiblePage";


export default function Page() {
    return (
        <LayoutWrapper>
            <DescripcionConsumiblePage/>
        </LayoutWrapper>
    );
}
