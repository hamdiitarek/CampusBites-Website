'use client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/(landing)/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Toaster } from "@/(landing)/components/ui/toaster";
import { Toaster as Sonner } from "@/(landing)/components/ui/sonner";
import { useState } from "react";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <Toaster />
          <Sonner />
          {children}
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
