"use client";

import {useSession} from "next-auth/react";
import {useState, useEffect} from "react";
import LoginPage from "../login/login";
import LayoutSkeleton from "./layoutSkeleton";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import {ThemeProvider} from "@/components/theme-provider";

const LayoutWrapper = ({children}: { children: React.ReactNode }) => {
    const {data: session, status} = useSession();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status !== "loading") {
            setLoading(false);
        }
    }, [status]);

    if (loading) {
        return <LayoutSkeleton/>;
    }

    return <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
    >
        {
            session ? (
                <div className="sm:grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
                    <div className="hidden border-r bg-muted/40 md:block">
                        <Sidebar/>
                    </div>
                    <div className="flex flex-col">
                        <Header/>
                        <main className="flex flex-1 flex-col items-center gap-4 p-2 lg:gap-6 lg:p-6 transition-all">
                            {children}
                        </main>
                    </div>
                </div>
            ) : <LoginPage/>
        }
    </ThemeProvider>
    // );
};

export default LayoutWrapper;
