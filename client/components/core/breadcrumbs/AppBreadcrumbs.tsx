"use client";

import React, { useCallback } from "react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import AppLink from "@/components/core/link/AppLink";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem as UiBreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

interface RedirectConfig {
  path: string;
  params?: Record<string, string>;
  isGoBack?: boolean;
}

export interface BreadcrumbItem {
  label?: string;
  redirect?: RedirectConfig;
}

interface AppBreadcrumbsProps {
  data: BreadcrumbItem[];
  className?: string;
}

export default function AppBreadcrumbs({ data, className }: AppBreadcrumbsProps) {
  const router = useRouter();

  const renderLabel = useCallback(
    (item: BreadcrumbItem) => {
      return item.label;
    },
    []
  );

  if (!data || data.length === 0) return null;
  return (
    <Breadcrumb className={clsx("mb-3 text-gp-black", className)}>
      <BreadcrumbList>
        {data.map((item, index) => {
          const isLast = index === data.length - 1;
          const label = renderLabel(item);

          return (
            <React.Fragment key={index}>
              <UiBreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-gp-green font-medium">
                    {label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <AppLink
                      asLink
                      href={getPath(item.redirect)}
                      onClick={(e) => {
                        if (item.redirect?.isGoBack) {
                          e.preventDefault();
                          router.back();
                        }
                      }}
                      noUnderline
                      className="inline-flex items-center text-sm font-medium text-gp-brown hover:text-gp-green transition-colors"
                    >
                      {label}
                    </AppLink>
                  </BreadcrumbLink>
                )}
              </UiBreadcrumbItem>

              {!isLast && (
                <BreadcrumbSeparator className="text-gp-brown/70" />
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

/* -----------------------------------------------------------
   Utility: Build final path with :params + ?query
------------------------------------------------------------*/
function getPath(redirect?: RedirectConfig): string {
  if (!redirect) return "#";

  let path = redirect.path;
  const query: Record<string, string> = {};

  if (redirect.params) {
    Object.entries(redirect.params).forEach(([key, value]) => {
      if (path.includes(`:${key}`)) {
        path = path.replace(`:${key}`, value);
      } else {
        query[key] = value;
      }
    });
  }

  const qs = Object.keys(query).length
    ? `?${new URLSearchParams(query).toString()}`
    : "";

  return `${path}${qs}`;
}