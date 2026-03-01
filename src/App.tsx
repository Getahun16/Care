import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Index from "./pages/Index";
import TheProject from "./pages/TheProject";
import Research from "./pages/Research";
import Team from "./pages/Team";
import Impact from "./pages/Impact";
import Library from "./pages/Library";
import NewsEvents from "./pages/NewsEvents";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/project" element={<TheProject />} />
            <Route path="/research" element={<Research />} />
            <Route path="/team" element={<Team />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/library" element={<Library />} />
            <Route path="/news" element={<NewsEvents />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
