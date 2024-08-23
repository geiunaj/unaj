"use client";

import {Skeleton} from "../ui/skeleton";

export default function LayoutSkeleton() {
    return (
        <div className="flex h-screen">
            <div className="border-e h-full w-80 p-4 flex flex-col gap-8">
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
            <div className="flex flex-col flex-auto w-full  bg-muted/40">
                <div className="flex justify-end items-center p-2 gap-4">
                    <div className="flex flex-col items-end gap-2">
                        <Skeleton className="h-4 w-40 rounded-lg"/>
                        <Skeleton className="h-2 w-64 rounded-sm"/>
                    </div>
                    <Skeleton className="h-12 w-12 rounded-full"/>
                </div>
                <div
                    className="flex-auto m-4 flex justify-center items-center p-6 bg-transparent rounded-xl shadow">
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
                </div>
            </div>
        </div>
    );
}
