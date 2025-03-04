"use client";
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@repo/ui/components/ui/pagination";
import { cn } from "@repo/utils";
import { useRouter } from "next/navigation";
import React from "react";

export const Pagination: React.FC<{
  className?: string;
  page: number;
  totalPages: number;
}> = (props) => {
  const router = useRouter();

  const { className, page, totalPages } = props;
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const hasExtraPrevPages = page - 1 > 1;
  const hasExtraNextPages = page + 1 < totalPages;

  return (
    <div className={cn("my-12", className)}>
      <PaginationComponent>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              isActive={hasPrevPage}
              onClick={() => {
                router.push(`/articles/page/${page - 1}`);
              }}
            />
          </PaginationItem>

          {hasExtraPrevPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {hasPrevPage && (
            <PaginationItem>
              <PaginationLink
                onClick={() => {
                  router.push(`/articles/page/${page - 1}`);
                }}
              >
                {page - 1}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink
              isActive
              onClick={() => {
                router.push(`/articles/page/${page}`);
              }}
            >
              {page}
            </PaginationLink>
          </PaginationItem>

          {hasNextPage && (
            <PaginationItem>
              <PaginationLink
                onClick={() => {
                  router.push(`/articles/page/${page + 1}`);
                }}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          )}

          {hasExtraNextPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              isActive={hasNextPage}
              onClick={() => {
                router.push(`/articles/page/${page + 1}`);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationComponent>
    </div>
  );
};
