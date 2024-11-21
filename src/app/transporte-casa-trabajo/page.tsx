"use client";

import LayoutWrapper from "@/components/Layout/layout";
import ActivosPage from "@/components/activos/components/ActivosPage";
import TransporteCasaTrabajoPage from "@/components/transporteCasaTrabajo/components/TransporteCasaTrabajoPage";

export default function Page() {
    return (
        <LayoutWrapper>
            <TransporteCasaTrabajoPage/>
        </LayoutWrapper>
    );
}
