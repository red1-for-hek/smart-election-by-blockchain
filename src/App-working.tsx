import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./lib/theme-provider";
import { VotingProvider } from "./lib/voting-context";

import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import VotePage from "@/pages/VotePage";
import VerifyPage from "@/pages/VerifyPage";
import StatisticsPage from "@/pages/StatisticsPage";
import ProfilePage from "@/pages/ProfilePage";
import PostalPage from "@/pages/PostalPage";

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

  const userData = {
    name: "রেদওয়ানুল হক",
    nid: "1234567890",
  };

  return (
    <VotingProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Simple Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-4 border-b">
            <h2 className="font-bold text-lg">🇧🇩 ভোটিং সিস্টেম</h2>
            <p className="text-sm text-gray-600">Blockchain Voting</p>
          </div>
          
          <nav className="p-4">
            <div className="space-y-2">
              <a href="/dashboard" className={`block p-2 rounded ${location === '/dashboard' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}>
                🏠 ড্যাশবোর্ড
              </a>
              <a href="/vote" className={`block p-2 rounded ${location === '/vote' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}>
                🗳️ ভোট দিন
              </a>
              <a href="/verify" className={`block p-2 rounded ${location === '/verify' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}>
                ✅ যাচাই করুন
              </a>
              <a href="/statistics" className={`block p-2 rounded ${location === '/statistics' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}>
                📊 পরিসংখ্যান
              </a>
              <a href="/postal" className={`block p-2 rounded ${location === '/postal' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}>
                ✈️ Postal Voting
              </a>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow-sm p-4 border-b">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold">Bangladesh Voting System</h1>
              <div className="flex items-center gap-4">
                <span className="text-sm">Welcome, {userData.name}</span>
                <button onClick={() => setLocation('/login')} className="text-sm text-red-600 hover:underline">
                  Logout
                </button>
              </div>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-6">
            <Switch>
              <Route path="/dashboard" component={DashboardPage} />
              <Route path="/vote" component={VotePage} />
              <Route path="/verify" component={VerifyPage} />
              <Route path="/statistics" component={StatisticsPage} />
              <Route path="/profile" component={ProfilePage} />
              <Route path="/postal" component={PostalPage} />
              <Route>
                <div>Page not found</div>
              </Route>
            </Switch>
          </main>
        </div>
      </div>
    </VotingProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="voting-ui-theme">
        <Router />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;