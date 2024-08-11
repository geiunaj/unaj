"use client";

import {Skeleton} from "../ui/skeleton";

export default function SkeletonForm() {
    return (
        <div className="flex flex-col w-full gap-6 my-4">
            <div className="flex gap-4">
                <div className="flex flex-col gap-2 w-1/2">
                    <Skeleton className="h-4 w-1/3 rounded-lg"/>
                    <Skeleton className="h-7 w-full rounded-lg"/>
                </div>
                <div className="flex flex-col gap-2 w-1/2">
                    <Skeleton className="h-4 w-1/3 rounded-lg"/>
                    <Skeleton className="h-7 w-full rounded-lg"/>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-1/3 rounded-lg"/>
                <Skeleton className="h-7 w-full rounded-lg"/>
            </div>
            <div className="flex gap-4">
                <div className="flex flex-col gap-2 w-1/2">
                    <Skeleton className="h-4 w-1/3 rounded-lg"/>
                    <Skeleton className="h-7 w-full rounded-lg"/>
                </div>
                <div className="flex flex-col gap-2 w-1/2">
                    <Skeleton className="h-4 w-1/3 rounded-lg"/>
                    <Skeleton className="h-7 w-full rounded-lg"/>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-1/3 rounded-lg"/>
                <Skeleton className="h-16 w-full rounded-lg"/>
            </div>
            <div className="flex justify-end gap-6">
                <Skeleton className="h-8 w-1/4 rounded-lg"/>
                <Skeleton className="h-8 w-1/4 rounded-lg"/>
            </div>
        </div>
    );
}
