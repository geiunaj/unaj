// lib/utils/findMenuItem.ts
import { MenuItem } from "@/lib/constants/menu";

export const findMenuItem = (
  menu: MenuItem[],
  path: string
): MenuItem | undefined => {
  for (const item of menu) {
    if (item.href === path) {
      return item;
    }
    if (item.items) {
      const foundItem = findMenuItem(item.items, path);
      if (foundItem) {
        return foundItem;
      }
    }
  }
  return undefined;
};
