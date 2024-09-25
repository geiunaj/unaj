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
    MapPinned,
    Droplets,
    CarTaxiFront,
    UserRound,
    Gauge,
    FlaskConical,
    PlugZap,
    Milk,
    StretchHorizontal,
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
    MapPinned,
    Droplets,
    CarTaxiFront,
    UserRound,
    Gauge,
    FlaskConical,
    PlugZap,
    Milk,
    StretchHorizontal,
};

export const menu: MenuItem[] = [
    {
        title: "Inicio",
        icon: "Home",
        href: "/home",
    },
    {
        title: "Categoria 1",
        icon: "StretchHorizontal",
        href: "/",
        items: [
            {
                title: "Combustión Móvil",
                icon: "Car",
                href: "/combustion-movil",
            },
            {
                title: "Combustión Estacionaria",
                icon: "Flame",
                href: "/combustion-estacionaria",
            },
            {
                title: "Fertilizante",
                icon: "Bean",
                href: "/fertilizante",
            },
        ],
    },
    {
        title: "Categoria 2",
        icon: "StretchHorizontal",
        href: "/",
        items: [
            {
                title: "Consumo de Electricidad",
                icon: "Zap",
                href: "/electricidad",
            },
        ],
    },
    {
        title: "Categoria 3",
        icon: "StretchHorizontal",
        href: "/",
        items: [
            {
                title: "Taxis",
                icon: "CarTaxiFront",
                href: "/taxi",
            },
        ],
    },
    {
        title: "Categoria 4",
        icon: "StretchHorizontal",
        href: "/",
        items: [
            {
                title: "Consumo de Papel",
                icon: "FileText",
                href: "/papel",
            },
            {
                title: "Consumo de Agua",
                icon: "Droplets",
                href: "/consumoAgua",
            },
            {
                title: "Activos Fijos",
                icon: "FileText",
                href: "/activos",
            },
            {
                title: "Consumibles Generales",
                icon: "Milk",
                href: "/consumible",
            },
        ],
    },
    {
        title: "Factores",
        icon: "FlaskConical",
        href: "/",
        items: [
            {
                title: "Factores de Combustible",
                icon: "Flame",
                href: "/tipo-combustible-factor",
            },
            {
                title: "Factor de Fertilizante",
                icon: "Sprout",
                href: "/fertilizante-factor",
            },
            {
                title: "Factor de Emision SEIN",
                icon: "PlugZap",
                href: "/factor-emision-SEIN",
            },
        ],
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
                href: "/tipo-combustible",
            },
            {
                title: "Tipos de Consumible",
                icon: "Milk",
                href: "/tipo-consumible",
            },
            {
                title: "Tipos de Fertilizantes",
                icon: "Sprout",
                href: "/tipo-fertilizante",
            },
            {
                title: "Area",
                icon: "MapPinned",
                href: "/area",
            },
            {
                title: "GPW",
                icon: "Gauge",
                href: "/gpw",
            },
            {
                title: "Usuarios",
                icon: "UserRound",
                href: "/user",
            },
        ],
    },
];
