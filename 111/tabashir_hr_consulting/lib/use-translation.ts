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
    
    // Recruiter Section
    myJobs: "My Jobs",
    manageJobPostings: "Manage your job postings and applications",
    createNewJob: "Create New Job",
    noJobsPosted: "No jobs posted yet",
    startByCreating: "Start by creating your first job posting to attract top talent",
    createFirstJob: "Create Your First Job",
    notSpecified: "Not specified",
    applications: "applications",
    viewApplications: "View Applications",
    jobsManagement: "Jobs Management",
    
    // Admin Section
    adminDashboard: "Admin Dashboard",
    manageUsers: "Manage Users",
    manageAdmins: "Manage Admins",
    userManagement: "User Management",
    adminManagement: "Admin Management",
    systemSettings: "System Settings",
    reports: "Reports",
    analytics: "Analytics",
    
    // Forms & Validation
    username: "Username",
    confirmPassword: "Confirm Password",
    forgotPassword: "Forgot Password",
    resetPassword: "Reset Password",
    rememberMe: "Remember me",
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    signUp: "Sign Up",
    signIn: "Sign In",
    createAccount: "Create Account",
    
    // Job Related
    jobTitle: "Job Title",
    company: "Company",
    location: "Location",
    jobType: "Job Type",
    salary: "Salary",
    description: "Description",
    requirements: "Requirements",
    benefits: "Benefits",
    fullTime: "Full Time",
    partTime: "Part Time",
    contract: "Contract",
    internship: "Internship",
    remote: "Remote",
    onsite: "Onsite",
    hybrid: "Hybrid",
    
    // Application Status
    applied: "Applied",
    pending: "Pending",
    reviewing: "Reviewing",
    interview: "Interview",
    hired: "Hired",
    rejected: "Rejected",
    
    // Common Actions
    create: "Create",
    update: "Update",
    remove: "Remove",
    manage: "Manage",
    settings: "Settings",
    profile: "Profile",
    preferences: "Preferences",
    notifications: "Notifications",
    help: "Help",
    support: "Support",
    
    // Time & Dates
    today: "Today",
    yesterday: "Yesterday",
    thisWeek: "This Week",
    thisMonth: "This Month",
    lastMonth: "Last Month",
    createdAt: "Created",
    updatedAt: "Updated",
    
    // Status Messages
    successfullyCreated: "Successfully created",
    successfullyUpdated: "Successfully updated",
    successfullyDeleted: "Successfully deleted",
    operationFailed: "Operation failed",
    pleaseTryAgain: "Please try again",
    
    // Navigation & UI
    home: "Home",
    about: "About",
    contact: "Contact",
    privacy: "Privacy",
    terms: "Terms",
    menu: "Menu",
    sidebar: "Sidebar",
    header: "Header",
    footer: "Footer",
    
    // Pagination & Lists
    showing: "Showing",
    to: "to",
    of: "of",
    results: "results",
    itemsPerPage: "Items per page",
    
    // Forms & Registration
    enterDetailsToCreateAccount: "Enter your details to create your account",
    enterYourEmail: "Enter your email address",
    enterYourUsername: "Enter your username",
    enterYourPassword: "Enter your password",
    creatingAccount: "Creating account...",
    registrationError: "Registration Error",
    registrationSuccessful: "Registration Successful",
    accountCreatedSuccessfully: "Account created successfully!",
    checkEmailForVerification: "Please check your email for verification instructions",
    somethingWentWrong: "Something went wrong. Please try again.",
    
    // Account & Profile
    personalDetails: "Personal Details",
    contactInformation: "Contact Information",
    professionalInformation: "Professional Information",
    accountSettings: "Account Settings",
    changePassword: "Change Password",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmNewPassword: "Confirm New Password",
    updatePassword: "Update Password",
    profileUpdated: "Profile updated successfully",
    passwordUpdated: "Password updated successfully",
    
    // Resume
    myResumes: "My Resumes",
    uploadResume: "Upload Resume",
    downloadResume: "Download Resume",
    deleteResume: "Delete Resume",
    aiEnhance: "AI Enhance",
    createResume: "Create Resume",
    resumeUploadedSuccessfully: "Resume uploaded successfully",
    resumeDeletedSuccessfully: "Resume deleted successfully",
    confirmDeleteResume: "Are you sure you want to delete this resume?",
    
    // Jobs & Search
    findJobs: "Find Jobs",
    searchForJobs: "Search for jobs",
    searchPlaceholder: "Search for jobs, companies, or keywords",
    jobSearch: "Job Search",
    searchResults: "Search Results",
    noJobsMatchCriteria: "No jobs match your search criteria",
    adjustFilters: "Try adjusting your filters or search terms",
    
    // Experience Levels
    experienceLevel: "Experience Level",
    zeroToOne: "0-1 years",
    oneToThree: "1-3 years",
    threeToFive: "3-5 years",
    fiveToTen: "5-10 years",
    tenPlus: "10+ years",
    
    // Education Levels
    educationLevel: "Education Level",
    highSchool: "High School",
    bachelors: "Bachelor's Degree",
    masters: "Master's Degree",
    phd: "PhD",
    other: "Other",
    
    // Gender
    gender: "Gender",
    male: "Male",
    female: "Female",
    other: "Other",
    
    // Additional Form Fields
    addSkill: "Add a skill",
    add: "Add",
    enterNewPassword: "Enter new password",
    passwordsDoNotMatch: "Passwords do not match",
    passwordTooShort: "Password must be at least 8 characters long",
    updating: "Updating...",
    
    // Resume Management
    noResumesFound: "No resumes found",
    uploadFirstResume: "Upload your first resume to get started",
    resumeDownloadedSuccessfully: "Resume downloaded successfully",
    failedToDownloadResume: "Failed to download resume",
    failedToDeleteResume: "Failed to delete resume",
    cvUploadedSuccessfully: "CV uploaded successfully",
    failedToUploadCV: "Failed to upload CV",
    
    // Job Loading
    failedToLoadJobs: "Failed to load jobs",
    
    // Services
    tabashirServices: "Tabashir Services",
    tabashirServicesDesc: "Boost your career with our AI-powered professional services designed to help you stand out in the job market",
    aiResumeOptimization: "AI Resume Optimization",
    aiResumeOptimizationDesc: "Transform your resume with AI-powered analysis and optimization",
    coverLetterGeneration: "Cover Letter Generation", 
    coverLetterGenerationDesc: "Create compelling, personalized cover letters for any job",
    interviewPreparation: "Interview Preparation",
    interviewPreparationDesc: "Master interview skills with AI-powered practice sessions",
    careerCoaching: "Career Coaching",
    careerCoachingDesc: "One-on-one personalized career guidance from experts",
    mostPopular: "Most Popular",
    selectService: "Select Service",
    needCustomSolution: "Need a Custom Solution?",
    needCustomSolutionDesc: "Contact our team for personalized services tailored to your specific career needs",
    contactUs: "Contact Us",
    recentPayment: "Recent Payment",
    aed: "AED",
    
    // Service Features
    aiAnalysisMatching: "AI Analysis & Job Matching",
    professionalFormatting: "Professional Formatting",
    keywordOptimization: "Keyword Optimization",
    atsCompatibility: "ATS Compatibility",
    instantDownload: "Instant Download",
    personalizedCoverLetter: "Personalized Cover Letter",
    jobSpecificContent: "Job-Specific Content",
    professionalTone: "Professional Tone",
    multipleFormats: "Multiple Formats",
    editableTemplate: "Editable Template",
    commonQuestions: "Common Interview Questions",
    industrySpecificQuestions: "Industry-Specific Questions",
    answerTemplates: "Answer Templates",
    confidenceBuilding: "Confidence Building Tips",
    practiceSimulations: "Practice Simulations",
    oneOnOneSession: "One-on-One Session",
    careerGoalSetting: "Career Goal Setting",
    skillAssessment: "Skill Assessment",
    personalizedPlan: "Personalized Action Plan",
    followUpSupport: "Follow-up Support",
    
    // Time Periods
    month: "month",
    year: "year",
    week: "week",
    day: "day",
    hour: "hour",
    
    // Dashboard & Charts
    totalMatchingJobs: "Total Matching Jobs",
    skillTrends: "Skill Trends",
    globalDemandFor: "Global Demand for",
    flexible: "Flexible",
    
    // Countries
    uae: "UAE",
    taiwan: "Taiwan",
    india: "India",
    saudiArabia: "Saudi Arabia",
    
    // Search & Job Filters
    filterJobsChoice: "Filter the jobs of your choice",
    selectLocation: "Select location",
    selectJobType: "Select job type",
    yearsExperience: "2 years",
    attendance: "Attendance",
    freelance: "Freelance",
    hideFilters: "Hide Filters",
    showFilters: "Show Filters",
    
    // Dashboard Components
    matchedJobs: "Matched Jobs",
    
    // Resume Builder
    generateNewResume: "Generate New Resume",
    checkGeneratedResume: "Check Generated Resume",
    resumeScore: "Resume Score",
    tips: "Tips",
    generatingYourResume: "Generating Your Resume",
    pleaseWaitWhileGenerating: "Please wait while we create your professional resume...",
    analyzingInformation: "Analyzing your information...",
    formattingResume: "Formatting your resume...",
    applyingProfessionalStyling: "Applying professional styling...",
    finalizingResume: "Finalizing your resume...",
    
    // Resume Download & Export
    editorMode: "Editor Mode",
    exportAs: "Export As",
    wordDocument: "Word Document",
    unlockFullResumeView: "Unlock Full Resume View",
    completePaymentToUnlock: "To view and download your resume without blur, please complete the payment.",
    paymentSuccessful: "Payment Successful!",
    resumeNowUnlocked: "Your resume is now unlocked.",
    resumeUnlockFee: "Resume Unlock Fee",
    cardNumber: "Card Number",
    expiryDate: "Expiry Date",
    cardholderName: "Cardholder Name",
    processing: "Processing...",
    pay: "Pay",
  },
  ar: {
    // Navigation
    dashboard: "لوحة التحكم",
    jobs: "الوظائف",
    resume: "السيرة الذاتية", 
    appliedJobs: "الوظائف المتقدم لها",
    likedJobs: "الوظائف المفضلة",
    account: "الحساب",
    interview: "تدريب المقابلة",
    courses: "دورات مجانية",
    community: "مجتمع واتساب",
    services: "تفاصيل الخدمة",
    aiJobApply: "التقديم بالذكاء الاصطناعي",
    
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
    pending: "قيد الانتظار",
    
    // Messages
    welcome: "مرحباً",
    noData: "لا توجد بيانات متاحة",
    noResults: "لا توجد نتائج",
    
    // Language
    selectLanguage: "اختر اللغة",
    english: "English",
    arabic: "العربية",
    languagePreference: "سيتم حفظ تفضيل اللغة لزيارتك القادمة",
    chooseLanguage: "اختر اللغة المفضلة لديك لواجهة الموقع.",
    
    // Navigation
    toggleMenu: "تبديل القائمة",
    whatsappCommunity: "مجتمع واتساب",
    
    // Job-related
    topMatch: "أفضل مطابقة",
    bestForYou: "الأفضل لك",
    match: "مطابقة",
    views: "مشاهدات",
    newJob: "وظيفة جديدة",
    featuredJob: "وظيفة مميزة",
    urgentHiring: "توظيف عاجل",
    fullTime: "دوام كامل",
    partTime: "دوام جزئي",
    contract: "عقد",
    remote: "عن بُعد",
    onSite: "في الموقع",
    
    // Resume
    personalInfo: "المعلومات الشخصية",
    workExperience: "الخبرة العملية",
    education: "التعليم",
    skills: "المهارات",
    languages: "اللغات",
    certifications: "الشهادات",
    
    // Application states
    easyApply: "تقديم سهل",
    applied: "تم التقديم",
    saved: "محفوظ",
    
    // Common phrases
    seeMore: "رؤية المزيد",
    readMore: "اقرأ المزيد",
    showLess: "عرض أقل",
    learnMore: "تعلم المزيد",
    getStarted: "ابدأ الآن",
    tryNow: "جرب الآن",
    
    // Time
    today: "اليوم",
    yesterday: "أمس",
    thisWeek: "هذا الأسبوع",
    lastWeek: "الأسبوع الماضي",
    thisMonth: "هذا الشهر",
    lastMonth: "الشهر الماضي",
    daysAgo: "منذ أيام",
    hoursAgo: "منذ ساعات",
    minutesAgo: "منذ دقائق",
    
    // Filters and sorting
    sortBy: "ترتيب حسب",
    filterBy: "تصفية حسب",
    allJobs: "جميع الوظائف",
    relevance: "الصلة",
    datePosted: "تاريخ النشر",
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
    
    // Recruiter Section
    myJobs: "وظائفي",
    manageJobPostings: "إدارة إعلانات الوظائف والطلبات",
    createNewJob: "إنشاء وظيفة جديدة",
    noJobsPosted: "لم يتم نشر وظائف بعد",
    startByCreating: "ابدأ بإنشاء أول إعلان وظيفة لجذب أفضل المواهب",
    createFirstJob: "إنشاء وظيفتك الأولى",
    notSpecified: "غير محدد",
    applications: "طلبات",
    viewApplications: "عرض الطلبات",
    jobsManagement: "إدارة الوظائف",
    
    // Admin Section
    adminDashboard: "لوحة تحكم المدير",
    manageUsers: "إدارة المستخدمين",
    manageAdmins: "إدارة المديرين",
    userManagement: "إدارة المستخدمين",
    adminManagement: "إدارة المديرين",
    systemSettings: "إعدادات النظام",
    reports: "التقارير",
    analytics: "التحليلات",
    
    // Forms & Validation
    username: "اسم المستخدم",
    confirmPassword: "تأكيد كلمة المرور",
    forgotPassword: "نسيت كلمة المرور",
    resetPassword: "إعادة تعيين كلمة المرور",
    rememberMe: "تذكرني",
    dontHaveAccount: "ليس لديك حساب؟",
    alreadyHaveAccount: "لديك حساب بالفعل؟",
    signUp: "إنشاء حساب",
    signIn: "تسجيل الدخول",
    createAccount: "إنشاء حساب",
    
    // Job Related
    jobTitle: "عنوان الوظيفة",
    company: "الشركة",
    location: "الموقع",
    jobType: "نوع الوظيفة",
    salary: "الراتب",
    description: "الوصف",
    requirements: "المتطلبات",
    benefits: "المميزات",
    fullTime: "دوام كامل",
    partTime: "دوام جزئي",
    contract: "عقد",
    internship: "تدريب",
    remote: "عن بُعد",
    onsite: "في الموقع",
    hybrid: "هجين",
    
    // Application Status
    applied: "تم التقديم",
    pending: "قيد الانتظار",
    reviewing: "قيد المراجعة",
    interview: "مقابلة",
    hired: "تم التوظيف",
    rejected: "مرفوض",
    
    // Common Actions
    create: "إنشاء",
    update: "تحديث",
    remove: "إزالة",
    manage: "إدارة",
    settings: "الإعدادات",
    profile: "الملف الشخصي",
    preferences: "التفضيلات",
    notifications: "الإشعارات",
    help: "المساعدة",
    support: "الدعم",
    
    // Time & Dates
    today: "اليوم",
    yesterday: "أمس",
    thisWeek: "هذا الأسبوع",
    thisMonth: "هذا الشهر",
    lastMonth: "الشهر الماضي",
    createdAt: "تم الإنشاء",
    updatedAt: "تم التحديث",
    
    // Status Messages
    successfullyCreated: "تم الإنشاء بنجاح",
    successfullyUpdated: "تم التحديث بنجاح",
    successfullyDeleted: "تم الحذف بنجاح",
    operationFailed: "فشلت العملية",
    pleaseTryAgain: "يرجى المحاولة مرة أخرى",
    
    // Navigation & UI
    home: "الرئيسية",
    about: "حول",
    contact: "اتصل بنا",
    privacy: "الخصوصية",
    terms: "الشروط",
    menu: "القائمة",
    sidebar: "الشريط الجانبي",
    header: "الرأس",
    footer: "التذييل",
    
    // Pagination & Lists
    showing: "عرض",
    to: "إلى",
    of: "من",
    results: "نتائج",
    itemsPerPage: "عناصر لكل صفحة",
    
    // Forms & Registration
    enterDetailsToCreateAccount: "أدخل بياناتك لإنشاء حسابك",
    enterYourEmail: "أدخل عنوان بريدك الإلكتروني",
    enterYourUsername: "أدخل اسم المستخدم",
    enterYourPassword: "أدخل كلمة المرور",
    creatingAccount: "جاري إنشاء الحساب...",
    registrationError: "خطأ في التسجيل",
    registrationSuccessful: "تم التسجيل بنجاح",
    accountCreatedSuccessfully: "تم إنشاء الحساب بنجاح!",
    checkEmailForVerification: "يرجى التحقق من بريدك الإلكتروني للحصول على تعليمات التحقق",
    somethingWentWrong: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
    
    // Account & Profile
    personalDetails: "التفاصيل الشخصية",
    contactInformation: "معلومات الاتصال",
    professionalInformation: "المعلومات المهنية",
    accountSettings: "إعدادات الحساب",
    changePassword: "تغيير كلمة المرور",
    currentPassword: "كلمة المرور الحالية",
    newPassword: "كلمة المرور الجديدة",
    confirmNewPassword: "تأكيد كلمة المرور الجديدة",
    updatePassword: "تحديث كلمة المرور",
    profileUpdated: "تم تحديث الملف الشخصي بنجاح",
    passwordUpdated: "تم تحديث كلمة المرور بنجاح",
    
    // Resume
    myResumes: "سيرتي الذاتية",
    uploadResume: "رفع السيرة الذاتية",
    downloadResume: "تحميل السيرة الذاتية",
    deleteResume: "حذف السيرة الذاتية",
    aiEnhance: "تحسين بالذكاء الاصطناعي",
    createResume: "إنشاء سيرة ذاتية",
    resumeUploadedSuccessfully: "تم رفع السيرة الذاتية بنجاح",
    resumeDeletedSuccessfully: "تم حذف السيرة الذاتية بنجاح",
    confirmDeleteResume: "هل أنت متأكد من حذف هذه السيرة الذاتية؟",
    
    // Jobs & Search
    findJobs: "البحث عن وظائف",
    searchForJobs: "البحث عن وظائف",
    searchPlaceholder: "ابحث عن وظائف أو شركات أو كلمات مفتاحية",
    jobSearch: "البحث عن وظائف",
    searchResults: "نتائج البحث",
    noJobsMatchCriteria: "لا توجد وظائف تطابق معايير البحث",
    adjustFilters: "جرب تعديل المرشحات أو مصطلحات البحث",
    
    // Experience Levels
    experienceLevel: "مستوى الخبرة",
    zeroToOne: "0-1 سنة",
    oneToThree: "1-3 سنوات",
    threeToFive: "3-5 سنوات",
    fiveToTen: "5-10 سنوات",
    tenPlus: "10+ سنوات",
    
    // Education Levels
    educationLevel: "المستوى التعليمي",
    highSchool: "الثانوية العامة",
    bachelors: "درجة البكالوريوس",
    masters: "درجة الماجستير",
    phd: "درجة الدكتوراه",
    other: "أخرى",
    
    // Gender
    gender: "الجنس",
    male: "ذكر",
    female: "أنثى",
    other: "أخرى",
    
    // Additional Form Fields
    addSkill: "أضف مهارة",
    add: "إضافة",
    enterNewPassword: "أدخل كلمة المرور الجديدة",
    passwordsDoNotMatch: "كلمات المرور غير متطابقة",
    passwordTooShort: "يجب أن تكون كلمة المرور 8 أحرف على الأقل",
    updating: "جاري التحديث...",
    
    // Resume Management
    noResumesFound: "لم يتم العثور على سير ذاتية",
    uploadFirstResume: "ارفع سيرتك الذاتية الأولى للبدء",
    resumeDownloadedSuccessfully: "تم تحميل السيرة الذاتية بنجاح",
    failedToDownloadResume: "فشل في تحميل السيرة الذاتية",
    failedToDeleteResume: "فشل في حذف السيرة الذاتية",
    cvUploadedSuccessfully: "تم رفع السيرة الذاتية بنجاح",
    failedToUploadCV: "فشل في رفع السيرة الذاتية",
    
    // Job Loading
    failedToLoadJobs: "فشل في تحميل الوظائف",
    
    // Services
    tabashirServices: "خدمات تبشير",
    tabashirServicesDesc: "عزز مسيرتك المهنية مع خدماتنا المهنية المدعومة بالذكاء الاصطناعي والمصممة لمساعدتك على التميز في سوق العمل",
    aiResumeOptimization: "تحسين السيرة الذاتية بالذكاء الاصطناعي",
    aiResumeOptimizationDesc: "حوّل سيرتك الذاتية بالتحليل والتحسين المدعوم بالذكاء الاصطناعي",
    coverLetterGeneration: "إنشاء خطاب التقديم",
    coverLetterGenerationDesc: "اكتب خطابات تقديم مقنعة ومخصصة لأي وظيفة",
    interviewPreparation: "التحضير للمقابلة",
    interviewPreparationDesc: "أتقن مهارات المقابلة مع جلسات تدريب مدعومة بالذكاء الاصطناعي",
    careerCoaching: "التوجيه المهني",
    careerCoachingDesc: "إرشاد مهني مخصص وجهاً لوجه من الخبراء",
    mostPopular: "الأكثر شعبية",
    selectService: "اختر الخدمة",
    needCustomSolution: "تحتاج حلاً مخصصاً؟",
    needCustomSolutionDesc: "تواصل مع فريقنا للحصول على خدمات مخصصة تناسب احتياجاتك المهنية المحددة",
    contactUs: "اتصل بنا",
    recentPayment: "دفعة حديثة",
    aed: "درهم",
    
    // Service Features
    aiAnalysisMatching: "تحليل الذكاء الاصطناعي ومطابقة الوظائف",
    professionalFormatting: "تنسيق مهني",
    keywordOptimization: "تحسين الكلمات المفتاحية",
    atsCompatibility: "متوافق مع أنظمة تتبع المتقدمين",
    instantDownload: "تحميل فوري",
    personalizedCoverLetter: "خطاب تقديم مخصص",
    jobSpecificContent: "محتوى خاص بالوظيفة",
    professionalTone: "نبرة مهنية",
    multipleFormats: "تنسيقات متعددة",
    editableTemplate: "قالب قابل للتعديل",
    commonQuestions: "أسئلة شائعة في المقابلات",
    industrySpecificQuestions: "أسئلة خاصة بالصناعة",
    answerTemplates: "قوالب إجابات",
    confidenceBuilding: "نصائح بناء الثقة",
    practiceSimulations: "محاكاة التدريب",
    oneOnOneSession: "جلسة فردية",
    careerGoalSetting: "تحديد الأهداف المهنية",
    skillAssessment: "تقييم المهارات",
    personalizedPlan: "خطة عمل مخصصة",
    followUpSupport: "دعم المتابعة",
    
    // Time Periods
    month: "شهر",
    year: "سنة", 
    week: "أسبوع",
    day: "يوم",
    hour: "ساعة",
    
    // Dashboard & Charts
    totalMatchingJobs: "إجمالي الوظائف المطابقة",
    skillTrends: "اتجاهات المهارات",
    globalDemandFor: "الطلب العالمي على",
    flexible: "مرن",
    
    // Countries
    uae: "الإمارات العربية المتحدة",
    taiwan: "تايوان",
    india: "الهند",
    saudiArabia: "المملكة العربية السعودية",
    
    // Search & Job Filters
    filterJobsChoice: "قم بتصفية الوظائف التي تختارها",
    selectLocation: "اختر الموقع",
    selectJobType: "اختر نوع الوظيفة",
    yearsExperience: "سنتين",
    attendance: "الحضور",
    freelance: "العمل الحر",
    hideFilters: "إخفاء المرشحات",
    showFilters: "إظهار المرشحات",
    
    // Dashboard Components
    matchedJobs: "الوظائف المطابقة",
    
    // Resume Builder
    generateNewResume: "إنشاء سيرة ذاتية جديدة",
    checkGeneratedResume: "تحقق من السيرة الذاتية المُنشأة",
    resumeScore: "نقاط السيرة الذاتية",
    tips: "نصائح",
    generatingYourResume: "جاري إنشاء سيرتك الذاتية",
    pleaseWaitWhileGenerating: "يرجى الانتظار بينما ننشئ سيرتك الذاتية المهنية...",
    analyzingInformation: "جاري تحليل معلوماتك...",
    formattingResume: "جاري تنسيق سيرتك الذاتية...",
    applyingProfessionalStyling: "جاري تطبيق التصميم المهني...",
    finalizingResume: "جاري إنهاء سيرتك الذاتية...",
    
    // Resume Download & Export
    editorMode: "وضع التحرير",
    exportAs: "تصدير كـ",
    wordDocument: "مستند وورد",
    unlockFullResumeView: "إلغاء قفل عرض السيرة الذاتية الكامل",
    completePaymentToUnlock: "لعرض وتحميل سيرتك الذاتية بدون تشويش، يرجى إتمام الدفع.",
    paymentSuccessful: "تم الدفع بنجاح!",
    resumeNowUnlocked: "تم إلغاء قفل سيرتك الذاتية الآن.",
    resumeUnlockFee: "رسوم إلغاء قفل السيرة الذاتية",
    cardNumber: "رقم البطاقة",
    expiryDate: "تاريخ الانتهاء",
    cardholderName: "اسم حامل البطاقة",
    processing: "جاري المعالجة...",
    pay: "ادفع",
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

  const t = (key: string): string => {
    return (translations[language] as any)[key] || (translations.en as any)[key] || key;
  };

  return {
    t,
    language,
    isRTL: language === 'ar',
  };
} 