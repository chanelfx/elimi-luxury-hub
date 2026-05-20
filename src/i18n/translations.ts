export type Language = "en" | "fr" | "rw";

export const LANGUAGES: { code: Language; label: string; native: string; flag: string }[] = [
  { code: "en", label: "English", native: "English", flag: "🇬🇧" },
  { code: "fr", label: "French", native: "Français", flag: "🇫🇷" },
  { code: "rw", label: "Kinyarwanda", native: "Kinyarwanda", flag: "🇷🇼" },
];

export interface TranslationKey {
  brand: string;
  tagline: string;
  chooseLanguage: string;
  chooseLanguageSub: string;
  continue: string;
  nav: { home: string; products: string; categories: string; about: string; contact: string; login: string };
  home: {
    heroEyebrow: string; heroTitle: string; heroSubtitle: string;
    browseProducts: string; contactUs: string;
    categoriesTitle: string; categoriesSub: string;
    featuredTitle: string; featuredSub: string;
    trendingTitle: string; newTitle: string; viewAll: string;
  };
  products: {
    title: string; subtitle: string; search: string; filterBy: string; sortBy: string;
    newest: string; priceLow: string; priceHigh: string; mostLiked: string;
    allCategories: string; noResults: string; noResultsSub: string; from: string;
  };
  product: {
    contactWhatsApp: string; contactCall: string; details: string; description: string;
    location: string; condition: string; brand: string; uploaded: string;
    sold: string; reserved: string; pending: string; available: string;
    back: string; relatedTitle: string; shareMessage: string;
  };
  categories: {
    realEstate: string; land: string; vehicles: string; cars: string; motorcycles: string;
    trucks: string; computers: string; laptops: string; smartphones: string; tablets: string;
    electronics: string; tvs: string; cameras: string; furniture: string; fashion: string;
    accessories: string; rentals: string; services: string; homeEquipment: string;
    officeEquipment: string; others: string;
  };
  about: {
    title: string; subtitle: string; missionTitle: string; mission: string;
    visionTitle: string; vision: string; valuesTitle: string;
    values: { title: string; desc: string }[];
  };
  contact: {
    title: string; subtitle: string; phone: string; whatsapp: string; email: string;
    followUs: string; sendMessage: string; name: string; message: string; send: string;
  };
  footer: { tagline: string; quickLinks: string; categories: string; contact: string; rights: string };
  common: { loading: string; error: string; retry: string; changeLanguage: string };
}

export const translations: Record<Language, TranslationKey> = {
  en: {
    brand: "Elimi Trust Ltd",
    tagline: "Rwanda's Premium Classified Marketplace",
    chooseLanguage: "Choose your language",
    chooseLanguageSub: "Select your preferred language to continue",
    continue: "Continue",
    nav: {
      home: "Home",
      products: "Products",
      categories: "Categories",
      about: "About",
      contact: "Contact",
      login: "Staff Login",
    },
    home: {
      heroEyebrow: "Trusted Marketplace · Since 1996",
      heroTitle: "Discover Premium Listings Across Rwanda",
      heroSubtitle:
        "Real estate, vehicles, electronics, fashion and more — curated by Elimi Trust Ltd.",
      browseProducts: "Browse Products",
      contactUs: "Contact Us",
      categoriesTitle: "Browse by Category",
      categoriesSub: "Find exactly what you're looking for",
      featuredTitle: "Featured Listings",
      featuredSub: "Hand-picked products from our catalog",
      trendingTitle: "Trending Now",
      newTitle: "Recently Added",
      viewAll: "View all",
    },
    products: {
      title: "All Products",
      subtitle: "Browse our complete catalog",
      search: "Search products...",
      filterBy: "Filter by",
      sortBy: "Sort by",
      newest: "Newest",
      priceLow: "Price: Low to High",
      priceHigh: "Price: High to Low",
      mostLiked: "Most Liked",
      allCategories: "All Categories",
      noResults: "No products found",
      noResultsSub: "Try adjusting your filters or search terms",
      from: "From",
    },
    product: {
      contactWhatsApp: "Contact via WhatsApp",
      contactCall: "Call Now",
      details: "Details",
      description: "Description",
      location: "Location",
      condition: "Condition",
      brand: "Brand",
      uploaded: "Uploaded",
      sold: "SOLD",
      reserved: "RESERVED",
      pending: "PENDING",
      available: "Available",
      back: "Back to products",
      relatedTitle: "You might also like",
      shareMessage: "Hello, I am interested in this product:",
    },
    categories: {
      realEstate: "Real Estate",
      land: "Land",
      vehicles: "Vehicles",
      cars: "Cars",
      motorcycles: "Motorcycles",
      trucks: "Trucks",
      computers: "Computers",
      laptops: "Laptops",
      smartphones: "Smartphones",
      tablets: "Tablets",
      electronics: "Electronics",
      tvs: "TVs",
      cameras: "Cameras",
      furniture: "Furniture",
      fashion: "Fashion",
      accessories: "Accessories",
      rentals: "Rentals",
      services: "Services",
      homeEquipment: "Home Equipment",
      officeEquipment: "Office Equipment",
      others: "Others",
    },
    about: {
      title: "About Elimi Trust Ltd",
      subtitle: "Rwanda's trusted marketplace platform",
      missionTitle: "Our Mission",
      mission:
        "To build Rwanda's most trusted classified marketplace — connecting buyers and sellers across real estate, vehicles, electronics, fashion, and beyond with transparency, security, and excellence.",
      visionTitle: "Our Vision",
      vision:
        "To become East Africa's leading premium marketplace, recognized for trust, quality listings, and outstanding service.",
      valuesTitle: "Our Values",
      values: [
        { title: "Trust", desc: "Every listing is verified and curated by our team." },
        { title: "Quality", desc: "We feature only premium, well-described products." },
        { title: "Service", desc: "Direct WhatsApp contact for fast, personal support." },
        { title: "Reach", desc: "Connecting buyers and sellers across all of Rwanda." },
      ],
    },
    contact: {
      title: "Get in Touch",
      subtitle: "We're here to help — reach us through any channel below",
      phone: "Phone",
      whatsapp: "WhatsApp",
      email: "Email",
      followUs: "Follow Us",
      sendMessage: "Send us a message",
      name: "Your name",
      message: "Your message",
      send: "Send Message",
    },
    footer: {
      tagline: "Rwanda's Premium Classified Marketplace",
      quickLinks: "Quick Links",
      categories: "Categories",
      contact: "Contact",
      rights: "All rights reserved.",
    },
    common: {
      loading: "Loading...",
      error: "Something went wrong",
      retry: "Try again",
      changeLanguage: "Change language",
    },
  },
  fr: {
    brand: "Elimi Trust Ltd",
    tagline: "La Marketplace Premium du Rwanda",
    chooseLanguage: "Choisissez votre langue",
    chooseLanguageSub: "Sélectionnez votre langue préférée pour continuer",
    continue: "Continuer",
    nav: {
      home: "Accueil",
      products: "Produits",
      categories: "Catégories",
      about: "À propos",
      contact: "Contact",
      login: "Connexion Staff",
    },
    home: {
      heroEyebrow: "Marketplace de confiance · Depuis 1996",
      heroTitle: "Découvrez des annonces premium au Rwanda",
      heroSubtitle:
        "Immobilier, véhicules, électronique, mode et plus — sélectionnés par Elimi Trust Ltd.",
      browseProducts: "Voir les produits",
      contactUs: "Nous contacter",
      categoriesTitle: "Parcourir par catégorie",
      categoriesSub: "Trouvez exactement ce que vous cherchez",
      featuredTitle: "Annonces en vedette",
      featuredSub: "Produits sélectionnés de notre catalogue",
      trendingTitle: "Tendances",
      newTitle: "Récemment ajouté",
      viewAll: "Voir tout",
    },
    products: {
      title: "Tous les produits",
      subtitle: "Parcourez notre catalogue complet",
      search: "Rechercher des produits...",
      filterBy: "Filtrer par",
      sortBy: "Trier par",
      newest: "Plus récents",
      priceLow: "Prix : croissant",
      priceHigh: "Prix : décroissant",
      mostLiked: "Plus aimés",
      allCategories: "Toutes les catégories",
      noResults: "Aucun produit trouvé",
      noResultsSub: "Essayez d'ajuster vos filtres",
      from: "À partir de",
    },
    product: {
      contactWhatsApp: "Contacter via WhatsApp",
      contactCall: "Appeler",
      details: "Détails",
      description: "Description",
      location: "Localisation",
      condition: "État",
      brand: "Marque",
      uploaded: "Publié",
      sold: "VENDU",
      reserved: "RÉSERVÉ",
      pending: "EN ATTENTE",
      available: "Disponible",
      back: "Retour aux produits",
      relatedTitle: "Vous pourriez aussi aimer",
      shareMessage: "Bonjour, je suis intéressé par ce produit :",
    },
    categories: {
      realEstate: "Immobilier",
      land: "Terrains",
      vehicles: "Véhicules",
      cars: "Voitures",
      motorcycles: "Motos",
      trucks: "Camions",
      computers: "Ordinateurs",
      laptops: "Portables",
      smartphones: "Smartphones",
      tablets: "Tablettes",
      electronics: "Électronique",
      tvs: "Télévisions",
      cameras: "Appareils photo",
      furniture: "Meubles",
      fashion: "Mode",
      accessories: "Accessoires",
      rentals: "Locations",
      services: "Services",
      homeEquipment: "Équipement maison",
      officeEquipment: "Équipement bureau",
      others: "Autres",
    },
    about: {
      title: "À propos d'Elimi Trust Ltd",
      subtitle: "La plateforme marketplace de confiance du Rwanda",
      missionTitle: "Notre mission",
      mission:
        "Bâtir la marketplace classée la plus fiable du Rwanda — connecter acheteurs et vendeurs dans l'immobilier, les véhicules, l'électronique, la mode et au-delà avec transparence et excellence.",
      visionTitle: "Notre vision",
      vision:
        "Devenir la marketplace premium leader d'Afrique de l'Est, reconnue pour la confiance et la qualité.",
      valuesTitle: "Nos valeurs",
      values: [
        { title: "Confiance", desc: "Chaque annonce est vérifiée par notre équipe." },
        { title: "Qualité", desc: "Uniquement des produits premium bien décrits." },
        { title: "Service", desc: "Contact direct WhatsApp pour un support rapide." },
        { title: "Portée", desc: "Connecter acheteurs et vendeurs dans tout le Rwanda." },
      ],
    },
    contact: {
      title: "Contactez-nous",
      subtitle: "Nous sommes là pour vous aider",
      phone: "Téléphone",
      whatsapp: "WhatsApp",
      email: "Email",
      followUs: "Suivez-nous",
      sendMessage: "Envoyez-nous un message",
      name: "Votre nom",
      message: "Votre message",
      send: "Envoyer",
    },
    footer: {
      tagline: "La Marketplace Premium du Rwanda",
      quickLinks: "Liens rapides",
      categories: "Catégories",
      contact: "Contact",
      rights: "Tous droits réservés.",
    },
    common: {
      loading: "Chargement...",
      error: "Une erreur est survenue",
      retry: "Réessayer",
      changeLanguage: "Changer de langue",
    },
  },
  rw: {
    brand: "Elimi Trust Ltd",
    tagline: "Isoko Rikomeye ry'u Rwanda",
    chooseLanguage: "Hitamo ururimi rwawe",
    chooseLanguageSub: "Hitamo ururimi ushaka gukoresha",
    continue: "Komeza",
    nav: {
      home: "Ahabanza",
      products: "Ibicuruzwa",
      categories: "Ibyiciro",
      about: "Ibitwerekeyeho",
      contact: "Twandikire",
      login: "Injira (Abakozi)",
    },
    home: {
      heroEyebrow: "Isoko ryizewe · Kuva 1996",
      heroTitle: "Sanga ibicuruzwa byiza mu Rwanda",
      heroSubtitle:
        "Imitungo, ibinyabiziga, ibikoresho bya elegitoroniki, imyenda n'ibindi — bitanzwe na Elimi Trust Ltd.",
      browseProducts: "Reba ibicuruzwa",
      contactUs: "Tuvugishe",
      categoriesTitle: "Shakisha ku byiciro",
      categoriesSub: "Bona neza icyo ushaka",
      featuredTitle: "Ibicuruzwa byatoranijwe",
      featuredSub: "Ibyatoranijwe mu rutonde rwacu",
      trendingTitle: "Bikunzwe ubu",
      newTitle: "Bishyizweho vuba",
      viewAll: "Reba byose",
    },
    products: {
      title: "Ibicuruzwa byose",
      subtitle: "Reba urutonde rwacu rwose",
      search: "Shakisha ibicuruzwa...",
      filterBy: "Shungura",
      sortBy: "Tondeka",
      newest: "Bishya",
      priceLow: "Igiciro: gito → kinini",
      priceHigh: "Igiciro: kinini → gito",
      mostLiked: "Bikunzwe cyane",
      allCategories: "Ibyiciro byose",
      noResults: "Nta gicuruzwa cyabonetse",
      noResultsSub: "Gerageza guhindura ibyo ushakisha",
      from: "Kuva",
    },
    product: {
      contactWhatsApp: "Vugisha kuri WhatsApp",
      contactCall: "Hamagara",
      details: "Ibisobanuro",
      description: "Ibisobanuro",
      location: "Aho biherereye",
      condition: "Imimerere",
      brand: "Ubwoko",
      uploaded: "Byashyizweho",
      sold: "BYAGUZWE",
      reserved: "BYABITSWE",
      pending: "BITEGEREJE",
      available: "Birahari",
      back: "Garuka ku bicuruzwa",
      relatedTitle: "Ushobora no gukunda",
      shareMessage: "Muraho, nshishikajwe n'iki gicuruzwa:",
    },
    categories: {
      realEstate: "Imitungo",
      land: "Imirima",
      vehicles: "Ibinyabiziga",
      cars: "Imodoka",
      motorcycles: "Pikipiki",
      trucks: "Amakamyo",
      computers: "Mudasobwa",
      laptops: "Mudasobwa zo gutwara",
      smartphones: "Telefoni",
      tablets: "Tabuleti",
      electronics: "Elegitoroniki",
      tvs: "Televiziyo",
      cameras: "Amakamera",
      furniture: "Ibikoresho byo mu nzu",
      fashion: "Imyenda",
      accessories: "Ibyuma byiyongera",
      rentals: "Bikodeshwa",
      services: "Serivisi",
      homeEquipment: "Ibikoresho byo mu rugo",
      officeEquipment: "Ibikoresho byo ku kazi",
      others: "Ibindi",
    },
    about: {
      title: "Ibyerekeye Elimi Trust Ltd",
      subtitle: "Urubuga rw'isoko ryizewe mu Rwanda",
      missionTitle: "Intego yacu",
      mission:
        "Kubaka isoko ryizewe cyane mu Rwanda — guhuza abaguzi n'abagurisha mu mitungo, ibinyabiziga, elegitoroniki, imyenda n'ibindi.",
      visionTitle: "Icyerekezo cyacu",
      vision:
        "Kuba isoko rya mbere rikomeye muri Afurika y'Iburasirazuba, rizwiho icyizere n'ireme.",
      valuesTitle: "Indangagaciro zacu",
      values: [
        { title: "Icyizere", desc: "Buri gicuruzwa kigenzurwa n'itsinda ryacu." },
        { title: "Ireme", desc: "Ibicuruzwa byiza gusa bisobanuwe neza." },
        { title: "Serivisi", desc: "Twandikire kuri WhatsApp ako kanya." },
        { title: "Ubugari", desc: "Guhuza abaguzi n'abagurisha mu Rwanda rwose." },
      ],
    },
    contact: {
      title: "Twandikire",
      subtitle: "Turi hano kugufasha",
      phone: "Telefoni",
      whatsapp: "WhatsApp",
      email: "Imeri",
      followUs: "Dukurikire",
      sendMessage: "Twoherereze ubutumwa",
      name: "Izina ryawe",
      message: "Ubutumwa bwawe",
      send: "Ohereza",
    },
    footer: {
      tagline: "Isoko Rikomeye ry'u Rwanda",
      quickLinks: "Ihuza ryihuse",
      categories: "Ibyiciro",
      contact: "Twandikire",
      rights: "Uburenganzira bwose burabitswe.",
    },
    common: {
      loading: "Birapakira...",
      error: "Hari ikibazo cyabaye",
      retry: "Ongera ugerageze",
      changeLanguage: "Hindura ururimi",
    },
  },
};
