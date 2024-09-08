"use client";

import {Skeleton} from "../ui/skeleton";

export default function LayoutSkeleton() {
    return (
        <div className="flex h-screen">
            <div className="hidden sm:flex border-e h-full w-80 p-4 flex-col gap-8">
                <Skeleton className="h-12 w-full rounded-lg"/>
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-5 w-40 rounded-lg"/>
                    <Skeleton className="h-6 w-full rounded-lg"/>
                    <Skeleton className="h-6 w-full rounded-lg"/>
                    <Skeleton className="h-6 w-full rounded-lg"/>
                </div>
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-5 w-40 rounded-lg"/>
                    <Skeleton className="h-6 w-full rounded-lg"/>
                    <Skeleton className="h-6 w-full rounded-lg"/>
                    <Skeleton className="h-6 w-full rounded-lg"/>
                    <Skeleton className="h-6 w-full rounded-lg"/>
                    <Skeleton className="h-6 w-full rounded-lg"/>
                    <Skeleton className="h-6 w-full rounded-lg"/>
                    <Skeleton className="h-6 w-full rounded-lg"/>
                    <Skeleton className="h-6 w-full rounded-lg"/>
                    <Skeleton className="h-6 w-full rounded-lg"/>
                </div>
            </div>
            <div className="flex flex-col flex-auto w-full bg-muted/40">
                <div className="hidden sm:flex justify-end items-center p-2 gap-4">
                    <div className="flex flex-col items-end gap-2">
                        <Skeleton className="h-4 w-40 rounded-lg"/>
                        <Skeleton className="h-2 w-64 rounded-sm"/>
                    </div>
                    <Skeleton className="h-12 w-12 rounded-full"/>
                </div>
                <div className="flex sm:hidden justify-between items-center p-2 gap-4">
                    <Skeleton className="h-8 w-8 rounded-lg"/>
                    <Skeleton className="h-8 w-32 rounded-lg"/>
                    <Skeleton className="h-8 w-8 rounded-full"/>
                </div>
                <div
                    className="flex-auto m-2 flex justify-center items-center p-2 bg-primary-foreground rounded-xl shadow">
                    <div className="w-full max-w-[1150px] h-full">
                        <div className="flex w-full flex-col gap-4 sm:flex-row">
                            <div className="flex flex-col gap-2 sm:w-1/2">
                                <Skeleton className="h-5 w-64 rounded-lg"/>
                                <Skeleton className="h-4 w-48 rounded-lg"/>
                            </div>
                            <div className="flex justify-end items-end gap-4 sm:w-1/2">
                                <Skeleton className="h-5 w-28 rounded-lg"/>
                                <Skeleton className="h-5 w-28 rounded-lg"/>
                                <Skeleton className="h-5 w-28 rounded-lg"/>
                                <Skeleton className="h-5 w-28 rounded-lg"/>
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
                </div>
            </div>
        </div>
    );
}
