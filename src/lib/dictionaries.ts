export type Locale = 'en' | 'es' | 'fr' | 'fa';

export const dictionaries = {
  en: {
    nav: {
      about: 'About',
      articles: 'Articles',
      blog: 'Blog',
      topics: 'Topics',
      papers: 'Papers',
      books: 'Books',
      graph: 'Graph',
      formulas: 'Formulas',
      askAi: 'Ask AI',
      positioning: 'Positioning',
      muLevels: 'μ-Levels',
    },
    footer: {
      description: 'A theoretical physics framework proposing deterministic, self-similar dynamics governing complex systems from quantum substrate to cosmological scales.',
      navigate: 'Navigate',
      external: 'External',
      privacy: 'Privacy',
      terms: 'Terms',
      disclaimer: 'This is an unsupervised AI translation. Please refer to the English version for the definitive text.',
    }
  },
  es: {
    nav: {
      about: 'Acerca',
      articles: 'Artículos',
      blog: 'Blog',
      topics: 'Temas',
      papers: 'Papers',
      books: 'Libros',
      graph: 'Grafo',
      formulas: 'Fórmulas',
      askAi: 'Preguntar a IA',
      positioning: 'Posicionamiento',
      muLevels: 'Niveles-μ',
    },
    footer: {
      description: 'Un marco de física teórica que propone dinámicas deterministas y autosimilares que gobiernan sistemas complejos desde el sustrato cuántico hasta escalas cosmológicas.',
      navigate: 'Navegar',
      external: 'Externo',
      privacy: 'Privacidad',
      terms: 'Términos',
      disclaimer: 'Esta es una traducción no supervisada realizada por IA. Por favor, consulte la versión en inglés para el texto definitivo.',
    }
  },
  fr: {
    nav: {
      about: 'À propos',
      articles: 'Articles',
      blog: 'Blog',
      topics: 'Sujets',
      papers: 'Papiers',
      books: 'Livres',
      graph: 'Graphe',
      formulas: 'Formules',
      askAi: 'Demander à l\'IA',
      positioning: 'Positionnement',
      muLevels: 'Niveaux-μ',
    },
    footer: {
      description: 'Un cadre de physique théorique proposant des dynamiques déterministes et auto-similaires régissant les systèmes complexes du substrat quantique aux échelles cosmologiques.',
      navigate: 'Naviguer',
      external: 'Externe',
      privacy: 'Confidentialité',
      terms: 'Termes',
      disclaimer: 'Ceci est une traduction non supervisée réalisée par une IA. Veuillez vous référer à la version anglaise pour le texte définitif.',
    }
  },
  fa: {
    nav: {
      about: 'درباره',
      articles: 'مقالات',
      blog: 'وبلاگ',
      topics: 'موضوعات',
      papers: 'مقاله‌ها',
      books: 'کتاب‌ها',
      graph: 'گراف',
      formulas: 'فرمول‌ها',
      askAi: 'پرسش از هوش مصنوعی',
      positioning: 'موقعیت‌یابی',
      muLevels: 'سطوح-μ',
    },
    footer: {
      description: 'یک چارچوب فیزیک نظری که دینامیک دترمنیستی و خود-متشابه حاکم بر سیستم‌های پیچیده را از زیرلایه کوانتومی تا مقیاس‌های کیهانی پیشنهاد می‌کند.',
      navigate: 'ناوبری',
      external: 'خارجی',
      privacy: 'حریم خصوصی',
      terms: 'شرایط',
      disclaimer: 'این یک ترجمه نظارت‌نشده توسط هوش مصنوعی است. لطفاً برای متن قطعی به نسخه انگلیسی مراجعه کنید.',
    }
  }
};

export function getDictionary(lang: string) {
  return dictionaries[lang as Locale] || dictionaries['en'];
}
