import { Switch, Route, useLocation } from "wouter";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import { VotingProvider } from "@/lib/voting-context";
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
              <a href="/dashboard" className={`block p-3 rounded-lg transition-colors ${
                location === '/dashboard' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}>
                🏠 ড্যাশবোর্ড
              </a>
              <a href="/vote" className={`block p-3 rounded-lg transition-colors ${
                location === '/vote' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}>
                🗳️ ভোট দিন
              </a>
              <a href="/verify" className={`block p-3 rounded-lg transition-colors ${
                location === '/verify' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}>
                ✅ যাচাই করুন
              </a>
              <a href="/statistics" className={`block p-3 rounded-lg transition-colors ${
                location === '/statistics' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}>
                📊 পরিসংখ্যান
              </a>
              <a href="/profile" className={`block p-3 rounded-lg transition-colors ${
                location === '/profile' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}>
                👤 প্রোফাইল
              </a>
              <a href="/postal" className={`block p-3 rounded-lg transition-colors ${
                location === '/postal' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}>
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
                <span className="text-sm">Welcome, রেদওয়ানুল হক (NID: 1234567890)</span>
                <button 
                  onClick={() => setLocation('/login')} 
                  className="text-sm text-red-600 hover:underline"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto">
            <Switch>
              <Route path="/dashboard" component={DashboardPage} />
              <Route path="/vote">
                <div className="p-6">Vote Page - Coming Soon</div>
              </Route>
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