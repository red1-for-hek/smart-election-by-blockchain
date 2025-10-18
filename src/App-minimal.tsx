import { Switch, Route, useLocation } from "wouter";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import VotePage from "@/pages/VotePage";
import VerifyPage from "@/pages/VerifyPage";
import StatisticsPage from "@/pages/StatisticsPage";
import ProfilePage from "@/pages/ProfilePage";
import PostalPage from "@/pages/PostalPage-simple";
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
              <Route path="/verify" component={VerifyPage} />
              <Route path="/statistics" component={StatisticsPage} />
              <Route path="/profile" component={ProfilePage} />
              <Route path="/postal" component={PostalPage} />
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