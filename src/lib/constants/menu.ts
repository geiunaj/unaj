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
    FireExtinguisher,
    Plane,
    Bus,
    Fuel,
    Calendar,
    LampDesk,
} from "lucide-react";

export interface MenuItem {
    id: number;
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
    FireExtinguisher,
    Plane,
    Bus,
    Fuel,
    Calendar,
    LampDesk,
};

export const STEP_NUMBER = 0.00000000000000001;

export const menuItems: MenuItem[] = [
    {
        id: 1,
        title: "Resumen",
        icon: "Home",
        href: "/home",
    },
    {
        id: 2,
        title: "Categoria 1",
        icon: "Flame",
        href: "/",
        items: [
            {
                id: 3,
                title: "Combustión Móvil",
                icon: "Fuel",
                href: "/combustion-movil",
            },
            {
                id: 4,
                title: "Combustión Estacionaria",
                icon: "Flame",
                href: "/combustion-estacionaria",
            },
            {
                id: 5,
                title: "Fertilizante",
                icon: "Bean",
                href: "/fertilizante",
            },
            {
                id: 6,
                title: "Extintores",
                icon: "FireExtinguisher",
                href: "/extintor",
            },
        ],
    },
    {
        id: 7,
        title: "Categoria 2",
        icon: "Zap",
        href: "/",
        items: [
            {
                id: 8,
                title: "Consumo de Energía",
                icon: "Zap",
                href: "/electricidad",
            },
        ],
    },
    {
        id: 9,
        title: "Categoria 3",
        icon: "CarTaxiFront",
        href: "/",
        items: [
            {
                id: 10,
                title: "Transporte Aéreo",
                icon: "Plane",
                href: "/transporte-aereo",
            },
            {
                id: 11,
                title: "Transporte Terrestre",
                icon: "Bus",
                href: "/transporte-terrestre",
            },
            {
                id: 12,
                title: "Taxis",
                icon: "CarTaxiFront",
                href: "/taxi",
            },
            {
                id: 13,
                title: "Transporte Casa-Trabajo",
                icon: "Car",
                href: "/transporte-casa-trabajo",
            },
        ],
    },
    {
        id: 14,
        title: "Categoria 4",
        icon: "FileText",
        href: "/",
        items: [
            {
                id: 15,
                title: "Consumo de Papel",
                icon: "FileText",
                href: "/papel",
            },
            {
                id: 16,
                title: "Consumo de Agua",
                icon: "Droplets",
                href: "/consumo-agua",
            },
            {
                id: 17,
                title: "Activos Fijos",
                icon: "LampDesk",
                href: "/activos-fijos",
            },
            {
                id: 18,
                title: "Consumibles Generales",
                icon: "Milk",
                href: "/consumible",
            },
        ],
    },
    {
        id: 19,
        title: "Factores",
        icon: "FlaskConical",
        href: "/",
        items: [
            {
                id: 20,
                title: "Factores de Combustibles",
                icon: "Flame",
                href: "/tipo-combustible-factor",
            },
            {
                id: 21,
                title: "Factor de Fertilizante",
                icon: "Sprout",
                href: "/fertilizante-factor",
            },
            {
                id: 22,
                title: "Factor de Emision SEIN",
                icon: "PlugZap",
                href: "/factor-emision-SEIN",
            },
            {
                id: 23,
                title: "Factores de Consumibles",
                icon: "Milk",
                href: "/tipo-consumible-factor",
            },
            {
                id: 24,
                title: "Factores de Activos",
                icon: "LampDesk",
                href: "/tipo-activo-factor",
            },
            {
                id: 25,
                title: "Factor de Transporte Aereo",
                icon: "Plane",
                href: "/transporte-aereo-factor",
            },
            {
                id: 26,
                title: "Factor de Transporte Terrestre",
                icon: "Bus",
                href: "/transporte-terrestre-factor",
            },
            {
                id: 27,
                title: "Factor de Vehículo",
                icon: "Car",
                href: "/tipo-vehiculo-factor",
            },
            {
                id: 28,
                title: "Factor de Extintor",
                icon: "FireExtinguisher",
                href: "/extintor-factor",
            },
        ],
    },
    {
        id: 29,
        title: "Configuraciones",
        icon: "Settings",
        href: "/settings",
        items: [
            {
                id: 30,
                title: "Tipos de Activos",
                icon: "LampDesk",
                href: "/tipo-activo",
            },
            {
                id: 31,
                title: "Tipo de Papel",
                icon: "Scroll",
                href: "/tipo-papel",
            },
            {
                id: 32,
                title: "Tipos de Combustible",
                icon: "Flame",
                href: "/tipo-combustible",
            },
            {
                id: 33,
                title: "Tipos de Vehículo",
                icon: "Car",
                href: "/tipo-vehiculo",
            },
            {
                id: 34,
                title: "Tipos de Consumible",
                icon: "Milk",
                href: "/tipo-consumible",
            },
            {
                id: 35,
                title: "Tipos de Fertilizantes",
                icon: "Sprout",
                href: "/tipo-fertilizante",
            },
            {
                id: 36,
                title: "Area",
                icon: "MapPinned",
                href: "/area",
            },
            {
                id: 37,
                title: "GPW",
                icon: "Gauge",
                href: "/gpw",
            },
            {
                id: 38,
                title: "Años",
                icon: "Calendar",
                href: "/anio",
            },
            {
                id: 39,
                title: "Usuarios",
                icon: "UserRound",
                href: "/usuarios",
            },
            {
                id: 40,
                title: "Roles",
                icon: "UserRound",
                href: "/roles",
            },
        ],
    },
];
