'use client'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface TokenPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function TokenPagination({ currentPage, totalPages, onPageChange }: TokenPaginationProps) {
    if (totalPages <= 1) return null;
    
    return (
        <Pagination className="mt-4">
            <PaginationContent className="flex justify-center space-x-2">
                <PaginationItem>
                    <PaginationPrevious 
                        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                        className={`text-blue-500 hover:text-blue-600 text-sm ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`} 
                    />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                        pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                    } else {
                        pageNumber = currentPage - 2 + i;
                    }
                    
                    return (
                        <PaginationItem key={i}>
                            <PaginationLink 
                                onClick={() => onPageChange(pageNumber)}
                                isActive={currentPage === pageNumber}
                                className={`text-sm ${currentPage === pageNumber ? 'bg-blue-500 text-white' : 'text-blue-500'}`}
                            >
                                {pageNumber}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                    <PaginationItem>
                        <PaginationEllipsis className="text-gray-500 text-sm" />
                    </PaginationItem>
                )}
                
                <PaginationItem>
                    <PaginationNext 
                        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                        className={`text-blue-500 hover:text-blue-600 text-sm ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}`} 
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
