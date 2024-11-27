"use client";

import LayoutWrapper from "@/components/Layout/layout";
import TaxiPage from "@/components/taxi/components/TaxiPage";
import UsuarioPage from "@/components/user/components/UserPage";


export default function Page() {
  return (
    <LayoutWrapper>
      <UsuarioPage />
    </LayoutWrapper>
  );
}
