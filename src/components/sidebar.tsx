"use client";
import {useRouter, usePathname} from "next/navigation";
import {Button} from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuRadioGroup,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {menu, MenuItem} from "@/lib/constants/menu";
import {useState, useEffect} from "react";
import {
    Home,
    Truck,
    Flame,
    Droplet,
    Zap,
    FileText,
    Bean
} from "lucide-react";
import Image from "next/image";

// Mapea los nombres de los iconos a los componentes de los iconos importados
const iconComponents: Record<string, any> = {
    Home,
    Flame,
    Truck,
    Droplet,
    Zap,
    FileText,
    Bean
};

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const [itemActive, setItemActive] = useState<string>("");

    useEffect(() => {
        setItemActive(pathname);
    }, [pathname]);

    const handleItemClick = (item: MenuItem) => {
        setItemActive(item.href);
        router.push(item.href);
    };

    const isParentActive = (parent: MenuItem) => {
        return parent.items?.some((child) => child.href === pathname);
    };

    const logo = "/img/logoUNAJ.png";

    return (
        <div className="flex flex-col items-center p-4">
            <div className="flex justify-center mb-6 pt-4">
                <Image src={logo} alt="Logo" width={140} height={50}/>
            </div>
            <div className="flex flex-col gap-1 w-full pt-4">
                {menu.map((item) => {
                    const Icon = iconComponents[item.icon];
                    return item.items ? (
                        <DropdownMenu key={item.title}>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant={
                                        itemActive === item.href || isParentActive(item)
                                            ? "default"
                                            : "ghost"
                                    }
                                    className="w-full justify-start"
                                >
                                    <Icon className="mr-2 h-4 w-4"/>
                                    <p className="ml-3 text-sm">{item.title}</p>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-56 rounded-xl"
                                side="right"
                                sideOffset={5}
                            >
                                <DropdownMenuRadioGroup>
                                    {item.items.map((subItem) => {
                                        return (
                                            <DropdownMenuItem
                                                key={subItem.title}
                                                onClick={() => handleItemClick(subItem)}
                                            >
                                                {subItem.title}
                                            </DropdownMenuItem>
                                        );
                                    })}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button
                            key={item.title}
                            variant={itemActive === item.href ? "default" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => handleItemClick(item)}
                        >
                            <Icon className="mr-2 h-4 w-4"/>
                            <p className="ml-3 text-sm">{item.title}</p>
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}
