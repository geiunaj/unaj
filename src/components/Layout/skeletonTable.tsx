"use client";

import {Skeleton} from "../ui/skeleton";

export default function SkeletonTable() {
    return (
        <div className="w-full max-w-[1150px] h-full ">
            <div className="flex w-full">
                <div className="flex flex-col gap-2 w-1/2">
                    <Skeleton className="h-5 w-64 rounded-lg"/>
                    <Skeleton className="h-4 w-48 rounded-lg"/>
                </div>
                <div className="flex justify-end items-end gap-4 w-1/2">
                    <Skeleton className="h-5 w-28 rounded-lg"/>
                    <Skeleton className="h-5 w-28 rounded-lg"/>
                    <Skeleton className="h-5 w-28 rounded-lg"/>
                    <Skeleton className="h-5 w-28 rounded-lg"/>
                </div>
            </div>

            <div className="flex flex-col gap-5 mt-24">
                <div className="flex justify-between">
                    <Skeleton className="h-6 w-32 rounded-lg"/>
                    <Skeleton className="h-6 w-32 rounded-lg"/>
                    <Skeleton className="h-6 w-32 rounded-lg"/>
                    <Skeleton className="h-6 w-32 rounded-lg"/>
                    <Skeleton className="h-6 w-32 rounded-lg"/>
                    <Skeleton className="h-6 w-32 rounded-lg"/>
                    <Skeleton className="h-6 w-32 rounded-lg"/>
                </div>
                <div className="flex flex-col gap-5">
                    <Skeleton className="h-6 w-full rounded-lg"/>
                    <Skeleton className="h-6 w-full rounded-lg"/>
                    <Skeleton className="h-6 w-full rounded-lg"/>
                    <Skeleton className="h-6 w-full rounded-lg"/>
                    <Skeleton className="h-6 w-full rounded-lg"/>
                    <Skeleton className="h-6 w-full rounded-lg"/>
                    <Skeleton className="h-6 w-full rounded-lg"/>
                </div>
            </div>
        </div>
    );
}
