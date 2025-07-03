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
    
    // Job-related
    topMatch: "Top Match",
    bestForYou: "Best For You",
    match: "Match",
    views: "views",
    applied: "applied",
    applicationsCount: "applications",
    postedTime: "Posted",
    jobType: "Job Type",
    salary: "Salary",
    location: "Location",
    company: "Company",
    department: "Department",
    team: "Team",
    requirements: "Requirements",
    description: "Description",
    
    // Applied Jobs
    appliedDate: "Applied Date",
    position: "Position",
    status: "Status",
    jobTitle: "Job Title",
    jobId: "Job ID",
    totalApplied: "Total Applied",
    searchJobs: "Search jobs...",
    itemsPerPage: "Items per page",
    showingResults: "Showing results",
    of: "of",
    to: "to",
    results: "results",
    loadingJobs: "Loading jobs...",
    noJobsFound: "No jobs found",
    tryAgain: "Try Again",
    failedToLoad: "Failed to load applied jobs",
    
    // AI Job Apply
    selectResume: "Select Resume",
    pleaseSelectResume: "Please select a resume",
    preferredPositions: "Preferred Positions",
    addPosition: "Add Position",
    preferredLocations: "Preferred Locations",
    nationality: "Nationality",
    gender: "Gender",
    male: "Male",
    female: "Female",
    submitApplication: "Submit Application",
    processingApplication: "Processing Application...",
    applicationSubmitted: "Application submitted successfully!",
    
    // Free Courses
    freeCourses: "Free Courses",
    recommendedVideos: "Recommended Videos",
    topPicksForYou: "Top picks for you",
    searchInVideos: "Search in videos",
    bestSeller: "BEST SELLER",
    new: "NEW",
    
    // Interview Training
    interviewTraining: "Interview Training",
    comingSoon: "Coming Soon",
    masterInterviewSkills: "Master your interview skills with AI-powered practice sessions",
    prepareForSuccess: "Prepare for success with our advanced interview simulator",
    interviewPlatformDescription: "We're building a cutting-edge platform to help you practice and perfect your interview skills with industry-specific questions and real-time feedback.",
    enterYourEmail: "Enter your email",
    notifyMe: "Notify Me",
    
    // WhatsApp Community
    latestUpdateFrom: "To Get the latest update from Tabashir",
    joinWhatsappCommunity: "Join this Whatsapp Community",
    letMeJoinCommunity: "Let me Join Community",
    
    // Job Details
    applyNow: "Apply Now",
    aboutJob: "About Job",
    jobDetails: "Job Details",
    workingDays: "Working Days",
    experienceLevel: "Experience Level",
    qualifications: "Qualifications",
    
    // Search & Filters
    searchPreferences: "Search Preferences",
    filters: "Filters",
    sortBy: "Sort By",
    newest: "Newest",
    oldest: "Oldest",
    salaryAsc: "Salary (Low to High)",
    salaryDesc: "Salary (High to Low)",
    salaryRange: "Salary Range",
    minSalary: "Min Salary",
    maxSalary: "Max Salary",
    
    // Pagination
    page: "Page",
    previousPage: "Previous Page",
    nextPage: "Next Page",
    
    // Common Actions
    likeJob: "Like Job",
    unlikeJob: "Unlike Job",
    viewDetails: "View Details",
    applyToJob: "Apply to Job",
    downloading: "Downloading...",
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
    
    // Job-related
    topMatch: "أفضل مطابقة",
    bestForYou: "الأفضل لك",
    match: "مطابقة",
    views: "مشاهدات",
    applied: "متقدم",
    applicationsCount: "طلبات",
    postedTime: "تم النشر",
    jobType: "نوع الوظيفة",
    salary: "الراتب",
    location: "الموقع",
    company: "الشركة",
    department: "القسم",
    team: "الفريق",
    requirements: "المتطلبات",
    description: "الوصف",
    
    // Applied Jobs
    appliedDate: "تاريخ التقديم",
    position: "المنصب",
    status: "الحالة",
    jobTitle: "عنوان الوظيفة",
    jobId: "معرف الوظيفة",
    totalApplied: "إجمالي المتقدمين",
    searchJobs: "البحث عن الوظائف...",
    itemsPerPage: "عناصر في الصفحة",
    showingResults: "عرض النتائج",
    of: "من",
    to: "إلى",
    results: "نتائج",
    loadingJobs: "جاري تحميل الوظائف...",
    noJobsFound: "لم يتم العثور على وظائف",
    tryAgain: "حاول مرة أخرى",
    failedToLoad: "فشل في تحميل الوظائف المتقدم لها",
    
    // AI Job Apply
    selectResume: "اختر السيرة الذاتية",
    pleaseSelectResume: "يرجى اختيار سيرة ذاتية",
    preferredPositions: "المناصب المفضلة",
    addPosition: "إضافة منصب",
    preferredLocations: "المواقع المفضلة",
    nationality: "الجنسية",
    gender: "الجنس",
    male: "ذكر",
    female: "أنثى",
    submitApplication: "تقديم الطلب",
    processingApplication: "جاري معالجة الطلب...",
    applicationSubmitted: "تم تقديم الطلب بنجاح!",
    
    // Free Courses
    freeCourses: "دورات مجانية",
    recommendedVideos: "مقاطع فيديو موصى بها",
    topPicksForYou: "أفضل الاختيارات لك",
    searchInVideos: "البحث في الفيديوهات",
    bestSeller: "الأكثر مبيعاً",
    new: "جديد",
    
    // Interview Training
    interviewTraining: "تدريب المقابلات",
    comingSoon: "قريباً",
    masterInterviewSkills: "أتقن مهارات المقابلة من خلال جلسات التدريب المدعومة بالذكاء الاصطناعي",
    prepareForSuccess: "استعد للنجاح مع محاكي المقابلات المتقدم",
    interviewPlatformDescription: "نحن نبني منصة متطورة لمساعدتك في التدريب وإتقان مهارات المقابلة مع أسئلة خاصة بالصناعة وتعليقات فورية.",
    enterYourEmail: "أدخل بريدك الإلكتروني",
    notifyMe: "أخبرني",
    
    // WhatsApp Community
    latestUpdateFrom: "للحصول على أحدث التحديثات من تبشير",
    joinWhatsappCommunity: "انضم إلى مجتمع الواتساب",
    letMeJoinCommunity: "دعني أنضم للمجتمع",
    
    // Job Details
    applyNow: "قدم الآن",
    aboutJob: "عن الوظيفة",
    jobDetails: "تفاصيل الوظيفة",
    workingDays: "أيام العمل",
    experienceLevel: "مستوى الخبرة",
    qualifications: "المؤهلات",
    
    // Search & Filters
    searchPreferences: "تفضيلات البحث",
    filters: "المرشحات",
    sortBy: "ترتيب حسب",
    newest: "الأحدث",
    oldest: "الأقدم",
    salaryAsc: "الراتب (من الأقل إلى الأعلى)",
    salaryDesc: "الراتب (من الأعلى إلى الأقل)",
    salaryRange: "نطاق الراتب",
    minSalary: "الحد الأدنى للراتب",
    maxSalary: "الحد الأقصى للراتب",
    
    // Pagination
    page: "صفحة",
    previousPage: "الصفحة السابقة",
    nextPage: "الصفحة التالية",
    
    // Common Actions
    likeJob: "إعجاب بالوظيفة",
    unlikeJob: "إلغاء الإعجاب بالوظيفة",
    viewDetails: "عرض التفاصيل",
    applyToJob: "تقدم للوظيفة",
    downloading: "جاري التحميل...",
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