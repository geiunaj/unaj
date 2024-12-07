import {useRouter, usePathname} from "next/navigation";
import {Button} from "./ui/button";
import {iconComponents, MenuItem} from "@/lib/constants/menu";
import {useState, useEffect} from "react";
import Link from "next/link";
import {Separator} from "./ui/separator";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {useMenuStore} from "@/lib/stores/menuStore.store";
import Image from "next/image";
import * as React from "react";
import {useTheme} from "next-themes";

export default function Sidebar() {
    const {theme, setTheme} = useTheme();
    const [resolvedTheme, setResolvedTheme] = useState(theme);
    const router = useRouter();
    const pathname = usePathname();
    const [itemActive, setItemActive] = useState<string>("");
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);

    const {menuFiltered} = useMenuStore();

    useEffect(() => {
        if (theme === "system") {
            const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setResolvedTheme(darkMode ? "dark" : "light");
        } else {
            setResolvedTheme(theme);
        }
    }, [theme]);

    const logo = resolvedTheme === "dark" ? "/img/GIEGEI1.png" : "/img/GIEGEI.png";

    useEffect(() => {
        const path = "/" + pathname.split("/")[1];
        if (path === "/") {
            setItemActive("/home");
            return;
        }
        setItemActive(path);

        const menuItem = menuFiltered.find((item) =>
            item.items?.some((subItem) => subItem.href === path)
        );
        if (menuItem) {
            setOpenAccordion(menuItem.title);
        } else {
            setOpenAccordion(null);
        }
    }, [pathname, menuFiltered]);

    const handleItemClick = (item: MenuItem) => {
        setItemActive(item.href);
        router.push(item.href);
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

    return (
        <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-2 lg:h-[60px] lg:px-3">
                <Link
                    href="/"
                    className="w-full flex justify-evenly items-center gap-2"
                >
                    {/*<div className="flex items-center justify-around gap-3">*/}
                    {/*    <p className="text-primary text-3xl font-black">UNAJ</p>*/}
                    {/*    <Separator orientation="vertical" className="h-8"/>*/}
                    {/*    <div*/}
                    {/*        className="flex flex-col text-muted-foreground text-center text-[10px] xl:text-xs font-medium">*/}
                    {/*        <p>Calculadora de</p>*/}
                    {/*        <p>Huella Ecológica</p>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    <Image
                        src={logo}
                        alt="Logo UNAJ"
                        className="h-12 w-auto md:h-9"
                        width={1000}
                        height={1000}
                    />
                </Link>
            </div>
            <div className="flex-1">
                <nav className="grid items-start px-2 text-xs font-medium overflow-hidden">
                    {menuFiltered.map((item) => {
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
                                            <Icon className="mr-2 h-3.5 w-3.5"/>
                                            <p className="ml-3 text-xs">
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
                                                            "w-full justify-start hover:text-primary h-8",
                                                            subItem.href
                                                        ) : classNameAccordion(
                                                            "w-full justify-start hover:text-white h-8",
                                                            subItem.href
                                                        )
                                                    }
                                                    onClick={() => handleItemClick(subItem)}
                                                >
                                                    <Icon className="mr-2 h-3.5 w-3.5"/>
                                                    <p className="ml-3 text-xs">{subItem.title}</p>
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
                                    "w-full justify-start hover:text-primary h-8",
                                    item.href
                                )}
                                onClick={() => handleItemClick(item)}
                            >
                                <Icon className="mr-2 h-3.5 w-3.5"/>
                                <p className="ml-3 text-xs">{item.title}</p>
                            </Button>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}