// components/ui/DynamicBreadcrumbs.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { menu } from "@/lib/constants/menu";
import { findMenuItem } from "@/lib/utils/findMenuItem";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const DynamicBreadcrumbs = () => {
  const pathname = usePathname();
  const pathArray = pathname.split("/").filter((path) => path !== "");

  const generateBreadcrumbs = () => {
    const breadcrumbs = [];
    let accumulatedPath = "";

    for (let i = 0; i < pathArray.length; i++) {
      accumulatedPath += `/${pathArray[i]}`;
      const menuItem = findMenuItem(menu, accumulatedPath);

      if (menuItem) {
        breadcrumbs.push(
          <React.Fragment key={menuItem.href}>
            {i > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {i === pathArray.length - 1 ? (
                <BreadcrumbPage>{menuItem.title}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink>
                  <Link href={menuItem.href}>{menuItem.title}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        );
      }
    }

    return breadcrumbs;
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>{generateBreadcrumbs()}</BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBreadcrumbs;
