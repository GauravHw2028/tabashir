"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  // todo: add uae flg instead of saudi
  { code: "ar", name: "العربية", flag: "🇦🇪" },
];

export function UserProfileHeader() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === selectedLanguage);

  // Load saved language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }
  }, []);

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    setIsOpen(false);
    localStorage.setItem('preferred-language', languageCode);
    console.log(`Language changed to: ${languageCode}`);
  };

  return (
    // <Card className="py-2 px-4 flex justify-end items-center rounded-lg shadow-sm border bg-white">
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-gray-200"
        >
          <Globe className="h-4 w-4" />
          <span className="text-lg">{currentLanguage?.flag}</span>
          <span className="text-sm font-medium hidden sm:inline">{currentLanguage?.name}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Select Language
          </DialogTitle>
          <DialogDescription>
            Choose your preferred language for the website interface.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-4 max-h-80 overflow-y-auto">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all hover:bg-gray-50 ${selectedLanguage === language.code
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200"
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{language.flag}</span>
                <span className="font-medium text-gray-900">{language.name}</span>
              </div>
              {selectedLanguage === language.code && (
                <Check className="h-4 w-4 text-blue-500" />
              )}
            </button>
          ))}
        </div>

        <div className="text-xs text-gray-500 text-center">
          Language preference will be saved for your next visit
        </div>
      </DialogContent>
    </Dialog>
    // </Card>
  );
}
