"use client";
import Link from "next/link";
import {CircleUser, Menu} from "lucide-react";
import {Button} from "@/components/ui/button";
import {signOut} from "next-auth/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {iconComponents, menu, MenuItem} from "@/lib/constants/menu";
import {useEffect, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import {Separator} from "./ui/separator";
import {useTheme} from "next-themes";
import * as React from "react";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import usePageTitle from "@/lib/stores/titleStore.store";
import TitleUpdater from "@/components/TitleUpdater";

export default function Header() {
    const logo = "/img/logoUNAJ.png";
    const router = useRouter();
    const pathname = usePathname();
    const [itemActive, setItemActive] = useState<string>("");
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);

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

    const handleSignOut = async () => {
        await signOut({redirect: false, callbackUrl: "/"});
        await signOut({redirect: false, callbackUrl: "/"});
    };

    const handleAccount = async () => {
        router.push("/cuenta");
    };

    const className = (classname: string, href: string) => {
        return `${classname} ${
            itemActive === href ? "text-primary" : "text-muted-foreground"
        }`;
    };

    const classNameAccordion = (classname: string, href: string) => {
        return `${classname} ${
            itemActive === href ? "text-white" : "text-muted-foreground"
        }`;
    };

    const handleAccordionChange = (value: string | null) => {
        setOpenAccordion(value ? value : null);
    };

    const {setTheme} = useTheme();
    const {titleHeader} = usePageTitle();

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
            className="flex h-14 justify-between md:justify-center items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                        <Menu className="h-5 w-5"/>
                        <span className="sr-only">Botón del Menú</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col p-4">
                    <SheetHeader>
                        <SheetTitle>
                            <Link
                                href="/"
                                className="w-full flex justify-evenly items-center gap-2 pt-4"
                            >
                                {/* <Calculator className="h-5" /> */}
                                <div className="flex items-center justify-around gap-3">
                                    <p className="text-primary text-3xl font-black">UNAJ</p>
                                    <Separator orientation="vertical" className="h-8"/>
                                    <div
                                        className="flex flex-col text-muted-foreground text-center text-xs font-medium">
                                        <p>Calculadora de</p>
                                        <p>Huella Ecológica</p>
                                    </div>
                                </div>
                            </Link>
                        </SheetTitle>
                        <SheetDescription/>
                    </SheetHeader>

                    <nav className="grid items-start px-2 text-sm font-medium overflow-hidden">
                        {menu.map((item) => {
                            const Icon = iconComponents[item.icon];
                            const isAccordionOpen = openAccordion === item.title;

                            return item.items ? (
                                <Accordion
                                    key={item.title}
                                    type="single"
                                    collapsible
                                    value={isAccordionOpen ? item.title : ""}
                                    className={isAccordionOpen ? "bg-muted rounded" : ""}
                                    onValueChange={(value) => handleAccordionChange(value)}
                                >
                                    <AccordionItem className="border-0" value={item.title}>
                                        <AccordionTrigger
                                            className="w-full px-4 py-2 justify-between items-center text-muted-foreground hover:text-primary hover:no-underline"
                                        >
                                            <div className="flex items-center">
                                                <Icon className="mr-2 h-4 w-4"/>
                                                <p className="ml-3 text-xs lg:text-sm">
                                                    {item.title}
                                                </p>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            {item.items.map((subItem) => {
                                                const Icon = iconComponents[subItem.icon];
                                                return (
                                                    <Button
                                                        key={subItem.title}
                                                        variant={itemActive === subItem.href ? "default" : "ghost"}
                                                        className={
                                                            itemActive !== subItem.href ? classNameAccordion(
                                                                "w-full justify-start hover:text-primary",
                                                                subItem.href
                                                            ) : classNameAccordion(
                                                                "w-full justify-start hover:text-white",
                                                                subItem.href
                                                            )
                                                        }
                                                        onClick={() => handleItemClick(subItem)}
                                                    >
                                                        <Icon className="mr-2 h-4 w-4"/>
                                                        <p className="ml-3 text-xs lg:text-sm">{subItem.title}</p>
                                                    </Button>
                                                );
                                            })}
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            ) : (
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
                </SheetContent>
            </Sheet>

            <div className="max-w-screen-xl flex items-center justify-between w-full">
                <div>
                    <h1 className="text-lg text-muted-foreground font-medium">
                        {titleHeader}
                        <TitleUpdater/>
                    </h1>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="aspect-square w-15 rounded-full"
                        >
                            <CircleUser className="h-5 w-5"/>
                            <span className="sr-only">Menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem className="text-xs" onClick={handleAccount}>Cuenta</DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuGroup>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger className="text-xs">
                                    Tema
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem
                                            className="text-xs"
                                            onClick={() => setTheme("light")}
                                        >
                                            Claro
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="text-xs"
                                            onClick={() => setTheme("dark")}
                                        >
                                            Oscuro
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="text-xs"
                                            onClick={() => setTheme("system")}
                                        >
                                            Sistema
                                        </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                        </DropdownMenuGroup>
                        <DropdownMenuItem className="text-xs" onClick={handleSignOut}>
                            Cerrar Sesión
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
