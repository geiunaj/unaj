"use client";
import Link from "next/link";
import {
    CircleUser,
    Home,
    LineChart,
    Menu,
    Package,
    Package2,
    ShoppingCart,
    Users,
} from "lucide-react";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {iconComponents, menu, MenuItem} from "@/lib/constants/menu";
import {useEffect, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import {Separator} from "./ui/separator";

export default function Header() {
    const logo = "/img/logoUNAJ.png";
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
        // <div className="flex justify-between items-center p-3">
        //   {/* <div className="flex items-center">
        //     <img src={logo} className="w-[178px] h-[55px]" alt="logo" />
        //   </div> */}

        // </div>
        // <div className="flex items-center justify-end space-x-5 p-2">
        //   <div className="flex flex-col justify-end items-end">
        //     <h1 className="font-medium">Admin User</h1>
        //     <p className="text-xs text-gray-400">adminuser@example.com</p>
        //   </div>
        //   <Avatar>
        //     <AvatarFallback>NC</AvatarFallback>
        //   </Avatar>
        // </div>

        <header
            className="flex h-14 justify-between md:justify-end items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                        <Menu className="h-5 w-5"/>
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col p-4">
                    <Link
                        href="/"
                        className="w-full flex justify-evenly items-center gap-2 pt-4"
                    >
                        {/* <Calculator className="h-5" /> */}
                        <div className="flex items-center justify-around gap-3">
                            <p className="text-blue-700 text-3xl font-black">UNAJ</p>
                            <Separator orientation="vertical" className="h-8"/>
                            <div className="flex flex-col text-gray-600 text-center text-xs font-medium">
                                <p>Calculadora de</p>
                                <p>Huella Ecológica</p>
                            </div>
                        </div>
                    </Link>
                    <nav className="grid items-start text-sm font-medium">
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
                                    <Icon className=" h-4 w-4"/>
                                    <p className="ml-3 text-sm">{item.title}</p>
                                </Button>
                            );
                        })}
                    </nav>
                </SheetContent>
            </Sheet>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="rounded-full">
                        <CircleUser className="h-5 w-5"/>
                        <span className="sr-only">Toggle user menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-xs">Cuenta</DropdownMenuItem>
                    <DropdownMenuItem className="text-xs">Ajutes</DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem className="text-xs">Cerrar Sesión</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}
