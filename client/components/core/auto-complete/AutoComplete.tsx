"use client";

import React, { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { debounce } from "lodash";
import { ChevronsUpDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import AppBadge from "@/components/core/badge/AppBadge";
import InpLabel from "@/components/core/form/AppLabel";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import LoadMoreButton from "@/components/core/load-more/LoadMoreButton";
import useScreenView from "@/hooks/useScreenView";

/* ------------------------------------------------------------
 * Types
 * ---------------------------------------------------------- */
interface AutoCompleteItem {
  label: string;
  value: { id: string; name: string } & Record<string, any>;
}

interface AutoCompleteProps {
  searchCallback: (
    query: string,
    isLoadMore?: boolean
  ) => Promise<AutoCompleteItem[]>;

  initialData: AutoCompleteItem[];
  onSelect: (
    item: AutoCompleteItem | AutoCompleteItem[],
    action: "add" | "remove"
  ) => void;

  placeholder?: string;
  label?: string;
  size?: "sm" | "lg";
  debounceTime?: number;
  multiSelect?: boolean;
  loadMoreLabel?: string;
  disabled?: boolean;
  className?: string;
  values?: AutoCompleteItem[];
  isRequired?: boolean;

  itemTemplate?: (item: AutoCompleteItem) => React.ReactNode;
}

/* ------------------------------------------------------------
 * Main Component
 * ---------------------------------------------------------- */
export default function GpAutoComplete({
  searchCallback,
  initialData,
  onSelect,
  placeholder = "Search…",
  multiSelect = false,
  debounceTime = 450,
  label,
  size = "sm",
  values = [],
  disabled,
  className,
  isRequired,
  itemTemplate,
}: AutoCompleteProps) {
  const { isMobile } = useScreenView();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [data, setData] = useState<AutoCompleteItem[]>(initialData);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  /* ------------------------------------------------------------
   * Sync initial data
   * ---------------------------------------------------------- */
  useEffect(() => {
    setData(initialData);
    setHasMore(initialData.length > 0);
  }, [initialData]);

  /* ------------------------------------------------------------
   * Reset on close
   * ---------------------------------------------------------- */
  useEffect(() => {
    if (!open) {
      setValue("");
      setHasSearched(false);
      setData(initialData);
      setHasMore(initialData.length > 0);
      setSearching(false);
    }
  }, [open, initialData]);

  /* ------------------------------------------------------------
   * Debounced Search
   * ---------------------------------------------------------- */
  const debouncedSearch = useCallback(
    debounce(async (q: string) => {
      setSearching(true);
      const results = await searchCallback(q);
      setData(results);
      setHasMore(results.length > 0);
      setSearching(false);
    }, debounceTime),
    [searchCallback, debounceTime]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  /* ------------------------------------------------------------
   * Load More
   * ---------------------------------------------------------- */
  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      const res = await searchCallback(value, true);
      if (res.length === 0) setHasMore(false);
      else setData((prev) => [...prev, ...res]);
    } catch (error) {
      console.error("Load more failed:", error);
    } finally {
      setLoadingMore(false);
    }
  };
  /* ------------------------------------------------------------
   * Select item
   * ---------------------------------------------------------- */
  const handleSelect = (item: AutoCompleteItem) => {
    onSelect(item, "add");
    if (!multiSelect) setOpen(false);
  };

  /* ------------------------------------------------------------
   * Command Content
   * ---------------------------------------------------------- */
  const commandContent = (
    <Command shouldFilter={false} className="w-full">
      <CommandInput
        value={value}
        onValueChange={(v) => {
          setValue(v);
          if (v.trim().length === 0) {
            setHasSearched(false);
            setData(initialData);
            return;
          }
          setHasSearched(true);
          debouncedSearch(v);
        }}
        placeholder={placeholder}
        className="h-9"
      />

      <CommandList>
        <CommandEmpty>
          {searching
            ? "Searching..."
            : hasSearched
            ? "No results found"
            : ""}
        </CommandEmpty>

        <CommandGroup>
          {data.map((item) => (
            <CommandItem
              key={item.value.id}
              value={item.value.id}
              onSelect={() => handleSelect(item)}
            >
              {itemTemplate ? itemTemplate(item) : item.label}
            </CommandItem>
          ))}

          {hasMore && data.length >= 10 && (
            <div className="flex justify-center py-2">
              <LoadMoreButton
                loadMore={handleLoadMore}
                loading={loadingMore}
                totalCount={data.length + 1}
                loadedCount={data.length}
                noMargin
              />
            </div>
          )}
        </CommandGroup>
      </CommandList>
    </Command>
  );

  /* ------------------------------------------------------------
   * Trigger Button
   * ---------------------------------------------------------- */
  const triggerButton = (
    <Button
      variant="outline"
      disabled={disabled}
      role="combobox"
      aria-expanded={open}
      className={clsx(
        "w-full bg-white justify-between",
        size === "sm" && "h-9",
        size === "lg" && "h-11"
      )}
    >
      <div className="flex items-center gap-2 flex-wrap w-full">
        {values.length > 0 ? (
          values.map((item) => (
            <AppBadge
              key={item.value.id}
              showClose
              onClose={() => onSelect(item, "remove")}
              className="mr-1"
            >
              {item.label}
            </AppBadge>
          ))
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}
        <ChevronsUpDown className="ml-auto opacity-60" />
      </div>
    </Button>
  );

  /* ------------------------------------------------------------
   * Render
   * ---------------------------------------------------------- */
  return (
    <div className={className}>
      {label && (
        <InpLabel size={size} isRequired={isRequired}>
          {label}
        </InpLabel>
      )}

      {isMobile ? (
        /* ---------------------- MOBILE (Drawer) ---------------------- */
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>

          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{label || "Search"}</DrawerTitle>
            </DrawerHeader>

            <div className="px-4 pb-4 min-h-[300px]">{commandContent}</div>
          </DrawerContent>
        </Drawer>
      ) : (
        /* ---------------------- DESKTOP (Popover) ---------------------- */
        <Popover modal open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 shadow-lg border border-[var(--gp-border)] rounded-md">
            {commandContent}
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}