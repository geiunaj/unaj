"use client";
import {useRouter, usePathname} from "next/navigation";
import {Button} from "./ui/button";
import {iconComponents, menu, MenuItem} from "@/lib/constants/menu";
import {useState, useEffect} from "react";
import Link from "next/link";
import {Separator} from "./ui/separator";

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const [itemActive, setItemActive] = useState<string>("");

    useEffect(() => {
        const path = "/" + pathname.split("/")[1];
        if (path === "/") {
            setItemActive("/home");
            return;
        }
        setItemActive(path);
    }, [pathname]);

    const handleItemClick = (item: MenuItem) => {
        setItemActive(item.href);
        router.push(item.href);
    };

    const className = (classname: string, href: string) => {
        return `${classname} ${
            itemActive === href ? "text-primary" : "text-muted-foreground"
        }`;
    };

    return (
        <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-2 lg:h-[60px] lg:px-3">
                <Link
                    href="/"
                    className="w-full flex justify-evenly items-center gap-2"
                >
                    {/* <Calculator className="h-5" /> */}
                    <div className="flex items-center justify-around gap-3">
                        <p className="text-blue-700 text-3xl font-black">UNAJ</p>
                        <Separator orientation="vertical" className="h-8"/>
                        <div className="flex flex-col text-gray-600 text-center text-[10px] xl:text-xs font-medium">
                            <p>Calculadora de</p>
                            <p>Huella Ecológica</p>
                        </div>
                    </div>
                </Link>
            </div>
            <div className="flex-1">
                <nav className="grid items-start px-2 text-sm font-medium overflow-hidden">
                    {menu.map((item) => {
                        const Icon = iconComponents[item.icon];
                        return (
                            <Button
                                key={item.title}
                                variant={itemActive === item.href ? "secondary" : "ghost"}
                                className={className(
                                    "w-full justify-start hover:text-primary",
                                    item.href
                                )}
                                onClick={() => handleItemClick(item)}
                            >
                                <Icon className="mr-2 h-4 w-4"/>
                                <p className="ml-3 text-xs lg:text-sm">{item.title}</p>
                            </Button>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
