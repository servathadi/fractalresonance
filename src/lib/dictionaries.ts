export type Locale = 'en' | 'es' | 'fr' | 'fa';

export const dictionaries = {
  en: {
    nav: {
      about: 'About',
      articles: 'Articles',
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
    }
  },
  es: {
    nav: {
      about: 'Acerca',
      articles: 'Artículos',
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
    }
  },
  fr: {
    nav: {
      about: 'À propos',
      articles: 'Articles',
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
    }
  },
  fa: {
    nav: {
      about: 'درباره',
      articles: 'مقالات',
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
    }
  }
};

export function getDictionary(lang: string) {
  return dictionaries[lang as Locale] || dictionaries['en'];
}
