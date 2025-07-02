"use client";

import { useState, useEffect } from 'react';

// Translation resources
const translations = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    jobs: "Jobs",
    resume: "Resume",
    appliedJobs: "Applied Jobs",
    likedJobs: "Liked Jobs",
    account: "Account",
    interview: "Interview Training",
    courses: "Free Courses",
    community: "WhatsApp Community",
    services: "Service Details",
    aiJobApply: "AI Job Apply",
    
    // Buttons
    login: "Login",
    register: "Register",
    logout: "Logout",
    save: "Save",
    cancel: "Cancel",
    apply: "Apply",
    submit: "Submit",
    edit: "Edit",
    delete: "Delete",
    view: "View",
    download: "Download",
    upload: "Upload",
    next: "Next",
    previous: "Previous",
    back: "Back",
    continue: "Continue",
    finish: "Finish",
    close: "Close",
    confirm: "Confirm",
    search: "Search",
    filter: "Filter",
    clear: "Clear",
    refresh: "Refresh",
    
    // Forms
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    password: "Password",
    phone: "Phone Number",
    address: "Address",
    city: "City",
    country: "Country",
    
    // Status
    loading: "Loading...",
    success: "Success",
    error: "Error",
    pending: "Pending",
    
    // Messages
    welcome: "Welcome",
    noData: "No data available",
    noResults: "No results found",
    
    // Language
    selectLanguage: "Select Language",
    english: "English",
    arabic: "العربية",
    languagePreference: "Language preference will be saved for your next visit",
    chooseLanguage: "Choose your preferred language for the website interface.",
    
    // Navigation
    toggleMenu: "Toggle menu",
    whatsappCommunity: "WhatsApp Community",
  },
  ar: {
    // Navigation
    dashboard: "لوحة التحكم",
    jobs: "الوظائف",
    resume: "السيرة الذاتية",
    appliedJobs: "الوظائف المتقدم لها",
    likedJobs: "الوظائف المفضلة",
    account: "الحساب",
    interview: "تدريب المقابلات",
    courses: "دورات مجانية",
    community: "مجتمع الواتساب",
    services: "تفاصيل الخدمات",
    aiJobApply: "التقديم الذكي للوظائف",
    
    // Buttons
    login: "تسجيل الدخول",
    register: "التسجيل",
    logout: "تسجيل الخروج",
    save: "حفظ",
    cancel: "إلغاء",
    apply: "تقدم",
    submit: "إرسال",
    edit: "تعديل",
    delete: "حذف",
    view: "عرض",
    download: "تحميل",
    upload: "رفع",
    next: "التالي",
    previous: "السابق",
    back: "رجوع",
    continue: "متابعة",
    finish: "إنهاء",
    close: "إغلاق",
    confirm: "تأكيد",
    search: "بحث",
    filter: "تصفية",
    clear: "مسح",
    refresh: "تحديث",
    
    // Forms
    firstName: "الاسم الأول",
    lastName: "اسم العائلة",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    phone: "رقم الهاتف",
    address: "العنوان",
    city: "المدينة",
    country: "البلد",
    
    // Status
    loading: "جاري التحميل...",
    success: "نجح",
    error: "خطأ",
    pending: "في الانتظار",
    
    // Messages
    welcome: "مرحباً",
    noData: "لا توجد بيانات متاحة",
    noResults: "لم يتم العثور على نتائج",
    
    // Language
    selectLanguage: "اختر اللغة",
    english: "English",
    arabic: "العربية",
    languagePreference: "سيتم حفظ تفضيل اللغة لزيارتك القادمة",
    chooseLanguage: "اختر لغتك المفضلة لواجهة الموقع.",
    
    // Navigation
    toggleMenu: "تبديل القائمة",
    whatsappCommunity: "مجتمع الواتساب",
  }
};

export function useTranslation() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && ['en', 'ar'].includes(savedLanguage)) {
      setLanguage(savedLanguage as 'en' | 'ar');
    }

    // Listen for language changes
    const handleLanguageChange = (event: CustomEvent) => {
      const newLanguage = event.detail.language;
      if (['en', 'ar'].includes(newLanguage)) {
        setLanguage(newLanguage);
      }
    };

    window.addEventListener('languageChanged', handleLanguageChange as EventListener);

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
    };
  }, []);

  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return {
    t,
    language,
    isRTL: language === 'ar',
  };
} 