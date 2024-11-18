"use client";

import {Skeleton} from "../ui/skeleton";

export default function SkeletonTable() {
    return (
        <div className="w-full max-w-screen-xl h-full">
            <div className="flex w-full justify-between sm:flex-row gap-2">
                <div className="flex flex-col sm:flex-row gap-2 w-1/2">
                    <Skeleton className="h-6 w-full rounded-lg"/>
                    <Skeleton className="h-6 w-full rounded-lg"/>
                    <Skeleton className="h-6 w-full rounded-lg"/>
                    <Skeleton className="h-6 w-full rounded-lg"/>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:w-fit w-1/2">
                    <Skeleton className="h-6 w-20 rounded-lg"/>
                    <Skeleton className="h-6 w-20 rounded-lg"/>
                    <Skeleton className="h-6 w-28 rounded-lg"/>
                    <Skeleton className="h-6 w-32 rounded-lg"/>
                </div>
            </div>

            <div className="flex flex-col gap-5 mt-10 sm:mt-24">
                <div className="flex justify-between">
                    <Skeleton className="h-6 w-28 sm:w-32 rounded-lg"/>
                    <Skeleton className="h-6 w-28 sm:w-32 rounded-lg"/>
                    <Skeleton className="h-6 w-28 sm:w-32 rounded-lg"/>
                    <Skeleton className="h-6 hidden sm:flex sm:w-32 rounded-lg"/>
                    <Skeleton className="h-6 hidden sm:flex sm:w-32 rounded-lg"/>
                    <Skeleton className="h-6 hidden sm:flex sm:w-32 rounded-lg"/>
                    <Skeleton className="h-6 hidden sm:flex sm:w-32 rounded-lg"/>
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
