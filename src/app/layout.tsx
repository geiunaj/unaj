import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {ReactQueryClientProvider} from "@/components/Provider";
import {Toaster} from "@/components/ui/sonner";
import {SessionWrapper} from "@/components/SessionWrapper/SessionWrapper";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Calculadora de Huella Ecológica - UNAJ",
    description: "UNAJ",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ReactQueryClientProvider>
            <SessionWrapper>
                <html lang="en">
                <body className={`${inter.className}`}>
                {children}
                <Toaster/>
                </body>
                </html>
            </SessionWrapper>
        </ReactQueryClientProvider>
    );
}
