import { Menu, Sun, Moon, Globe, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

interface SimpleHeaderProps {
  userName: string;
  nid: string;
}

export function SimpleHeader({ userName, nid }: SimpleHeaderProps) {
  const [, setLocation] = useLocation();
  const [showProfile, setShowProfile] = useState(false);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("bn");

  return (
    <header className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <Menu className="h-5 w-5" />
        </button>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Language Toggle */}
        <button 
          onClick={() => setLanguage(language === "bn" ? "en" : "bn")}
          className="p-2 hover:bg-gray-100 rounded-lg"
          title="Change Language"
        >
          <Globe className="h-4 w-4" />
        </button>
        
        {/* Theme Toggle */}
        <button 
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="p-2 hover:bg-gray-100 rounded-lg"
          title="Toggle Theme"
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
        
        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
          >
            <div className="text-right text-sm">
              <div className="font-medium">{userName}</div>
              <div className="text-gray-500">NID: {nid}</div>
            </div>
            <ChevronDown className="h-4 w-4" />
          </button>
          
          {showProfile && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
              <a href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">
                প্রোফাইল দেখুন
              </a>
              <button 
                onClick={() => setLocation('/login')}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                লগআউট
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}