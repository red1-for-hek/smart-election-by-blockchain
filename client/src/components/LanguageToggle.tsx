import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

type Language = "bn" | "en";

export function LanguageToggle() {
  const [language, setLanguage] = useState<Language>("bn");

  const toggleLanguage = () => {
    setLanguage(language === "bn" ? "en" : "bn");
    console.log(`Language switched to ${language === "bn" ? "English" : "Bengali"}`);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      data-testid="button-language-toggle"
      className="gap-2"
    >
      <Globe className="h-4 w-4" />
      <span className="text-sm">{language === "bn" ? "EN" : "বাং"}</span>
    </Button>
  );
}
