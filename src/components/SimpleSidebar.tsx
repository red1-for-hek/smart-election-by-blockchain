import { Home, Vote, CheckCircle, BarChart3, Plane, Shield, User } from "lucide-react";
import { useLocation } from "wouter";

const menuItems = [
  { title: "ড্যাশবোর্ড", titleEn: "Dashboard", url: "/dashboard", icon: Home },
  { title: "ভোট দিন", titleEn: "Vote", url: "/vote", icon: Vote },
  { title: "যাচাই করুন", titleEn: "Verify", url: "/verify", icon: CheckCircle },
  { title: "পরিসংখ্যান", titleEn: "Statistics", url: "/statistics", icon: BarChart3 },
  { title: "প্রোফাইল", titleEn: "Profile", url: "/profile", icon: User },
  { title: "Postal Voting", titleEn: "Postal", url: "/postal", icon: Plane },
];

export function SimpleSidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-white shadow-lg border-r">
      <div className="border-b p-4">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="font-bold text-sm">বাংলাদেশ জাতীয় ভোটিং সিস্টেম</h2>
            <p className="text-xs text-gray-500">Blockchain-Based Voting</p>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">মূল মেনু</p>
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.url;
            
            return (
              <a
                key={item.url}
                href={item.url}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                data-testid={`nav-${item.titleEn.toLowerCase()}`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.title}</span>
              </a>
            );
          })}
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 right-0 border-t p-4 bg-white">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Shield className="h-3 w-3" />
          <span>ব্লকচেইন দ্বারা সুরক্ষিত</span>
        </div>
      </div>
    </div>
  );
}