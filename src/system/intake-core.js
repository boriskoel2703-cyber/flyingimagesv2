var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// ../port/lib/newclient.ts
var NC_SECTIONS = [
  {
    id: "01",
    title: "01 Merkidentiteit",
    note: "Er is nog geen website om uit te putten \u2014 dit zijn de antwoorden die het hele brandbook dragen. Noteer de woorden van de klant, niet je eigen samenvatting.",
    questions: [
      {
        id: "q1_1",
        label: "In \xE9\xE9n zin: wat doet het bedrijf, en voor wie?",
        hint: "Zoals de eigenaar het aan de telefoon zou zeggen.",
        needed: true
      },
      {
        id: "q1_2",
        label: "Sinds wanneer bestaat het bedrijf, en wat deed de eigenaar daarvoor?",
        chips: ["Net gestart (dit jaar)", "15+ jaar / familiebedrijf"]
      },
      {
        id: "q1_3",
        label: "Wat maakt dit bedrijf anders dan de concurrent om de hoek?",
        needed: true,
        chips: ["Persoonlijke aanpak", "Snelheid en flexibiliteit", "Prijs-kwaliteitverhouding", "Vakmanschap en ervaring", "Duurzaamheid", "Nieuwste technieken"]
      },
      {
        id: "q1_4",
        label: "Wat moeten klanten achteraf over dit bedrijf zeggen tegen anderen?",
        chips: ["Ze deden precies wat ze beloofden", "Supervriendelijk en behulpzaam", "Snel en zonder gedoe", "Echt vakwerk", "Eerlijk en transparant"]
      },
      {
        id: "q1_5",
        label: "Tagline of slogan",
        hint: "Nog niets? Laat leeg \u2014 dan stelt het brandbook er zelf \xE9\xE9n voor.",
        chips: ["Nog niets \u2014 laat het brandbook er zelf \xE9\xE9n voorstellen"]
      }
    ]
  },
  {
    id: "02",
    title: "02 Kernwaarden",
    note: "Drie tot vijf waarden zijn genoeg. Vraag door tot er een concreet voorbeeld op tafel ligt \u2014 zonder voorbeeld blijft het een loze lijst.",
    questions: [
      {
        id: "q2_1",
        label: "3 tot 5 kernwaarden",
        chips: ["Betrouwbaar", "Persoonlijk", "Vakmanschap", "Snel", "Eerlijk", "Flexibel", "Kwaliteit", "No-nonsense"],
        chipsMulti: true,
        chipsMax: 5
      },
      {
        id: "q2_2",
        label: "Belangrijkste waarde, en waarom juist die?",
        chips: ["Betrouwbaar", "Persoonlijk", "Vakmanschap", "Snel", "Eerlijk", "Flexibel", "Kwaliteit", "No-nonsense"]
      },
      {
        id: "q2_3",
        label: "Een moment waarop die waarde echt bleek",
        hint: "Concreet verhaal \u2014 dit wordt vaak letterlijk sitetekst.",
        chips: ["Nog geen concreet voorbeeld \u2014 later aanvullen"]
      }
    ]
  },
  {
    id: "03",
    title: "03 Doelgroep & werkgebied",
    questions: [
      {
        id: "q3_1",
        label: "Wie is de ideale klant?",
        hint: "Particulier of zakelijk, type woning/bedrijf, budget.",
        needed: true,
        chips: ["Particulieren", "Zakelijke klanten (MKB)", "Beide particulier en zakelijk", "Specifieke doelgroep"]
      },
      {
        id: "q3_2",
        label: "In welke situatie zoekt die klant dit bedrijf op?",
        chips: ["Verhuizing/nieuwe woning", "Renovatie of onderhoud", "Speciale gelegenheid", "Acuut probleem/spoed", "Regelmatig terugkerende behoefte"]
      },
      {
        id: "q3_3",
        label: "Grootste twijfel of drempel v\xF3\xF3r klanten in zee gaan",
        chips: ["Prijs onduidelijk", "Vertrouwen/ervaring onbekend", "Beschikbaarheid/planning", "Kwaliteit onzeker"]
      },
      {
        id: "q3_4",
        label: "Werkgebied",
        hint: "Kies de reikwijdte met een chip; extra plaatsnamen typ je erbij.",
        needed: true,
        chips: ["Zeewolde", "Zeewolde en omstreken", "Flevoland", "Nederland", "Benelux"]
      },
      {
        id: "q3_5",
        label: "3 dingen die klanten all\xE9\xE9n bij dit bedrijf krijgen",
        chips: ["Persoonlijk contact met de eigenaar", "Vaste prijsafspraken vooraf", "Garantie op het werk", "Snelle reactietijd"]
      }
    ]
  },
  {
    id: "04",
    title: "04 Diensten",
    note: "Zet elke dienst apart neer. Deze lijst bepaalt straks de dienstenpagina's \xE9n de dienstensectie in het brandbook.",
    questions: [
      {
        id: "q4_1",
        label: "Vaste pakketten, maatwerk, of losse diensten?",
        chips: ["Vaste pakketten", "Maatwerk", "Losse diensten", "Combinatie"]
      },
      {
        id: "q4_2",
        label: "Welke dienst levert het meeste op \u2014 en welke wil de klant het liefst doen?",
        chips: ["Zelfde dienst is populairst \xE9n favoriet", "Verschilt \u2014 favoriete werk is niet het meest verkopende"]
      },
      {
        id: "q4_3",
        label: "Prijzen op de site?",
        chips: ["Vanaf-prijzen", "Richtprijzen", "Helemaal geen prijzen"]
      },
      {
        id: "q4_4",
        label: "Garantie, proefperiode of belofte",
        chips: ["Garantie op materiaal en werk", "Niet-goed-geld-terug", "Vrijblijvende offerte", "Geen vaste garantie"]
      }
    ]
  },
  {
    id: "05",
    title: "05 Werkwijze",
    questions: [
      {
        id: "q5_1",
        label: "Stappen van eerste contact tot oplevering",
        hint: "3 tot 5 stappen \u2014 wordt een sectie op de site.",
        chips: ["3 stappen (contact \u2192 uitvoering \u2192 oplevering)", "4 stappen (contact \u2192 offerte \u2192 uitvoering \u2192 oplevering)", "5+ stappen (uitgebreid traject)"]
      },
      {
        id: "q5_2",
        label: "Gemiddelde duur van een traject",
        chips: ["Binnen 1 dag", "Enkele dagen", "1-2 weken", "Meerdere weken of maanden"]
      },
      {
        id: "q5_3",
        label: "Hoeveel contact heeft de klant tussendoor?",
        chips: ["Weinig \u2014 wij regelen het", "Regelmatige updates", "Nauw contact/overleg per stap"]
      },
      {
        id: "q5_4",
        label: "Wat mogen klanten hier n\xF3\xF3it meemaken?",
        hint: "Vaak het sterkste onderscheid: wat gaat er bij concurrenten mis?",
        chips: ["Onduidelijke communicatie", "Onverwachte kosten", "Rommel of slordige afwerking", "Te laat komen/afspraken niet nakomen"]
      }
    ]
  },
  {
    id: "06",
    title: "06 Tone of voice",
    questions: [
      { id: "q6_1", label: "Aanspreekvorm", type: "select", options: ["je / jij", "u"] },
      {
        id: "q6_2",
        label: "Hoe communiceert de eigenaar zelf?",
        chips: ["Nuchter", "Gedreven", "Technisch", "Gemoedelijk", "Vriendelijk-informeel"]
      },
      {
        id: "q6_3",
        label: "Lengte van teksten",
        type: "select",
        options: ["kort en concreet", "uitgebreider en toelichtend"]
      },
      {
        id: "q6_5",
        label: "Een zin die precies goed voelt",
        chips: ["Kort en direct", "Warm en persoonlijk", "Zelfverzekerd en vakkundig"]
      }
    ]
  },
  {
    id: "07",
    title: "07 Bewijs & materiaal",
    note: "Bij een bedrijf zonder website is dit de belangrijkste inventarisatie: waar komen straks de foto's, cijfers en reviews vandaan?",
    questions: [
      {
        id: "q7_1",
        label: "Beschikbaar beeldmateriaal",
        hint: "Snelle inschatting is genoeg.",
        chips: ["Eigen foto's aanwezig", "Gedeeltelijk aanwezig", "Nog niets \u2014 opdracht geven voor komende maand"]
      },
      {
        id: "q7_2",
        label: "Reviews of referenties",
        hint: "Google-reviews, Werkspot, mond-tot-mond? Mag je namen noemen?",
        chips: ["Google-reviews aanwezig", "Alleen mond-tot-mond", "Nog geen reviews", "Referenties op aanvraag"]
      },
      {
        id: "q7_3",
        label: "Certificeringen, keurmerken, lidmaatschappen, verzekeringen",
        chips: ["Vakdiploma/certificaat", "Lid van brancheorganisatie", "WA/bedrijfsverzekering", "Geen van deze"]
      },
      {
        id: "q7_4",
        label: "Bereikbaarheid en openingstijden",
        chips: ["Ma-vr kantooruren", "Ook 's avonds/weekend", "24/7 bereikbaar (spoed)", "Op afspraak"]
      },
      {
        id: "q7_5",
        label: "Bestaande online kanalen",
        hint: "Google Bedrijfsprofiel, Facebook, Instagram, Marktplaats \u2014 ook als er geen site is.",
        chips: ["Geen enkel kanaal", "Alleen Instagram", "Alleen Facebook", "Google Bedrijfsprofiel", "Meerdere kanalen"]
      }
    ]
  }
];
var NC_QUESTIONS = NC_SECTIONS.flatMap((s) => s.questions);
var INDUSTRY_OPTIONS = ["Schilderwerken", "Artiest", "Product / B2B"];
function isArtistIndustry(industry) {
  return industry.trim().toLowerCase() === "artiest";
}
var NC_ARTIST_SECTIONS = [
  {
    id: "01",
    title: "01 Artiestidentiteit",
    note: "De basis van het artiestenprofiel \u2014 noteer de woorden van de artiest zelf.",
    questions: [
      { id: "ar1_1", label: "Artiestennaam / pseudoniem", needed: true },
      {
        id: "ar1_2",
        label: "Genre / muziekstijl",
        needed: true,
        chips: ["House / techno", "Hiphop / rap", "Pop", "Singer-songwriter", "Latin / afrobeats", "Coverband / feestmuziek"]
      },
      {
        id: "ar1_3",
        label: "In \xE9\xE9n zin: wie is deze artiest en wat maakt de stijl uniek?",
        needed: true
      },
      {
        id: "ar1_4",
        label: "Sinds wanneer actief",
        chips: ["Net begonnen (dit jaar)", "1-3 jaar", "5+ jaar", "10+ jaar"]
      }
    ]
  },
  {
    id: "02",
    title: "02 Muziek & materiaal",
    questions: [
      {
        id: "ar2_1",
        label: "Links naar muziek",
        hint: "Spotify, SoundCloud, YouTube, Apple Music \u2014 plak de volledige links.",
        needed: true
      },
      { id: "ar2_2", label: "Nieuwste release of belangrijkste track om uit te lichten" },
      {
        id: "ar2_3",
        label: "Is er professioneel beeldmateriaal (persfoto's / promo) beschikbaar?",
        chips: ["Ja, professionele persfoto's", "Alleen live-foto's", "Alleen telefoonfoto's", "Nog niets \u2014 shoot inplannen"]
      }
    ]
  },
  {
    id: "03",
    title: "03 Optredens & boeken",
    questions: [
      {
        id: "ar3_1",
        label: "Aankomende optredens / agenda",
        hint: "Data en locaties, voor zover bekend.",
        chips: ["Nog geen agenda", "Enkele losse data", "Volle agenda \u2014 agenda-sectie nodig"]
      },
      {
        id: "ar3_2",
        label: "Hoe wil de artiest geboekt worden?",
        needed: true,
        chips: ["Boekingsformulier op de site", "Direct via e-mail", "Via boekingsagent", "Via WhatsApp/telefoon"]
      },
      {
        id: "ar3_3",
        label: "Moeten tarieven / prijzen zichtbaar zijn op de site?",
        chips: ["Vanaf-prijzen tonen", "Prijzen op aanvraag", "Helemaal geen prijzen"]
      }
    ]
  },
  {
    id: "04",
    title: "04 Uitstraling & sfeer",
    questions: [
      {
        id: "ar4_1",
        label: "Gewenste sfeer / uitstraling van de site",
        needed: true,
        chips: ["Energiek en kleurrijk", "Donker en mysterieus", "Chill en warm", "Luxe en strak", "Rauw en underground"]
      },
      {
        id: "ar4_2",
        label: "Referentie-artiesten qua stijl",
        hint: "Nationaal of internationaal \u2014 waar identificeert de artiest zich mee?"
      }
    ]
  },
  {
    id: "05",
    title: "05 Bewijs & kanalen",
    questions: [
      {
        id: "ar5_1",
        label: "Social media kanalen",
        hint: "Instagram, TikTok, Facebook \u2014 met gebruikersnaam of link.",
        chips: ["Instagram", "TikTok", "Facebook", "YouTube"],
        chipsMulti: true,
        chipsMax: 4
      },
      { id: "ar5_2", label: "Persvermeldingen, awards of belangrijke samenwerkingen" },
      { id: "ar5_3", label: "Testimonials / quotes van organisatoren of fans" }
    ]
  }
];
var NC_ARTIST_QUESTIONS = NC_ARTIST_SECTIONS.flatMap((s) => s.questions);
function isProductIndustry(industry) {
  return industry.trim().toLowerCase() === "product / b2b";
}
var pq = (id, label, needed = false) => ({ id, label, needed });
var NC_PRODUCT_SECTIONS = [
  { id: "01", title: "01 Product", questions: [
    pq("pr1_1", "Productnaam en merk/afzender", true),
    pq("pr1_2", "Wat doet het product in \xE9\xE9n zin?", true),
    pq("pr1_3", "Hoe werkt het (functies/techniek)?"),
    pq("pr1_4", "Hoe verloopt aanschaf en installatie/implementatie?")
  ] },
  { id: "02", title: "02 Probleem & resultaat", questions: [
    pq("pr2_1", "Welk probleem lost het op?", true),
    pq("pr2_2", "Wat levert het concreet op (besparing, tijd, kosten, CO\u2082 e.d.)?", true),
    pq("pr2_3", "Voor welke situaties/varianten geldt dit (bv. diesel vs. elektrisch)?")
  ] },
  { id: "03", title: "03 Doelgroep & beslisser", questions: [
    pq("pr3_1", "Wie is de ideale klant (type bedrijf, omvang)?", true),
    pq("pr3_2", "Wie beslist over de aankoop (functie)?"),
    pq("pr3_3", "Wie gebruikt het product dagelijks?"),
    pq("pr3_4", "Markt/regio (NL, BE, anders)?")
  ] },
  { id: "04", title: "04 Bewijs", questions: [
    pq("pr4_1", "Cases of klantvoorbeelden"),
    pq("pr4_2", "Cijfers, testresultaten of ROI-voorbeelden"),
    pq("pr4_3", "Klantlogo's, certificeringen of partners")
  ] },
  { id: "05", title: "05 Bezwaren & prijs", questions: [
    pq("pr5_1", "Prijs en prijsmodel (per stuk, abonnement, excl./incl. btw)"),
    pq("pr5_2", "Veelgehoorde bezwaren en het antwoord daarop"),
    pq("pr5_3", "Belangrijkste concurrenten/alternatieven en het verschil")
  ] },
  { id: "06", title: "06 Conversie", questions: [
    pq("pr6_1", "Gewenste actie op de site (demo, offerte, ROI berekenen, contact)", true),
    pq("pr6_2", "Wat gebeurt er na die actie?"),
    pq("pr6_3", "Tools of calculators die op de site moeten (bv. ROI-calculator)")
  ] },
  { id: "07", title: "07 Toon & sfeer", questions: [
    pq("pr7_1", "Gewenste toon (zakelijk, technisch, toegankelijk\u2026)"),
    pq("pr7_2", "Aanspreekvorm (je/u)"),
    pq("pr7_3", "Kernboodschap/tagline")
  ] }
];
var NC_PRODUCT_QUESTIONS = NC_PRODUCT_SECTIONS.flatMap((s) => s.questions);
var NC_PRODUCT_PAGES = [
  "Home",
  "Hoe het werkt",
  "Besparing/ROI",
  "Voor wie",
  "Cases",
  "Prijzen/offerte",
  "Contact/demo"
];
var NC_STEP_TITLES = [
  "Bedrijfsinfo",
  "Intake-vragenlijst",
  "Kleuren & lettertype",
  "Pagina-opbouw",
  "Brandbook-prompt",
  "Lovable-prompt"
];
var NC_STEP_CONFIRMATIONS = [
  "Zijn de bedrijfsgegevens zo compleet als nu mogelijk is?",
  "Doorgaan naar kleuren & lettertype? Lege vragen komen later als 'nog niet beantwoord' in de prompt.",
  "Zijn de kleuren en het lettertype bewust gekozen voor dit bedrijf?",
  "Kloppen de gekozen pagina's en notities?",
  "Is de brandbook-prompt klaar en gekopieerd? Doorgaan naar de Lovable-prompt?"
];
var FONT_SUGGESTIONS = [
  "Manrope",
  "Outfit",
  "Sora",
  "Plus Jakarta Sans",
  "Space Grotesk",
  "Fraunces",
  "Instrument Sans",
  "Bricolage Grotesque"
];
var LOGO_OPTIONS = [
  "nee, nog niets",
  "ja, bruikbaar bestand (SVG/AI/PNG)",
  "ja, maar verouderd of van lage kwaliteit"
];
var clone = (v) => JSON.parse(JSON.stringify(v));
var DEFAULT_LISTS = {
  standaard: clone(NC_SECTIONS),
  artiest: clone(NC_ARTIST_SECTIONS),
  product: clone(NC_PRODUCT_SECTIONS)
};
var DEFAULT_IDS = new Set(
  Object.values(DEFAULT_LISTS).flatMap((l) => l.flatMap((s) => s.questions.map((q) => q.id)))
);
var DEFAULT_STEP_TITLES = [...NC_STEP_TITLES];
var DEFAULT_STEP_CONFIRMATIONS = [...NC_STEP_CONFIRMATIONS];
var LIVE = {
  standaard: [NC_SECTIONS, NC_QUESTIONS],
  artiest: [NC_ARTIST_SECTIONS, NC_ARTIST_QUESTIONS],
  product: [NC_PRODUCT_SECTIONS, NC_PRODUCT_QUESTIONS]
};
function replace(arr, next) {
  arr.splice(0, arr.length, ...next);
}
function applyConfig(cfg) {
  Object.keys(LIVE).forEach((k) => {
    const secs = cfg?.lists?.[k] ? clone(cfg.lists[k]) : clone(DEFAULT_LISTS[k]);
    replace(LIVE[k][0], secs);
    replace(LIVE[k][1], secs.flatMap((s) => s.questions));
  });
  const steps = cfg?.steps;
  replace(NC_STEP_TITLES, DEFAULT_STEP_TITLES.map((t, i) => steps?.[i]?.title?.trim() || t));
  replace(NC_STEP_CONFIRMATIONS, DEFAULT_STEP_CONFIRMATIONS.map((t, i) => steps?.[i]?.confirm?.trim() || t));
}
function listFor(industry) {
  return isArtistIndustry(industry) ? "artiest" : isProductIndustry(industry) ? "product" : "standaard";
}
function liveSections(kind) {
  return LIVE[kind][0];
}

// ../port/lib/onboarding.ts
var SECTIONS = [
  {
    id: "01",
    title: "01 Merkidentiteit",
    questions: [
      { id: "q1_1", label: "In \xE9\xE9n zin: wat doet het bedrijf, en voor wie?" },
      { id: "q1_2", label: "Wat maakt dit bedrijf anders dan concurrenten?" },
      { id: "q1_3", label: "Wat willen klanten over dit bedrijf zeggen tegen anderen?" },
      { id: "q1_4", label: "Tagline of slogan (bestaand of voorgesteld)" }
    ]
  },
  {
    id: "02",
    title: "02 Kernwaarden",
    questions: [
      { id: "q2_1", label: "3 tot 5 kernwaarden" },
      { id: "q2_2", label: "Belangrijkste waarde en waarom" },
      { id: "q2_3", label: "Voorbeeld/moment waarop deze waarde bleek" }
    ]
  },
  {
    id: "03",
    title: "03 Doelgroep & positie",
    questions: [
      { id: "q3_1", label: "Ideale klant" },
      { id: "q3_2", label: "In welke fase zit de ideale klant meestal?" },
      { id: "q3_3", label: "Grootste twijfel/drempel v\xF3\xF3r klanten in zee gaan" },
      { id: "q3_4", label: "3 dingen die klanten alleen hier krijgen" }
    ]
  },
  {
    id: "04",
    title: "04 Diensten",
    questions: [
      { id: "q4_1", label: "Welke producten/diensten worden aangeboden?" },
      { id: "q4_2", label: "Vaste pakketten, maatwerk, of losse diensten?" },
      { id: "q4_3", label: "Reden om voor de duurste dienst te kiezen" },
      { id: "q4_4", label: "Garantie, proefperiode of belofte" }
    ]
  },
  {
    id: "05",
    title: "05 Werkwijze",
    questions: [
      { id: "q5_1", label: "Stappen van eerste contact tot oplevering" },
      { id: "q5_2", label: "Gemiddelde duur van een traject" },
      { id: "q5_3", label: "Hoeveel contact heeft de klant tijdens het traject?" },
      { id: "q5_4", label: "Wat mogen klanten NOOIT verwachten (negatief van concurrenten)?" }
    ]
  },
  {
    id: "08",
    title: "08 Tone of voice",
    questions: [
      { id: "q8_1", label: "Je/jij of u?" },
      { id: "q8_2", label: "Manier van communiceren" },
      { id: "q8_3", label: "Kort en simpel, of uitgebreider en professioneel?" },
      { id: "q8_4", label: "Een zin die dit merk NOOIT zou gebruiken, en waarom" },
      { id: "q8_5", label: "Een zin die precies goed voelt" }
    ]
  }
];
var ALL_QUESTIONS = SECTIONS.flatMap((s) => s.questions);
function hexToHsl(hex) {
  let clean = hex.replace("#", "").trim();
  if (clean.length === 3)
    clean = clean.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return { h: 0, s: 0, l: 50 };
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}
function hslToHex(h, s, l) {
  const sN = s / 100;
  const lN = l / 100;
  const k = (n) => (n + h / 30) % 12;
  const a2 = sN * Math.min(lN, 1 - lN);
  const f = (n) => {
    const v = lN - a2 * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return Math.round(255 * v).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}
function buildScale(hex) {
  const { h, s, l } = hexToHsl(hex);
  const LIGHT = 95;
  const DARK = 12;
  const out = [];
  for (let step = 10; step <= 90; step += 10) {
    let li;
    if (step <= 50) li = LIGHT + (l - LIGHT) * (step - 10) / 40;
    else li = l + (DARK - l) * (step - 50) / 40;
    out.push({ step, hex: hslToHex(h, s, li) });
  }
  return out;
}

// ../port/components/onboarding/newclient/types.ts
var NC_DEFAULT_PAGES = [
  "Home",
  "Diensten (overzicht)",
  "Werkwijze",
  "Over ons",
  "Contact"
].map((name) => ({ id: name.toLowerCase(), name, enabled: true, note: "" }));
var ncInitialState = {
  companyName: "",
  ownerName: "",
  industry: "",
  city: "",
  phone: "",
  email: "",
  address: "",
  kvk: "",
  domain: "",
  logoStatus: "nee, nog niets",
  logoNote: "",
  answers: {},
  services: [],
  primaryColor: "#8A9BB0",
  secondaryColor: "#C8AD87",
  fontFamily: "",
  styleNote: "",
  sitePages: NC_DEFAULT_PAGES,
  referenceImages: [null, null, null],
  referenceNote: "",
  logoPrimary: null,
  logoSecondary: null,
  homepageSections: "",
  brandbookPrompt: "",
  pdfName: "",
  pdfText: "",
  lovablePrompt: "",
  claudePrompt: ""
};

// ../port/lib/newclient-prompts.ts
var newclient_prompts_exports = {};
__export(newclient_prompts_exports, {
  buildNcBrandbookPrompt: () => buildNcBrandbookPrompt,
  buildNcClaudePrompt: () => buildNcClaudePrompt,
  buildNcLovablePrompt: () => buildNcLovablePrompt,
  emptyQuestions: () => emptyQuestions,
  logoFileCount: () => logoFileCount,
  logoFiles: () => logoFiles,
  referenceCount: () => referenceCount
});
var EMPTY = "\u2014";
function a(state, id) {
  return state.answers[id]?.trim() || EMPTY;
}
function emptyQuestions(state) {
  const list = isArtistIndustry(state.industry) ? NC_ARTIST_QUESTIONS : isProductIndustry(state.industry) ? NC_PRODUCT_QUESTIONS : NC_QUESTIONS;
  return list.filter((q) => !(state.answers[q.id] ?? "").trim());
}
function productBlock(state) {
  return `PRODUCT
- Productnaam en merk/afzender: ${a(state, "pr1_1")}
- Wat het doet (\xE9\xE9n zin): ${a(state, "pr1_2")}
- Hoe het werkt: ${a(state, "pr1_3")}
- Aanschaf en implementatie: ${a(state, "pr1_4")}

PROBLEEM & RESULTAAT
- Probleem dat het oplost: ${a(state, "pr2_1")}
- Concreet resultaat: ${a(state, "pr2_2")}
- Situaties/varianten: ${a(state, "pr2_3")}

DOELGROEP
- Ideale klant: ${a(state, "pr3_1")}
- Beslisser: ${a(state, "pr3_2")}
- Dagelijkse gebruiker: ${a(state, "pr3_3")}
- Markt/regio: ${a(state, "pr3_4")}

BEWIJS
- Cases/klantvoorbeelden: ${a(state, "pr4_1")}
- Cijfers, testresultaten, ROI: ${a(state, "pr4_2")}
- Klantlogo's, certificeringen, partners: ${a(state, "pr4_3")}

BEZWAREN
- Prijs en prijsmodel: ${a(state, "pr5_1")}
- Bezwaren en antwoorden: ${a(state, "pr5_2")}
- Concurrenten/alternatieven en verschil: ${a(state, "pr5_3")}

CONVERSIE
- Gewenste actie: ${a(state, "pr6_1")}
- Wat er daarna gebeurt: ${a(state, "pr6_2")}
- Tools/calculators op de site: ${a(state, "pr6_3")}

TOON
- Gewenste toon: ${a(state, "pr7_1")}
- Aanspreekvorm: ${a(state, "pr7_2")}
- Kernboodschap/tagline: ${a(state, "pr7_3")}`;
}
function artistBlock(state) {
  return `ARTIESTPROFIEL
- Artiestennaam: ${a(state, "ar1_1")}
- Genre / muziekstijl: ${a(state, "ar1_2")}
- Wie is deze artiest en wat maakt de stijl uniek: ${a(state, "ar1_3")}
- Actief sinds: ${a(state, "ar1_4")}

MUZIEK & MATERIAAL
- Muzieklinks: ${a(state, "ar2_1")}
- Uit te lichten release of track: ${a(state, "ar2_2")}
- Beschikbaar beeldmateriaal: ${a(state, "ar2_3")}

OPTREDENS & BOEKEN
- Agenda / aankomende optredens: ${a(state, "ar3_1")}
- Manier van boeken: ${a(state, "ar3_2")}
- Tarieven zichtbaar: ${a(state, "ar3_3")}

UITSTRALING & SFEER
- Gewenste sfeer: ${a(state, "ar4_1")}
- Referentie-artiesten: ${a(state, "ar4_2")}

BEWIJS & KANALEN
- Social media: ${a(state, "ar5_1")}
- Pers, awards, samenwerkingen: ${a(state, "ar5_2")}
- Testimonials / quotes: ${a(state, "ar5_3")}`;
}
function scaleLine(hex) {
  return buildScale(hex).map((s) => `${s.step}% ${s.hex}`).join(", ");
}
function serviceLines(state) {
  const list = state.services.filter((s) => s.name.trim() || s.description.trim());
  if (!list.length) return "- (geen diensten genoteerd)";
  return list.map((s) => `- ${s.name.trim() || "naamloze dienst"}: ${s.description.trim() || EMPTY}`).join("\n");
}
function logoFiles(state) {
  return [
    state.logoPrimary ? { label: "Primair logo", path: state.logoPrimary } : null,
    state.logoSecondary ? { label: "Secundair logo", path: state.logoSecondary } : null
  ].filter((x) => !!x);
}
function logoFileCount(state) {
  return logoFiles(state).length;
}
function logoFileBlock(state) {
  const files = logoFiles(state);
  if (!files.length) return "";
  return `
Bijgevoegde logobestanden: ${files.map((f) => f.label.toLowerCase()).join(" en ")}. Gebruik deze bestanden als het logo \u2014 ontwerp geen nieuw logo.`;
}
function homepageBlock(state) {
  const v = (state.homepageSections ?? "").trim();
  if (!v) return "";
  return `

HOMEPAGE-OPBOUW (voorkeur van de klant \u2014 volg deze volgorde en indeling)
${v}`;
}
function referenceCount(state) {
  return (state.referenceImages ?? []).filter(Boolean).length;
}
function referenceBlock(state) {
  const n = referenceCount(state);
  const note = (state.referenceNote ?? "").trim();
  if (!n && !note) return "";
  return `

VISUELE REFERENTIE${n ? `
Er ${n === 1 ? "is 1 referentie-screenshot" : `zijn ${n} referentie-screenshots`} bijgevoegd. Analyseer deze puur op vibe en compositie (kleurgebruik in context, lay-outpatronen, sfeer) \u2014 nooit op content, tekst of merknaam. Vertaal dit naar een eigen sectie "Visuele referentie & Vibe" in de brandbook, met concrete koppeling aan hero-sectie, diensten-sectie, over-ons-sectie en algemeen ritme van de pagina.` : ""}${note ? `
Wat hierin aanspreekt: ${note}` : ""}`;
}
function buildNcBrandbookPrompt(state) {
  const name = state.companyName || "[bedrijfsnaam]";
  const missing = emptyQuestions(state);
  const tagline = state.answers["q1_5"]?.trim() || "(nog geen \u2014 stel er drie voor die bij de toon hieronder passen)";
  const logo = (state.logoStatus === "nee, nog niets" && !logoFileCount(state) ? "Er is nog geen logo. Ontwerp in de logo-sectie een wordmark of woord-beeldmerk-concept dat past bij de kleuren en het lettertype hieronder, en beschrijf: hoofdvariant, variant voor donkere ondergrond, minimale afmeting, vrije ruimte en wat niet mag." : `Er is al een logo: ${state.logoNote.trim() || state.logoStatus}. Neem het op in de logo-sectie met gebruiksregels (varianten, vrije ruimte, minimale afmeting, verkeerd gebruik).`) + logoFileBlock(state);
  const contact = [
    `Bedrijf: ${name}`,
    state.ownerName && `Eigenaar: ${state.ownerName}`,
    state.address && `Adres: ${state.address}`,
    state.city && `Plaats: ${state.city}`,
    state.phone && `Telefoon: ${state.phone}`,
    state.email && `E-mail: ${state.email}`,
    state.kvk && `KvK: ${state.kvk}`,
    state.domain && `Domein: ${state.domain}`
  ].filter(Boolean).join("\n");
  const profile = isProductIndustry(state.industry) ? `Naam: ${name}${state.city ? ` \xB7 ${state.city}` : ""}

${productBlock(state)}` : isArtistIndustry(state.industry) ? `${artistBlock(state)}

TAGLINE
- ${tagline}` : `BEDRIJFSPROFIEL
- Naam: ${name}${state.ownerName ? ` (eigenaar: ${state.ownerName})` : ""}
- Branche \xB7 vestigingsplaats: ${state.industry || EMPTY} \xB7 ${state.city || EMPTY}
- Wat en voor wie: ${a(state, "q1_1")}
- Achtergrond: ${a(state, "q1_2")}
- Onderscheidend: ${a(state, "q1_3")}
- Gewenste mond-tot-mondreputatie: ${a(state, "q1_4")}
- Tagline: ${tagline}

KERNWAARDEN
- Kernwaarden: ${a(state, "q2_1")}
- Belangrijkste waarde en waarom: ${a(state, "q2_2")}
- Bewijsmoment: ${a(state, "q2_3")}

DOELGROEP & WERKGEBIED
- Ideale klant: ${a(state, "q3_1")}
- Zoekmoment: ${a(state, "q3_2")}
- Grootste drempel: ${a(state, "q3_3")}
- Werkgebied: ${a(state, "q3_4")}
- Alleen hier te krijgen: ${a(state, "q3_5")}

DIENSTEN (neem hier een eigen sectie voor op \u2014 houd de diensten gescheiden, voeg ze niet samen tot \xE9\xE9n vage omschrijving)
${serviceLines(state)}
- Vorm (pakketten/maatwerk/los): ${a(state, "q4_1")}
- Belangrijkste dienst: ${a(state, "q4_2")}
- Prijsbeleid: ${a(state, "q4_3")}
- Garantie of belofte: ${a(state, "q4_4")}

WERKWIJZE
- Stappen van eerste contact tot oplevering: ${a(state, "q5_1")}
- Gemiddelde duur: ${a(state, "q5_2")}
- Contact tussendoor: ${a(state, "q5_3")}
- Nooit mee te maken: ${a(state, "q5_4")}

TOON
- Aanspreekvorm: ${a(state, "q6_1")}
- Stijl: ${a(state, "q6_2")}
- Lengte: ${a(state, "q6_3")}
- Precies goed: ${a(state, "q6_5")}`;
  return `Maak een merkboek (brandbook) van 8-11 pagina's op A4-formaat voor "${name}".

UITGANGSPUNT
Dit bedrijf heeft nog geen website, geen teksten en geen vastgelegde huisstijl. Alle informatie hieronder komt uit een intakegesprek met de eigenaar. Het brandbook is dus geen samenvatting van bestaand materiaal, maar het eerste document dat de identiteit vastlegt: maak duidelijke keuzes en onderbouw ze kort, zodat er daarna consistent op verder gebouwd kan worden.

${profile}

LOGO
${logo}

HUISSTIJL \u2014 GEBRUIK EXACT DEZE WAARDEN
- Primaire kleur ${state.primaryColor.toUpperCase()}: ${scaleLine(state.primaryColor)}
- Secundaire / accentkleur ${state.secondaryColor.toUpperCase()}: ${scaleLine(state.secondaryColor)}
- Bedenk geen andere tinten: neem deze hexwaarden letterlijk over op de kleurenpagina.
- Lettertype: ${state.fontFamily || "[nog te kiezen]"} \u2014 het enige lettertype, gewichten 200-600.
- Notitie bij de huisstijl: ${state.styleNote.trim() || EMPTY}
- Typografie-methode: bouw hi\xEBrarchie op met gewicht en grootte binnen dit ene lettertype. Bepaal zelf een passende typeschaal die bij dit merk past \u2014 kopieer niet de schaal van een eerder brandbook.

ONDERSCHEID VAN EERDER WERK
Dit is een van meerdere brandbooks voor Flying Images-klanten. Layout, coverbehandeling, typeschaal en beeldtaal mogen niet identiek zijn aan een vorig brandbook, ook al is de paginastructuur hetzelfde. Baseer de vormgeving op de branche en toon van dit bedrijf.

STRUCTUUR
01 Het merk \xB7 02 Logo \xB7 03 Kleur \xB7 04 Typografie \xB7 05 Diensten \xB7 06 UI-componenten \xB7 07 Toon & tokens \xB7 08 Colofon.
Stijl: rustig, ruime witruimte, kleurstrip op de cover, \xE9\xE9n lettertype consequent doorgevoerd.${referenceBlock(state)}

COLOFON
${contact}${missing.length ? `

NOG NIET BEANTWOORD IN DE INTAKE \u2014 vul dit niet zelf in als feit, maar laat het open of stel het voor als optie: ${missing.map((q) => q.label).join("; ")}` : ""}`;
}
var HOMEPAGE_FIRST = `

BOUWVOLGORDE (belangrijk)
Bouw eerst de homepage volledig af (met alle secties, content en styling). Vraag daarna expliciet akkoord voordat je verdergaat met de overige pagina's.`;
function buildNcSiteBody(state) {
  const name = state.companyName || "[bedrijfsnaam]";
  const chosen = state.sitePages.filter((p) => p.enabled);
  const pageBlock = chosen.map((p) => `- ${p.name}${p.note.trim() ? `: ${p.note.trim()}` : ""}`).join("\n") || EMPTY;
  const bewijs = [
    `- Beeldmateriaal: ${a(state, "q7_1")}. Gebruik alleen zoveel beeldplekken als hiermee gevuld kan worden, en markeer elke plek duidelijk als placeholder met de gewenste inhoud erbij.`,
    state.answers["q7_2"]?.trim() && `- Reviews of referenties: ${state.answers["q7_2"].trim()}`,
    state.answers["q7_3"]?.trim() && `- Keurmerken en certificeringen: ${state.answers["q7_3"].trim()}`,
    state.answers["q7_5"]?.trim() && `- Bestaande online kanalen: ${state.answers["q7_5"].trim()}`
  ].filter(Boolean).join("\n");
  const contact = [
    state.address && `- Adres: ${state.address}`,
    state.city && `- Plaats: ${state.city}`,
    state.phone && `- Telefoon: ${state.phone}`,
    state.email && `- E-mail: ${state.email}`,
    state.kvk && `- KvK: ${state.kvk}`,
    state.domain && `- Domein: ${state.domain}`,
    state.answers["q7_4"]?.trim() && `- Bereikbaarheid: ${state.answers["q7_4"].trim()}`
  ].filter(Boolean).join("\n") || EMPTY;
  const body = isProductIndustry(state.industry) ? `${productBlock(state)}

TEKSTEN
Schrijf zakelijke, overtuigende B2B-teksten in de gekozen toon en aanspreekvorm. Leid met het probleem en het concrete resultaat, leg daarna uit hoe het werkt, onderbouw met bewijs, neem bezwaren weg en stuur elke pagina naar de gewenste conversie-actie. Gebruik alleen de genoemde cijfers en cases; markeer ontbrekend bewijs als placeholder.` : isArtistIndustry(state.industry) ? `${artistBlock(state)}

TEKSTEN
Schrijf korte, sfeervolle teksten die passen bij het genre en de gewenste uitstraling. Zet muziek luisteren en boeken centraal: embeds of duidelijke links naar de muziekplatforms, een agenda-sectie als er data zijn, en een opvallende boekings-CTA volgens de gekozen manier van boeken.

BEELD EN BEWIJS
- Beeldmateriaal: ${a(state, "ar2_3")}. Gebruik alleen zoveel beeldplekken als hiermee gevuld kan worden, en markeer elke plek duidelijk als placeholder met de gewenste inhoud erbij.
- Social media: ${a(state, "ar5_1")}
- Pers, awards, samenwerkingen: ${a(state, "ar5_2")}
- Testimonials / quotes: ${a(state, "ar5_3")}` : `HET BEDRIJF
- Wat en voor wie: ${a(state, "q1_1")}
- Onderscheidend: ${a(state, "q1_3")}
- Achtergrond: ${a(state, "q1_2")}
- Tagline: ${a(state, "q1_5")}
- Kernwaarden: ${a(state, "q2_1")}
- Ideale klant en zoekmoment: ${a(state, "q3_1")} \u2014 ${a(state, "q3_2")}
- Twijfel om weg te nemen: ${a(state, "q3_3")}
- USP's: ${a(state, "q3_5")}
- Werkgebied: ${a(state, "q3_4")} \u2014 noem dit werkgebied expliciet in de teksten en in de titels, dit is een lokaal bedrijf.

DIENSTEN
${serviceLines(state)}
- Structuur: ${a(state, "q4_1")}
- Prijsbeleid: ${a(state, "q4_3")}
- Garantie of belofte: ${a(state, "q4_4")}

WERKWIJZE
- Stappen: ${a(state, "q5_1")}
- Duur: ${a(state, "q5_2")}
- Contact tussendoor: ${a(state, "q5_3")}
- Beloftes / nooit meemaken: ${a(state, "q5_4")}

TOON VAN DE TEKSTEN
- Aanspreekvorm: ${a(state, "q6_1")}
- Stijl: ${a(state, "q6_2")}
- Lengte: ${a(state, "q6_3")}
- Precies goed: ${a(state, "q6_5")}

BEELD EN BEWIJS
${bewijs}`;
  return `Bouw een nieuwe website voor ${name} \u2014 ${state.industry || "[branche]"} uit ${state.city || "[plaats]"}.

BELANGRIJK: dit bedrijf had nog geen website en er is geen bestaande tekst. Alle teksten schrijf je zelf, in het Nederlands, op basis van de intake-informatie hieronder en het bijgevoegde brandbook. Verzin geen feiten die hier niet staan \u2014 geen aantallen jaren, geen klantaantallen, geen certificeringen die niet genoemd zijn. Waar bewijsmateriaal ontbreekt, gebruik je een duidelijke placeholder in plaats van een verzonnen claim.

${body}

PAGINA'S
${pageBlock}${homepageBlock(state)}

CONTACT (exact overnemen in footer en contactpagina)
${contact}

HUISSTIJL
Het brandbook (PDF) is bijgevoegd \u2014 gebruik de kleuren, het lettertype en de toon exact zoals daarin beschreven.
- Primaire kleur: ${state.primaryColor.toUpperCase()}
- Accentkleur: ${state.secondaryColor.toUpperCase()}
- Lettertype: ${state.fontFamily || "[nog te kiezen]"}${logoFileCount(state) ? `
- Logo: ${logoFiles(state).map((f) => f.label.toLowerCase()).join(" en ")} ${logoFileCount(state) === 1 ? "is" : "zijn"} als bestand bijgevoegd \u2014 gebruik dit logo in de header en footer${state.logoSecondary ? " en de tweede variant op donkere achtergronden" : ""}.` : ""}

STRUCTUURVARIATIE (belangrijk, los van de huisstijl)
Vermijd een generiek 'SaaS-kaartjes-sjabloon': gesplitste hero met tekst+foto naast elkaar plus eyebrow-label en badges, 3-koloms kaarten met pijl-links, 2x2 genummerde iconblokken, gekleurde promo-band, 3-koloms testimonial-kaarten, donkere CTA-band, donkere footer met 3 kolommen \u2014 dat is al bij een eerdere klant gebruikt. Kies een andere opbouw, bijvoorbeeld een hero met volledige achtergrondfoto in plaats van gesplitst, een andere sectievolgorde, of een andere indeling voor de diensten. De huisstijl (kleuren, typografie, toon) uit het brandbook blijft leidend \u2014 alleen de sectie-opbouw en lay-out moeten onderscheidend zijn.`;
}
function buildNcLovablePrompt(state) {
  return `${buildNcSiteBody(state)}

TECHNISCH
Responsive, snelle laadtijd, semantische HTML, duidelijke call-to-action naar bellen en mailen op elke pagina, contactformulier op de contactpagina, unieke title en meta description per pagina met plaatsnaam.${HOMEPAGE_FIRST}`;
}
function buildNcClaudePrompt(state) {
  return `${buildNcSiteBody(state)}

TECHNISCH (voor Claude)
Bouw dit als schone HTML/React-code (mag ook als losse componenten of \xE9\xE9n pagina per bestand), responsive, semantische HTML, duidelijke call-to-action naar bellen en mailen op elke pagina, contactformulier op de contactpagina, unieke title en meta description per pagina met plaatsnaam. Geen platform-specifieke instructies: lever direct bruikbare code.${HOMEPAGE_FIRST}`;
}

// ../port/entry.ts
var { emptyQuestions: emptyQuestions2, logoFiles: logoFiles2, logoFileCount: logoFileCount2, referenceCount: referenceCount2 } = newclient_prompts_exports;
function extras(state) {
  const kind = listFor(state.industry || "");
  const rows = liveSections(kind).flatMap((s) => s.questions).filter((q) => !DEFAULT_IDS.has(q.id) && (state.answers?.[q.id] ?? "").trim()).map((q) => `- ${q.label}: ${state.answers[q.id].trim()}`);
  return rows.length ? `

AANVULLENDE INTAKE-ANTWOORDEN
${rows.join("\n")}` : "";
}
function inject(text, marker, add) {
  if (!add) return text;
  const i = text.indexOf(marker);
  return i < 0 ? text + add : text.slice(0, i) + add + text.slice(i);
}
var buildNcBrandbookPrompt2 = (s) => inject(buildNcBrandbookPrompt(s), "\n\nLOGO\n", extras(s));
var buildNcLovablePrompt2 = (s) => inject(buildNcLovablePrompt(s), "\n\nPAGINA'S\n", extras(s));
var buildNcClaudePrompt2 = (s) => inject(buildNcClaudePrompt(s), "\n\nPAGINA'S\n", extras(s));
export {
  DEFAULT_IDS,
  DEFAULT_LISTS,
  DEFAULT_STEP_CONFIRMATIONS,
  DEFAULT_STEP_TITLES,
  FONT_SUGGESTIONS,
  INDUSTRY_OPTIONS,
  LOGO_OPTIONS,
  NC_ARTIST_QUESTIONS,
  NC_ARTIST_SECTIONS,
  NC_DEFAULT_PAGES,
  NC_PRODUCT_PAGES,
  NC_PRODUCT_QUESTIONS,
  NC_PRODUCT_SECTIONS,
  NC_QUESTIONS,
  NC_SECTIONS,
  NC_STEP_CONFIRMATIONS,
  NC_STEP_TITLES,
  applyConfig,
  buildNcBrandbookPrompt2 as buildNcBrandbookPrompt,
  buildNcClaudePrompt2 as buildNcClaudePrompt,
  buildNcLovablePrompt2 as buildNcLovablePrompt,
  buildScale,
  emptyQuestions2 as emptyQuestions,
  isArtistIndustry,
  isProductIndustry,
  listFor,
  liveSections,
  logoFileCount2 as logoFileCount,
  logoFiles2 as logoFiles,
  ncInitialState,
  referenceCount2 as referenceCount
};
