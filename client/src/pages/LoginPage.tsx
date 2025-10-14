import { useState } from "react";
import { useLocation } from "wouter";
import { LoginCard } from "@/components/LoginCard";
import { RegistrationForm } from "@/components/RegistrationForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [showRegistration, setShowRegistration] = useState(false);

  const handleLogin = (nid: string, password: string) => {
    if (nid === "1234567890" && password === "NoPassword") {
      console.log("Login successful");
      setLocation("/dashboard");
    } else {
      console.log("Invalid credentials");
      alert("ভুল NID বা পাসওয়ার্ড");
    }
  };

  const handleRegister = (data: any) => {
    console.log("Registration data:", data);
    alert("নিবন্ধন সফল! এখন লগইন করুন।");
    setShowRegistration(false);
  };

  const handleShowRegistration = () => {
    setShowRegistration(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative p-4">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>
      
      {showRegistration ? (
        <RegistrationForm 
          onRegister={handleRegister} 
          onBackToLogin={() => setShowRegistration(false)} 
        />
      ) : (
        <div className="w-full max-w-md">
          <LoginCard onLogin={handleLogin} />
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              নতুন ভোটার?{" "}
              <button 
                onClick={handleShowRegistration}
                className="text-primary hover:underline font-medium"
                data-testid="link-register"
              >
                এখানে নিবন্ধন করুন
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
