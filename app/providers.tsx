'use client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/(landing)/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AppwriteAuthContext";
import { Toaster } from "@/(landing)/components/ui/toaster";
import { Toaster as Sonner } from "@/(landing)/components/ui/sonner";
import HTMLAttributeUpdater from "@/components/HTMLAttributeUpdater";
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
          <AuthProvider>
            <HTMLAttributeUpdater />
            <Toaster />
            <Sonner />
            {children}
          </AuthProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
