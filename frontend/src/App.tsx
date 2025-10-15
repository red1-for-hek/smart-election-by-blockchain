import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { VotingProvider } from "@/lib/voting-context";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ProfileDropdown } from "@/components/ProfileDropdown";

import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import VotePage from "@/pages/VotePage";
import VerifyPage from "@/pages/VerifyPage";
import StatisticsPage from "@/pages/StatisticsPage";
import ProfilePage from "@/pages/ProfilePage";
import PostalPage from "@/pages/PostalPage";
import NotFound from "@/pages/not-found";

function Router() {
  const [location, setLocation] = useLocation();
  const isLoginPage = location === "/" || location === "/login";

  if (isLoginPage) {
    return (
      <Switch>
        <Route path="/" component={LoginPage} />
        <Route path="/login" component={LoginPage} />
        <Route component={LoginPage} />
      </Switch>
    );
  }

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  const userData = {
    name: "রেদওয়ানুল হক",
    nid: "1234567890",
  };

  return (
    <VotingProvider>
      <SidebarProvider style={style as React.CSSProperties}>
        <div className="flex h-screen w-full">
          <AppSidebar />
          <div className="flex flex-col flex-1">
            <header className="flex items-center justify-between p-4 border-b bg-background">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <div className="flex items-center gap-2">
                <LanguageToggle />
                <ThemeToggle />
                <ProfileDropdown userName={userData.name} nid={userData.nid} />
              </div>
            </header>
            <main className="flex-1 overflow-auto">
              <Switch>
                <Route path="/dashboard" component={DashboardPage} />
                <Route path="/vote" component={VotePage} />
                <Route path="/verify" component={VerifyPage} />
                <Route path="/statistics" component={StatisticsPage} />
                <Route path="/profile" component={ProfilePage} />
                <Route path="/postal" component={PostalPage} />
                <Route component={NotFound} />
              </Switch>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </VotingProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="voting-ui-theme">
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;