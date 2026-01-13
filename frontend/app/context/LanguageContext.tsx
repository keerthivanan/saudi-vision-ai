'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';
type Direction = 'ltr' | 'rtl';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations = {
  en: {
    Home: 'Home',
    Pillars: 'Pillars',
    Projects: 'Projects',
    Progress: 'Progress',
    AIAssistant: 'AI Assistant',
    Resources: 'Resources',
    LanguageName: 'English',
    // Hero Section
    HeroTagline: 'AI-Powered Kingdom Intelligence',
    HeroTitle1: 'Saudi Vision 2030',
    HeroTitle2: 'Intelligence Hub',
    HeroSubtitle: "AI-Powered Insights into the Kingdom's Transformation",
    SearchPlaceholder: 'Ask anything about Saudi Vision 2030...',
    Explore: 'Explore',
    TryAsking: 'Try asking:',
    Suggestion1: 'Economic diversification goals?',
    Suggestion2: 'NEOM project updates',
    Suggestion3: 'Green initiatives progress',
    // Pillars Section
    PillarsTitle: 'The Three Pillars of Transformation',
    Pillar1Title: 'Vibrant Society',
    Pillar1Desc: 'A vibrant society is the foundation of economic prosperity. We are building a society where everyone enjoys a high quality of life, a healthy lifestyle, and an attractive living environment.',
    Pillar2Title: 'Thriving Economy',
    Pillar2Desc: 'A thriving economy provides opportunities for all by building an education system aligned with market needs and creating economic opportunities for the entrepreneur, the small enterprise, and the large corporation.',
    Pillar3Title: 'Ambitious Nation',
    Pillar3Desc: 'An ambitious nation is built by an effective, transparent, accountable, enabling and high-performing government.',
    LearnMore: 'Learn More',
    // Chat Preview Section
    ChatPreSubtitle: 'Next-Gen AI',
    ChatPreTitle: 'Intelligent Q&A Assistant',
    AuthRequired: 'Authentication Required',
    AuthDesc: 'Access to the Enterprise Intelligence Engine is restricted to authorized personnel only.',
    SignInAccess: 'Sign In to Access',
    ChatPlaceholder: 'Ask anything about Vision 2030...',
    GuestPlaceholder: 'Please sign in to chat...',
    Analyzing: 'Analyzing Vision 2030 Data...',
    InitialUserMsg: 'What are the key economic targets for 2030?',
    InitialAIMsg: 'Detailed economic targets include raising the share of non-oil exports in non-oil GDP from 16% to 50% and increasing the Public Investment Fund\'s assets to 7T SAR.',
    // Metrics Section
    MetricsTitle: 'Transformation in Numbers',
    MetricsSubtitle: "Real-time data tracking the Kingdom's progress towards Vision 2030 goals.",
    MetricLabel1: 'Non-oil Revenue',
    MetricSub1: 'Contribution',
    MetricLabel2: 'Investment Volume',
    MetricSub2: 'SAR',
    MetricLabel3: 'Jobs Created',
    MetricSub3: 'Private Sector',
    MetricLabel4: 'Renewable Energy',
    MetricSub4: 'Target Mix',
    // Projects Section
    ProjectsTitle: 'Flagship Initiatives',
    ProjectsSubtitle: 'Giga-projects that are redefining the future of sustainable living and economic diversification.',
    ViewAllProjects: 'View All Projects',
    Project1Title: 'NEOM',
    Project1Desc: 'A vision of what a new future might look like. An attempt to do something that’s never been done before.',
    Project1Loc: 'Tabuk Province',
    Project2Title: 'Red Sea Project',
    Project2Desc: 'The world’s most ambitious regenerative tourism project, offering a luxury experience like no other.',
    Project2Loc: 'Red Sea Coast',
    Project3Title: 'Qiddiya',
    Project3Desc: 'The capital of entertainment, sports and the arts. A destination that will offer unique experiences.',
    Project3Loc: 'Riyadh',
    Project4Title: 'ROSHN',
    Project4Desc: 'Improving the quality of life of all citizens by developing huge communities across the Kingdom.',
    Project4Loc: 'Nationwide',
    ExploreProject: 'Explore Project',
    // KnowledgeBase Section
    KBTitle: 'Knowledge Base',
    KBSubtitle: 'Access official documents, reports, and strategic frameworks.',
    Cat1: 'Economic Reports',
    Cat2: 'Social Programs',
    Cat3: 'Infrastructure',
    Cat4: 'Innovation & Tech',
    Cat5: 'Sustainability',
    Cat6: 'Cultural Heritage',
    DocumentsCount: 'Documents',
    // Chat Sidebar & Interface
    NewChat: 'New Chat',
    History: 'History',
    Today: 'Today',
    Yesterday: 'Yesterday',
    LastWeek: 'Last Week',
    Chat1: 'Vision 2030 Goals',
    Chat2: 'NEOM Project details',
    Chat3: 'Green Riyadh Initiative',
    ProPlan: 'Pro Plan',
    GoHome: 'Go Home',
    WelcomeMessage: 'Welcome to the Enterprise Intelligence Hub. I am your specialized assistant for Saudi Vision 2030 data. How can I help you today?',
    Processing: 'Processing...',
    MessagePlaceholder: 'Message Vision 2030...',
    AIWarning: 'AI can make mistakes. Consider checking important information.',
    ConnectionError: 'I encountered an error connecting to the knowledge base. Please try again.',
    // Resources / Knowledge Base
    ResTitle: 'Strategic Knowledge Base',
    ResSubtitle: 'Access official reports, strategic frameworks, and data sheets powering the Saudi Vision 2030 AI.',
    SearchRes: 'Search documents, reports, and data...',
    ResCatAll: 'All Resources',
    ResCatEco: 'Economy & Investment',
    ResCatSoc: 'Society & Culture',
    ResCatEnv: 'Environment & Sus.',
    ResCatTech: 'Tech & Future',
    // Mock Doc Titles
    Doc1Title: 'Vision 2030 Strategic Framework',
    Doc1Desc: 'The comprehensive roadmap for the Kingdoms economic and social transformation.',
    Doc2Title: 'NEOM: The Line Concept Paper',
    Doc2Desc: 'Technical specifications and urban planning philosophy behind the linear city.',
    Doc3Title: 'Green Saudi Initiative Report 2024',
    Doc3Desc: 'Progress report on afforestation, carbon reduction, and renewable energy targets.',
    Doc4Title: 'National Investment Strategy',
    Doc4Desc: 'Key sectors and opportunities for domestic and international investors.',
    Doc5Title: 'Qiddiya Entertainment Masterplan',
    Doc5Desc: 'Overview of the upcoming entertainment, sports, and arts district.',
    Doc6Title: 'Digital Economy Policy',
    Doc6Desc: 'Regulations and guidelines fostering the growth of the digital sector.',
    Download: 'Download',
    AnalyzeWithAI: 'Ask AI about this',
    // Footer Section
    FooterTagline: 'Empowering the future with Data & AI.',
    QuickLinks: 'Quick Links',
    ContactUs: 'Contact Us',
    Subscribe: 'Subscribe to Updates',
    EmailPlaceholder: 'Enter your email',
    SubscribeBtn: 'Subscribe',
    RightsReserved: 'All rights reserved.',
    PrivacyPolicy: 'Privacy Policy',
    TermsOfService: 'Terms of Service',
  },
  ar: {
    Home: 'الرئيسية',
    Pillars: 'الركائز',
    Projects: 'المشاريع',
    Progress: 'التقدم',
    AIAssistant: 'المساعد الذكي',
    Resources: 'الموارد',
    LanguageName: 'العربية',
    // Hero Section
    HeroTagline: 'ذكاء اصطناعي للمملكة',
    HeroTitle1: 'رؤية المملكة 2030',
    HeroTitle2: 'مركز الذكاء',
    HeroSubtitle: 'رؤى مدعومة بالذكاء الاصطناعي لتحول المملكة',
    SearchPlaceholder: 'اسأل أي شيء عن رؤية المملكة 2030...',
    Explore: 'استكشف',
    TryAsking: 'جرب أن تسأل:',
    Suggestion1: 'أهداف التنويع الاقتصادي؟',
    Suggestion2: 'تحديثات مشروع نيوم',
    Suggestion3: 'تقدم المبادرات الخضراء',
    // Pillars Section
    PillarsTitle: 'ركائز التحول الثلاث',
    Pillar1Title: 'مجتمع حيوي',
    Pillar1Desc: 'المجتمع الحيوي هو أساس الازدهار الاقتصادي. نحن نبني مجتمعاً يتمتع فيه الجميع بجودة حياة عالية، ونمط حياة صحي، وبيئة معيشية جاذبة.',
    Pillar2Title: 'اقتصاد مزدهر',
    Pillar2Desc: 'الاقتصاد المزدهر يوفر الفرص للجميع من خلال بناء نظام تعليمي يتماشى مع احتياجات السوق وخلق فرص اقتصادية لرواد الأعمال، والمنشآت الصغيرة، والشركات الكبرى.',
    Pillar3Title: 'وطن طموح',
    Pillar3Desc: 'الوطن الطموح يُبنى من خلال حكومة فعالة، شفافة، مسؤولة، وممكنة ذات أداء عالٍ.',
    LearnMore: 'اعرف المزيد',
    // Chat Preview Section
    ChatPreSubtitle: 'الجيل القادم من الذكاء الاصطناعي',
    ChatPreTitle: 'مساعد الأسئلة والأجوبة الذكي',
    AuthRequired: 'تجب المصادقة',
    AuthDesc: 'الوصول إلى محرك ذكاء المؤسسة مقصور على الموظفين المصرح لهم فقط.',
    SignInAccess: 'تسجيل الدخول للوصول',
    ChatPlaceholder: 'اسأل أي شيء عن رؤية 2030...',
    GuestPlaceholder: 'الرجاء تسجيل الدخول للدردشة...',
    Analyzing: 'جاري تحليل بيانات رؤية 2030...',
    InitialUserMsg: 'ما هي الأهداف الاقتصادية الرئيسية لعام 2030؟',
    InitialAIMsg: 'تشمل الأهداف الاقتصادية التفصيلية رفع حصة الصادرات غير النفطية من إجمالي الناتج المحلي غير النفطي من 16% إلى 50% وزيادة أصول صندوق الاستثمارات العامة إلى 7 تريليون ريال.',
    // Metrics Section
    MetricsTitle: 'التحول في أرقام',
    MetricsSubtitle: 'بيانات فورية تتبع تقدم المملكة نحو أهداف رؤية 2030.',
    MetricLabel1: 'الإيرادات غير النفطية',
    MetricSub1: 'المساهمة',
    MetricLabel2: 'حجم الاستثمار',
    MetricSub2: 'ريال سعودي',
    MetricLabel3: 'الوظائف المستحدثة',
    MetricSub3: 'القطاع الخاص',
    MetricLabel4: 'الطاقة المتجددة',
    MetricSub4: 'المزيج المستهدف',
    // Projects Section
    ProjectsTitle: 'المبادرات الرائدة',
    ProjectsSubtitle: 'المشاريع العملاقة التي تعيد تعريف مستقبل الحياة المستدامة والتنويع الاقتصادي.',
    ViewAllProjects: 'عرض جميع المشاريع',
    Project1Title: 'نيوم',
    Project1Desc: 'رؤية لما سيبدو عليه المستقبل الجديد. ومحاولة للقيام بشيء لم يسبق له مثيل.',
    Project1Loc: 'منطقة تبوك',
    Project2Title: 'مشروع البحر الأحمر',
    Project2Desc: 'أكثر مشاريع السياحة المتجددة طموحًا في العالم، حيث يقدم تجربة فاخرة لا مثيل لها.',
    Project2Loc: 'ساحل البحر الأحمر',
    Project3Title: 'القدية',
    Project3Desc: 'عاصمة الترفيه والرياضة والفنون. وجهة ستقدم تجارب فريدة من نوعها.',
    Project3Loc: 'الرياض',
    Project4Title: 'روشن',
    Project4Desc: 'تحسين جودة الحياة لجميع المواطنين من خلال تطوير مجتمعات ضخمة في جميع أنحاء المملكة.',
    Project4Loc: 'على مستوى المملكة',
    ExploreProject: 'استكشف المشروع',
    // KnowledgeBase Section
    KBTitle: 'قاعدة المعرفة',
    KBSubtitle: 'الوصول إلى الوثائق الرسمية، التقارير، وأطر العمل الاستراتيجية.',
    Cat1: 'التقارير الاقتصادية',
    Cat2: 'البرامج الاجتماعية',
    Cat3: 'البنية التحتية',
    Cat4: 'الابتكار والتقنية',
    Cat5: 'الاستدامة',
    Cat6: 'التراث الثقافي',
    DocumentsCount: 'وثيقة',
    // Chat Sidebar & Interface
    NewChat: 'محادثة جديدة',
    History: 'السجل',
    Today: 'اليوم',
    Yesterday: 'الأمس',
    LastWeek: 'الأسبوع الماضي',
    Chat1: 'أهداف رؤية 2030',
    Chat2: 'تفاصيل مشروع نيوم',
    Chat3: 'مبادرة الرياض الخضراء',
    ProPlan: 'الخطة الاحترافية',
    GoHome: 'العودة للرئيسية',
    WelcomeMessage: 'مرحباً بك في مركز ذكاء المؤسسة. أنا مساعدك المتخصص لبيانات رؤية المملكة 2030. كيف يمكنني مساعدتك اليوم؟',
    Processing: 'جاري المعالجة...',
    MessagePlaceholder: 'راسل رؤية 2030...',
    AIWarning: 'قد يرتكب الذكاء الاصطناعي أخطاء. يرجى التحقق من المعلومات المهمة.',
    ConnectionError: 'واجهت خطأ في الاتصال بقاعدة المعرفة. يرجى المحاولة مرة أخرى.',
    // Resources / Knowledge Base
    ResTitle: 'قاعدة المعرفة الاستراتيجية',
    ResSubtitle: 'الوصول إلى التقارير الرسمية والأطر الاستراتيجية وأوراق البيانات التي تدعم ذكاء رؤية 2030.',
    SearchRes: 'ابحث في المستندات والتقارير والبيانات...',
    ResCatAll: 'كل المصادر',
    ResCatEco: 'الاقتصاد والاستثمار',
    ResCatSoc: 'المجتمع والثقافة',
    ResCatEnv: 'البيئة والاستدامة',
    ResCatTech: 'التقنية والمستقبل',
    // Mock Doc Titles
    Doc1Title: 'إطار رؤية المملكة 2030',
    Doc1Desc: 'خارطة الطريق الشاملة للتحول الاقتصادي والاجتماعي للمملكة.',
    Doc2Title: 'نيوم: ورقة مفاهيم ذا لاين',
    Doc2Desc: 'المواصفات الفنية وفلسفة التخطيط الحضري للمدينة الخطية.',
    Doc3Title: 'تقرير مبادرة السعودية الخضراء 2024',
    Doc3Desc: 'تقرير التقدم المحرز في أهداف التشجير وخفض الكربون والطاقة المتجددة.',
    Doc4Title: 'استراتيجية الاستثمار الوطنية',
    Doc4Desc: 'القطاعات الرئيسية والفرص المتاحة للمستثمرين المحليين والدوليين.',
    Doc5Title: 'المخطط العام للقدية',
    Doc5Desc: 'نظرة عامة على منطقة الترفيه والرياضة والفنون القادمة.',
    Doc6Title: 'سياسة الاقتصاد الرقمي',
    Doc6Desc: 'الأنظمة والمبادئ التوجيهية التي تعزز نمو القطاع الرقمي.',
    Download: 'تحميل',
    AnalyzeWithAI: 'اسأل الذكاء الاصطناعي',
    // Footer Section
    FooterTagline: 'تمكين المستقبل بالبيانات والذكاء الاصطناعي.',
    QuickLinks: 'روابط سريعة',
    ContactUs: 'اتصل بنا',
    Subscribe: 'اشترك في التحديثات',
    EmailPlaceholder: 'أدخل بريدك الإلكتروني',
    SubscribeBtn: 'اشترك',
    RightsReserved: 'جميع الحقوق محفوظة.',
    PrivacyPolicy: 'سياسة الخصوصية',
    TermsOfService: 'شروط الخدمة',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [direction, setDirection] = useState<Direction>('ltr');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang) {
      setLanguage(savedLang);
      setDirection(savedLang === 'ar' ? 'rtl' : 'ltr');
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    localStorage.setItem('language', language);
  }, [language, direction]);

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const newLang = prev === 'en' ? 'ar' : 'en';
      setDirection(newLang === 'ar' ? 'rtl' : 'ltr');
      return newLang;
    });
  };

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  // Type-casting Provider to avoid Next.js 14 / React 18 type conflicts
  const Provider = LanguageContext.Provider as any;

  return (
    <Provider value={{ language, direction, toggleLanguage, t }}>
      {children}
    </Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
