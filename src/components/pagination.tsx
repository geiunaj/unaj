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
        const pages = [];
        let addedStartEllipsis = false;
        let addedEndEllipsis = false;

        for (let i = 1; i <= totalPages; i++) {
            if (i === page || i === page - 1 || i === page + 1) {
                pages.push(
                    <PaginationItem
                        className="cursor-pointer"
                        key={i}
                    >
                        <PaginationLink
                            className={`hover:bg-muted ${
                                i === page ? "bg-primary text-white" : ""
                            }`}
                            isActive={i === page}
                            onClick={() => handlePageClick(i)}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            } else if (i < page - 1 && !addedStartEllipsis) {
                pages.push(
                    <PaginationItem className="cursor-pointer" key="startEllipsis">
                        <PaginationEllipsis/>
                    </PaginationItem>
                );
                addedStartEllipsis = true;
            } else if (i > page + 1 && !addedEndEllipsis) {
                pages.push(
                    <PaginationItem className="cursor-pointer" key="endEllipsis">
                        <PaginationEllipsis/>
                    </PaginationItem>
                );
                addedEndEllipsis = true;
            }
        }

        return pages;
    };

    return (
        <Pagination className="flex justify-center mt-4">
            <PaginationContent>

                <PaginationItem className="cursor-pointer">
                    <PaginationPrevious
                        className={page > 1 ? "" : "hover:text-muted-foreground text-muted-foreground cursor-default"}
                        onClick={page > 1 ? handlePreviousClick : () => {
                        }}
                    />
                </PaginationItem>

                {generatePageNumbers()}

                <PaginationItem className="cursor-pointer">
                    <PaginationNext
                        className={page < totalPages ? "" : "hover:text-muted-foreground text-muted-foreground cursor-default"}
                        onClick={page < totalPages ? handleNextClick : () => {
                        }}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}

const className = (className: string) => {
    return className;
}