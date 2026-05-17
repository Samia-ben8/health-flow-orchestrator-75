import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ConsultationProvider } from "@/context/ConsultationContext";
import AppShell from "@/components/AppShell";
import Index from "./pages/Index.tsx";
import ConsultationLoading from "./pages/ConsultationLoading.tsx";
import PatientQuestions from "./pages/PatientQuestions.tsx";
import PhysicianReview from "./pages/PhysicianReview.tsx";
import FinalReport from "./pages/FinalReport.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ConsultationProvider>
          <AppShell>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/questions" element={<PatientQuestions />} />
              <Route path="/consultation" element={<ConsultationLoading />} />
              <Route path="/review" element={<PhysicianReview />} />
              <Route path="/report" element={<FinalReport />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppShell>
        </ConsultationProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
