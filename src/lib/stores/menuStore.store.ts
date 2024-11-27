import create from 'zustand';
import {menuItems} from "@/lib/constants/menu"; // Asegúrate de tener los elementos de menú en esta constante

interface MenuItem {
    id: number;
    title: string;
    icon: string;
    href: string;
    items?: MenuItem[];
}

interface MenuStore {
    menuFiltered: MenuItem[];
    linkPermitido: number[];
    setLinkPermitido: (permissions: number[]) => void;
    getFilteredMenu: () => void;
}

export const useMenuStore = create<MenuStore>((set) => ({
    menuFiltered: [],
    linkPermitido: [],
    setLinkPermitido: (permissions: number[]) => {
        set({linkPermitido: permissions});
        useMenuStore.getState().getFilteredMenu();
    },
    getFilteredMenu: () => {
        const {linkPermitido} = useMenuStore.getState();
        useMenuStore.getState().menuFiltered = menuItems.filter((item): boolean => {
            if (item.items) {
                const itemsFiltered = item.items.filter(subItem => linkPermitido.includes(subItem.id));
                item.items = itemsFiltered;
                return itemsFiltered.length > 0;
            }
            return linkPermitido.includes(item.id);
        });
    },
}));
