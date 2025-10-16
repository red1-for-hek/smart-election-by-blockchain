import { Home, Vote, CheckCircle, BarChart3, Plane, Shield } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useLocation } from "wouter";

const menuItems = [
  { title: "ড্যাশবোর্ড", titleEn: "Dashboard", url: "/dashboard", icon: Home },
  { title: "ভোট দিন", titleEn: "Vote", url: "/vote", icon: Vote },
  { title: "যাচাই করুন", titleEn: "Verify", url: "/verify", icon: CheckCircle },
  { title: "পরিসংখ্যান", titleEn: "Statistics", url: "/statistics", icon: BarChart3 },
  { title: "Postal Voting", titleEn: "Postal", url: "/postal", icon: Plane },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <div>
            <h2 className="font-bold text-sm">বাংলাদেশ জাতীয় ভোটিং সিস্টেম</h2>
            <p className="text-xs text-muted-foreground">Blockchain-Based Voting</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>মূল মেনু</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <a href={item.url} data-testid={`nav-${item.titleEn.toLowerCase()}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Shield className="h-3 w-3" />
          <span>ব্লকচেইন দ্বারা সুরক্ষিত</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
