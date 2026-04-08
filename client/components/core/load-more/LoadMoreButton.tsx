"use client";

import clsx from "clsx";
import useInfiniteScroll from "react-infinite-scroll-hook";

import AppSpinner from "@/components/core/Spinner/AppSpinner";
import AppButton from "@/components/core/button/AppButton";

interface GpLoadMoreButtonProps {
  loadMore: () => void;                // callback to load more
  loading: boolean;                    // currently loading
  totalCount: number;                  // total items on server
  loadedCount: number;                 // currently loaded items
  noMargin?: boolean;                  // disable top spacing
  loaderType?: "button" | "infinite";  // choose style
}

export default function GpLoadMoreButton({
  loadMore,
  loading,
  totalCount,
  loadedCount,
  noMargin = false,
  loaderType = "infinite",
}: GpLoadMoreButtonProps) {

  const hasNext = loadedCount < totalCount;

  const [infiniteRef] = useInfiniteScroll({
    loading,
    hasNextPage: hasNext,
    onLoadMore: loadMore,
    disabled: false,
    rootMargin: "0px 0px 400px 0px", // start fetching early
  });

  /* ------------------------------------------------------------
   * 1. Infinite Scroll Mode
   * ---------------------------------------------------------- */
  if (loaderType === "infinite") {
    return (
      <div
        ref={infiniteRef}
        className={clsx(
          "flex justify-center w-full",
          !noMargin && "mt-6"
        )}
      >
        {loading ? (
          <AppSpinner size="sm" />
        ) : (
          <span className="text-sm text-[var(--gp-text-muted)]">
            {("loaded")} {loadedCount} / {totalCount}
          </span>
        )}
      </div>
    );
  }

  /* ------------------------------------------------------------
   * 2. Button Mode
   * ---------------------------------------------------------- */
  return (
    <div
      className={clsx(
        "flex justify-center w-full",
        !noMargin && "mt-6"
      )}
    >
      <AppButton
        variant="outline"
        color="neutral"
        size="sm"
        onClick={loadMore}
        loading={loading}
        disabled={loading || !hasNext}
      >
        {loading
          ? ("loading")
          : `${("loadMore")} ${loadedCount}/${totalCount}`}
      </AppButton>
    </div>
  );
}