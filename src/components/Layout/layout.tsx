"use client";

import {useSession} from "next-auth/react";
import {useState, useEffect} from "react";
import LoginPage from "../login/login";
import LayoutSkeleton from "./layoutSkeleton";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import {ThemeProvider} from "@/components/theme-provider";
import {usePathname, useRouter} from "next/navigation";
import {useMenuStore} from "@/lib/stores/menuStore.store";
import {getPermisos} from "@/components/Layout/services/menu.actions";
import {useQuery} from "@tanstack/react-query";
import api from "../../../config/api";

const LayoutWrapper = ({children}: { children: React.ReactNode }) => {
    const session: any = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();
    const {menuFiltered, setLinkPermitido} = useMenuStore();

    useEffect(() => {
        if (session.status !== "loading") {
            setLoading(false);
        }
    }, [session.status]);

    useEffect(() => {
        if (session.data && menuFiltered.length === 0) {
            getPermisos({id: session.data.id}).then((data) => {
                setLinkPermitido(data);
            });
        }
    }, [session.data]);

    const logo = useQuery({
        queryKey: ["logo"],
        queryFn: async (): Promise<FileResponse> => {
            return (await api.get("/api/logo?type=logo")).data;
        },
        refetchOnWindowFocus: false,
    });

    const logoDark = useQuery({
        queryKey: ["logoDark"],
        queryFn: async (): Promise<FileResponse> => {
            return (await api.get("/api/logo?type=logoDark")).data;
        },
        refetchOnWindowFocus: false,
    });

    const pushToHome = async () => {
        await router.push("/home");
    };

    useEffect(() => {
        setLoading(true);
        const path = "/" + pathname.split("/")[1];
        const menuItem = menuFiltered.find((item) => {
            return (
                item.href === path ||
                item.items?.some((subItem) => subItem.href === path)
            );
        });

        if (menuFiltered.length !== 0) {
            if (path !== "/cuenta") {
                if (!menuItem) {
                    pushToHome();
                }
            }
        }
        setLoading(false);
    }, [pathname, menuFiltered]);

    if (loading || logo.isLoading) {
        return <LayoutSkeleton/>;
    }

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            {session.data ? (
                <div className="sm:grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr]">
                    <div className="hidden border-r bg-muted/40 md:block">
                        <Sidebar
                            urlLogoDark={logoDark?.data?.file?.streamLink ?? ""}
                            urlLogo={logo?.data?.file?.streamLink ?? ""}
                        />
                    </div>
                    <div className="flex flex-col">
                        <Header
                            urlLogoDark={logoDark?.data?.file?.streamLink ?? ""}
                            urlLogo={logo?.data?.file?.streamLink ?? ""}
                        />
                        <main className="flex flex-1 flex-col items-center gap-4 p-2 lg:gap-6 lg:p-6 transition-all">
                            {children}
                        </main>
                    </div>
                </div>
            ) : (
                <LoginPage/>
            )}
        </ThemeProvider>
    );
};

export default LayoutWrapper;
