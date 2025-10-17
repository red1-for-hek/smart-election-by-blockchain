import { Switch, Route, useLocation } from "wouter";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import VotePage from "@/pages/VotePage";
import { VotingProvider } from "@/lib/voting-context";
import { SimpleSidebar } from "@/components/SimpleSidebar";
import { SimpleHeader } from "@/components/SimpleHeader";
import "./index.css";





function App() {
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
      <div className="flex h-screen w-full bg-gray-50">
        <SimpleSidebar />
        <div className="flex flex-col flex-1">
          <SimpleHeader userName={userData.name} nid={userData.nid} />
          <main className="flex-1 overflow-auto">
            <Switch>
              <Route path="/dashboard" component={DashboardPage} />
              <Route path="/vote" component={VotePage} />
              <Route path="/verify">
                <div className="p-6">Verify Page - Coming Soon</div>
              </Route>
              <Route path="/statistics">
                <div className="p-6">Statistics Page - Coming Soon</div>
              </Route>
              <Route path="/profile">
                <div className="p-6">Profile Page - Coming Soon</div>
              </Route>
              <Route path="/postal">
                <div className="p-6">Postal Page - Coming Soon</div>
              </Route>
              <Route>
                <div className="p-6">Page not found</div>
              </Route>
            </Switch>
          </main>
        </div>
      </div>
    </VotingProvider>
  );
}

export default App;