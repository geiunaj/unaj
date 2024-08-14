import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
    meta: {
        page: number;
        perPage: number;
        totalPages: number;
        totalRecords: number;
    };
    onPageChange: (page: number) => void;
}

export default function CustomPagination({meta, onPageChange}: PaginationProps) {
    const {page, totalPages} = meta;

    const handlePageClick = (pageNumber: number) => {
        onPageChange(pageNumber);
    };

    const handlePreviousClick = () => {
        if (page > 1) handlePageClick(page - 1);
    };

    const handleNextClick = () => {
        if (page < totalPages) handlePageClick(page + 1);
    };

    const generatePageNumbers = () => {
        const pages: any[] = [];

        for (let i = 1; i <= totalPages; i++) {
            if (i === page || i === page - 1 || i === page + 1) {
                pages.push(
                    <PaginationItem
                        className="cursor-pointer"
                        key={i}
                    >
                        <PaginationLink
                            // className={`hover:bg-blue-600 text-white ${
                            //     i === page ? "bg-[--blue] text-white" : ""
                            // }`}
                            isActive={i === page}
                            onClick={() => handlePageClick(i)}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            } else if (i < page - 1 && !pages.includes("startEllipsis")) {
                pages.push(
                    <PaginationItem className="cursor-pointer" key="startEllipsis">
                        <PaginationEllipsis/>
                    </PaginationItem>
                );
                pages.push(
                    <PaginationItem
                        className="cursor-pointer"
                        key={1}
                    >
                        <PaginationLink
                            // className="hover:bg-blue-400 text-white"
                            onClick={() => handlePageClick(1)}
                        >
                            1
                        </PaginationLink>
                    </PaginationItem>
                );
                pages.push("startEllipsis");
            } else if (i > page + 1 && !pages.includes("endEllipsis")) {
                pages.push(
                    <PaginationItem className="cursor-pointer" key="endEllipsis">
                        <PaginationEllipsis/>
                    </PaginationItem>
                );
                pages.push(
                    <PaginationItem
                        className="cursor-pointer"
                        key={totalPages}
                    >
                        <PaginationLink
                            // className="hover:bg-blue-400 text-white"
                            onClick={() => handlePageClick(totalPages)}
                        >
                            {totalPages}
                        </PaginationLink>
                    </PaginationItem>
                );
                pages.push("endEllipsis");
            }
        }

        return pages;
    };

    return (
        <Pagination className="flex justify-center mt-4">
            <PaginationContent>
                {page > 1 && (
                    <PaginationItem className="cursor-pointer">
                        <PaginationPrevious
                            // className="hover:bg-blue-400 text-white"
                            onClick={handlePreviousClick}
                        />
                    </PaginationItem>
                )}

                {generatePageNumbers()}

                {page < totalPages && (
                    <PaginationItem className="cursor-pointer">
                        <PaginationNext
                            // className="hover:bg-blue-400 text-white"
                            onClick={handleNextClick}
                        />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
}
