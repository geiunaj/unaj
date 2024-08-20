import {
    Home,
    Truck,
    Flame,
    Droplet,
    Zap,
    FileText,
    Bean,
    Car,
    Scroll,
    Sprout,
    Settings,
    MapPinned
} from "lucide-react";

export interface MenuItem {
    title: string;
    icon: string;
    href: string;
    items?: MenuItem[];
}

export const iconComponents: Record<string, any> = {
    Home,
    Flame,
    Truck,
    Droplet,
    Zap,
    FileText,
    Bean,
    Car,
    Scroll,
    Sprout,
    Settings,
    MapPinned
};

export const menu: MenuItem[] = [
    {
        title: "Inicio",
        icon: "Home",
        href: "/home",
    },
    {
        title: "Combustión Estacionaria",
        icon: "Flame",
        href: "/combustion-estacionaria",
    },
    {
        title: "Combustión Móvil",
        icon: "Car",
        href: "/combustion-movil",
    },
    {
        title: "Fertilizante",
        icon: "Bean",
        href: "/fertilizante",
    },
    {
        title: "Consumo de Electricidad",
        icon: "Zap",
        href: "/electricidad",
    },
    {
        title: "Consumo de Papel",
        icon: "FileText",
        href: "/papel",
    },
    {
        title: "Taxis Contratados",
        icon: "FileText",
        href: "/taxi",
    },
    {
        title: "Configuraciones",
        icon: "Settings",
        href: "/settings",
        items: [
            {
                title: "Tipo de Papel",
                icon: "Scroll",
                href: "/tipoPapel",
            },
            {
                title: "Tipos de Combustible",
                icon: "Flame",
                href: "/tipoCombustible",
            },
            {
                title: "Tipos de Fertilizantes",
                icon: "Sprout",
                href: "/tipoFertilizante",
            },
            {
                title: "Area",
                icon: "MapPinned",
                href: "/area",
            },
            {
                title: "Usuarios",
                icon: "MapPinned",
                href: "/user",
            },
        ]
    },

];
