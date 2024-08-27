import {useRouter, usePathname} from "next/navigation";
import {Button} from "./ui/button";
import {iconComponents, menu, MenuItem} from "@/lib/constants/menu";
import {useState, useEffect} from "react";
import Link from "next/link";
import {Separator} from "./ui/separator";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function Sidebar() {
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

        const menuItem = menu.find((item) =>
            item.items?.some((subItem) => subItem.href === path)
        );
        if (menuItem) {
            setOpenAccordion(menuItem.title);
        } else {
            setOpenAccordion(null);
        }
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
                    <div className="flex items-center justify-around gap-3">
                        <p className="text-blue-700 text-3xl font-black">UNAJ</p>
                        <Separator orientation="vertical" className="h-8"/>
                        <div
                            className="flex flex-col text-muted-foreground text-center text-[10px] xl:text-xs font-medium">
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
                        const isAccordionOpen = openAccordion === item.title;

                        return item.items ? (
                            <Accordion
                                key={item.title}
                                type="single"
                                collapsible
                                value={isAccordionOpen ? item.title : ""}
                                className={isAccordionOpen ? "bg-muted" : ""}
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
            </div>
        </div>
    );
}