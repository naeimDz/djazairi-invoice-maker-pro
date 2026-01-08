import { useEffect, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { Toaster } from "@/shared/ui/toaster";
import { Toaster as Sonner } from "@/shared/ui/sonner";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import "./core/i18n";
import { SettingsProvider } from "./features/settings/hooks/useSettings";

const queryClient = new QueryClient();

// This component handles the instant sync between URL /ar and the document direction
const LanguageHandler = ({ children }: { children: React.ReactNode }) => {
  const { i18n } = useTranslation();
  const location = useLocation();

  useLayoutEffect(() => {
    const isArabic = location.pathname.startsWith('/ar');
    const lang = isArabic ? 'ar' : 'fr'; // Defaulting to 'fr' for LTR as requested before or 'en'
    const dir = isArabic ? 'rtl' : 'ltr';

    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }

    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    document.body.dir = dir;
  }, [location.pathname, i18n]);

  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SettingsProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <LanguageHandler>
              <Routes>
                {/* Arabic Routes */}
                <Route path="/ar" element={<Index view="invoices" />} />
                <Route path="/ar/settings" element={<Index view="settings" />} />
                <Route path="/ar/dashboard" element={<Index view="dashboard" />} />
                <Route path="/ar/help" element={<Index view="help" />} />

                {/* Default LTR Routes */}
                <Route path="/" element={<Index view="invoices" />} />
                <Route path="/settings" element={<Index view="settings" />} />
                <Route path="/dashboard" element={<Index view="dashboard" />} />
                <Route path="/help" element={<Index view="help" />} />

                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </LanguageHandler>
          </BrowserRouter>
        </SettingsProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
