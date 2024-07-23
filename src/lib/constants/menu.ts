export interface MenuItem {
    title: string;
    icon: string;
    href: string;
    items?: MenuItem[];
}

export const menu: MenuItem[] = [
    {
        title: "Inicio",
        icon: "Home",
        href: "/home",
    },
    {
        title: "Combustión",
        icon: "Flame",
        href: "/combustion",
        items: [
            {
                title: "Combustión Estacionaria",
                icon: "Flame",
                href: "/combustion-estacionaria",
            },
            {
                title: "Combustión Móvil",
                icon: "Flame",
                href: "/combustion-movil",
            },
            {
                title: "Cálculos",
                icon: "Flame",
                href: "/combustion",
            }
        ],
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
    }
];