import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut } from "lucide-react";
import { useLocation } from "wouter";

interface ProfileDropdownProps {
  userName: string;
  nid: string;
}

export function ProfileDropdown({ userName, nid }: ProfileDropdownProps) {
  const [, setLocation] = useLocation();
  
  const handleLogout = () => {
    console.log("Logging out...");
    setLocation("/");
  };

  const handleProfile = () => {
    setLocation("/profile");
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return name[0] || "U";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className="flex items-center gap-3 hover-elevate rounded-lg p-2"
          data-testid="button-profile-dropdown"
        >
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-muted-foreground">NID: {nid}</p>
          </div>
          <Avatar className="h-10 w-10 border-2 border-primary">
            <AvatarImage src="" alt={userName} />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>আমার অ্যাকাউন্ট</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleProfile} data-testid="menu-profile">
          <User className="mr-2 h-4 w-4" />
          প্রোফাইল দেখুন
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} data-testid="menu-logout">
          <LogOut className="mr-2 h-4 w-4" />
          লগআউট
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
