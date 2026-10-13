// Alle inhoud van de site staat hier. Prijzen aanpassen? Alleen dit bestand wijzigen en `npm run build` draaien.

export const site = {
  name: 'Flying Images',
  tagline: 'Jouw website. Jouw verhaal.',
  domain: 'https://flyingimages.nl',
  email: 'info@flyingimages.nl',
  kvk: '83674993',
  city: 'Zeewolde',
  // Web3Forms access key voor het contactformulier (https://web3forms.com)
  web3formsKey: 'VUL-HIER-JE-WEB3FORMS-KEY-IN',
  // Vul je profiel-URL's in; lege waarden worden niet getoond
  socials: { instagram: '', linkedin: '' },
};

export const categories = [
  { id: 'web', from: '€950', name: 'Websites & webshops', desc: 'Van onepage tot maatwerk' },
  { id: 'vind', from: '€450', name: 'Gevonden worden', desc: 'Zichtbaar in Google én in Ai' },
  { id: 'ai', from: '€495', name: 'Ai & data', desc: 'Slimmer werken, beter meten' },
  { id: 'beeld', from: '€195', name: 'Merk & beeld', desc: 'Branding en dronebeelden' },
];

const steps = {
  default: [
    ['Vrijblijvend gesprek', 'We horen wat je wilt bereiken en geven direct eerlijk advies.'],
    ['Plan & vaste prijs', 'Je krijgt een helder voorstel. Geen kleine lettertjes.'],
    ['Uitvoeren', 'Wij gaan aan de slag en houden je op de hoogte.'],
    ['Oplevering', 'Je betaalt na de eerste oplevering, daarna volgt nog één revisieronde.'],
  ],
  monthly: [
    ['Kennismaking', 'We bekijken waar je nu staat en wat je wilt bereiken.'],
    ['Plan & doelen', 'Concrete doelen en cijfers waarop we sturen.'],
    ['Uitvoeren', 'We zetten alles op en gaan aan het werk.'],
    ['Meten & bijsturen', 'Elke maand een heldere rapportage en verbeteringen.'],
  ],
  drone: [
    ['Briefing', 'Wat wil je laten zien en waar komt het beeld terecht?'],
    ['Vluchtplan', 'Locatie, luchtruim en weer checken we vooraf.'],
    ['Opname', 'We vliegen, filmen en fotograferen op locatie.'],
    ['Montage & levering', 'Bewerkte beelden, klaar voor web en social.'],
  ],
};

export const services = [
  {
    slug: 'maatwerk-website', cat: 'web', name: 'Maatwerk website', popular: true, // 'Meest gekozen'-label in het menu
    short: 'Uniek ontwerp, eigen functies',
    price: { from: '€990', unit: 'eenmalig' },
    title: 'Maatwerk voor wat standaard niet kan.',
    intro: 'Een eigen boekingsflow, klantportaal, calculator of koppeling nodig? Dan bouwen we een website die precies doet wat jouw bedrijf vraagt, met een ontwerp dat volledig op jouw merk is afgestemd.',
    includes: ['Volledig eigen ontwerp, geen template', 'Functies op maat: calculators, formulieren, portals', 'Koppelingen met je bestaande systemen', 'Beheeromgeving om zelf content aan te passen', 'Snelle, moderne techniek', 'Documentatie bij oplevering'],
    forWho: "Starters, zzp'ers en kleine ondernemers die professioneel online willen staan, zonder technisch gedoe. En bedrijven met specifieke wensen of processen die niet in een standaard website passen.",
    steps: 'default',
    faq: [
      ['Wanneer heb ik maatwerk nodig?', 'Als je site meer moet doen dan informeren en contact laten opnemen. Denk aan offertes berekenen, afspraken laten inplannen of klanten laten inloggen.'],
      ['Hoe bepalen jullie de prijs?', 'We maken eerst samen een functionele schets. Op basis daarvan krijg je een vaste prijs, zodat je vooraf weet waar je aan toe bent.'],
      ['Van wie is de website?', 'Van jou. We leggen vooraf vast hoe hosting, beheer en toegang geregeld zijn.'],
    ],
    related: ['onepage-website', 'ai-oplossingen', 'rebranding'],
  },
  {
    slug: 'webshop-laten-maken', cat: 'web', name: 'Webshop laten maken',
    short: 'Online verkopen zonder gedoe',
    price: { from: '€2100', unit: 'eenmalig' },
    title: 'Een webshop die verkoopt.',
    intro: 'We zetten een webshop op die snel laadt, makkelijk te beheren is en klanten zonder omwegen naar de kassa brengt. Betalingen, verzending en btw regelen we in één keer goed.',
    includes: ['Productcatalogus met categorieën en filters', 'iDEAL, creditcard en andere betaalmethodes', 'Verzend- en btw-instellingen', 'Koppeling met voorraad- of boekhoudsysteem op aanvraag', 'Snelle, mobielvriendelijke checkout', 'Uitleg zodat je zelf producten beheert'],
    forWho: 'Ondernemers die hun producten online willen verkopen, of een verouderde webshop willen vervangen.',
    steps: 'default',
    faq: [
      ['Op welk platform bouwen jullie?', 'Dat kiezen we samen, op basis van je assortiment en budget. Voor de meeste ondernemers werkt een bewezen platform zoals Shopify of WooCommerce het best.'],
      ['Kunnen jullie mijn bestaande producten overzetten?', 'Ja. We zetten producten en klantgegevens over waar dat kan, en zorgen voor doorverwijzingen zodat je vindbaarheid behouden blijft.'],
      ['Wat kost een webshop per maand?', 'Dat hangt af van het platform en de koppelingen. Na het eerste gesprek krijg je een duidelijke opgave van de eenmalige en maandelijkse kosten.'],
    ],
    related: ['onepage-website', 'google-ads', 'data-analyse-rapportage'],
  },
  {
    slug: 'onepage-website', cat: 'web', name: 'Onepage website',
    short: 'Alles op één pagina, snel online',
    price: { from: '€200', unit: 'eenmalig', monthly: '€30' },
    title: 'Je hele verhaal op één sterke pagina.',
    intro: 'Een onepage website zet alles wat een bezoeker moet weten overzichtelijk onder elkaar: wie je bent, wat je doet en hoe ze je bereiken. Wij bouwen hem van eerste schets tot livegang, voor een vaste prijs, en je betaalt pas als jij tevreden bent.',
    includes: ['Eén pagina met alle belangrijke onderdelen', 'Responsive en mobielvriendelijk ontwerp', 'Contactformulier dat direct in je inbox landt', 'Domeinkoppeling en SSL-certificaat', 'Hosting en onderhoud via het maandbedrag', 'Eén revisieronde inbegrepen'],
    forWho: "Starters, zzp'ers en kleine ondernemers die snel en betaalbaar professioneel online willen staan, zonder technisch gedoe.",
    steps: 'default',
    faq: [
      ['Hoe snel staat mijn onepage online?', 'Meestal binnen een week. Het tempo hangt vooral af van hoe snel teksten en beelden binnen zijn.'],
      ['Is één pagina genoeg?', 'Voor de meeste starters en kleine bedrijven wel. Een goed opgebouwde onepage vertelt je verhaal kort en krachtig en leidt bezoekers direct naar contact.'],
      ['Wat zit er in het maandbedrag?', 'Hosting, het SSL-certificaat, onderhoud en updates. Zo blijft je site veilig en snel, zonder dat jij er iets voor hoeft te doen.'],
      ['Kan ik later uitbreiden?', 'Zeker. Je onepage groeit makkelijk mee naar een website met meerdere pagina’s, een maatwerk website of een webshop.'],
    ],
    related: ['maatwerk-website', 'webshop-laten-maken', 'zoekmachine-optimalisatie'],
  },
  {
    slug: 'online-marketing', cat: 'vind', name: 'Online marketing',
    short: 'Meer bereik, meer klanten',
    price: { from: '€560', unit: 'per maand' },
    title: 'Online marketing met een plan.',
    intro: 'We bepalen samen waar jouw klanten zitten en hoe je ze bereikt: via social media, e-mail, advertenties of content. Daarna voeren we het uit en meten we wat het oplevert.',
    includes: ['Marketingplan met doelen en kanalen', 'Social media content en planning', 'E-mailcampagnes en nieuwsbrieven', 'Maandrapportage in begrijpelijke taal', 'Bijsturen op basis van resultaten'],
    forWho: 'Ondernemers die willen groeien, maar geen tijd hebben om marketing zelf op te pakken.',
    steps: 'monthly',
    faq: [
      ['Hoe lang duurt het voordat ik resultaat zie?', 'Advertenties werken direct, organisch bereik groeit meestal in drie tot zes maanden. We spreken vooraf af welke cijfers we volgen.'],
      ['Zit ik ergens aan vast?', 'Dat spreken we vooraf samen af. Je weet precies wat de looptijd is en hoe je opzegt.'],
      ['Maken jullie ook de content?', 'Ja. Teksten, ontwerpen en, als je wilt, eigen foto- en dronebeelden.'],
    ],
    related: ['zoekmachine-optimalisatie', 'google-ads', 'drone-fotografie-video'],
  },
  {
    slug: 'zoekmachine-optimalisatie', cat: 'vind', name: 'Zoekmachine optimalisatie',
    short: 'Hoger in Google',
    price: { from: '€450', unit: 'eenmalig', monthly: '€199' },
    title: 'Gevonden worden op wat jouw klanten zoeken.',
    intro: 'We zoeken uit op welke woorden jouw klanten zoeken en zorgen dat je website daarop scoort. Technisch, inhoudelijk en lokaal.',
    includes: ['Zoekwoordenonderzoek', 'Technische SEO-check en verbeteringen', 'Optimalisatie van pagina’s en teksten', 'Google Bedrijfsprofiel voor lokale vindbaarheid', 'Maandrapportage van posities en bezoekers'],
    forWho: 'Bedrijven die meer bezoekers en aanvragen willen, zonder voor elke klik te betalen.',
    steps: 'monthly',
    faq: [
      ['Hoe snel sta ik bovenaan?', 'Daar is geen garantie voor, en wie dat wel belooft is niet eerlijk. Wel zie je meestal binnen een paar maanden duidelijke vooruitgang op de woorden die ertoe doen.'],
      ['Werkt SEO ook voor een lokaal bedrijf?', 'Juist. Met een goed ingericht Google Bedrijfsprofiel en lokale pagina’s ben je zichtbaar voor klanten in je eigen regio.'],
      ['Wat is het verschil met Google Ads?', 'Met Ads betaal je per klik en sta je direct bovenaan. SEO kost meer tijd, maar levert blijvend bezoekers op zonder klikkosten. Vaak werkt een combinatie het best.'],
    ],
    related: ['llm-vindbaarheid', 'google-ads', 'data-analyse-rapportage'],
  },
  {
    slug: 'google-ads', cat: 'vind', name: 'Google Ads',
    short: 'Direct zichtbaar bovenaan',
    price: { from: '€450', unit: 'eenmalig', monthly: '€259', note: 'Opzet en beheer, exclusief advertentiebudget' },
    title: 'Google Ads die iets opleveren.',
    intro: 'We zetten campagnes op die zich richten op mensen die nú naar jouw dienst zoeken. Elke euro is te volgen, en we sturen bij op wat werkt.',
    includes: ['Campagnestructuur en zoekwoorden', 'Advertentieteksten die aanzetten tot actie', 'Conversiemeting op je website', 'Doorlopende optimalisatie van biedingen en budget', 'Maandrapportage: kosten, klikken, aanvragen'],
    forWho: 'Ondernemers die snel meer aanvragen willen en een helder advertentiebudget hebben.',
    steps: 'monthly',
    faq: [
      ['Hoeveel advertentiebudget heb ik nodig?', 'Dat hangt af van je branche en regio. In het eerste gesprek maken we een inschatting, zodat je met een realistisch budget start.'],
      ['Is het advertentiebudget inbegrepen?', 'Nee. Het advertentiebudget betaal je rechtstreeks aan Google. Wij rekenen alleen voor opzet en beheer.'],
      ['Kan ik tussentijds stoppen?', 'Je campagnes kun je altijd pauzeren. Over de looptijd van het beheer maken we vooraf duidelijke afspraken.'],
    ],
    related: ['zoekmachine-optimalisatie', 'online-marketing', 'data-analyse-rapportage'],
  },
  {
    slug: 'llm-vindbaarheid', cat: 'vind', name: 'LLM-vindbaarheid',
    short: 'Gevonden in ChatGPT en Ai',
    price: { from: '€650', unit: 'eenmalig', monthly: '€199' },
    title: 'Zichtbaar in ChatGPT, Gemini en Perplexity.',
    intro: 'Steeds meer mensen vragen een Ai-assistent om een aanbeveling in plaats van Google. Wij zorgen dat jouw bedrijf daar goed en correct naar voren komt.',
    includes: ['Scan: hoe noemen Ai-assistenten jouw bedrijf nu?', 'Gestructureerde data (schema.org) op je website', 'Content die Ai-modellen goed kunnen lezen en citeren', 'Consistente bedrijfsgegevens op het hele web', 'Rapport met verbeterpunten en vervolgstappen'],
    forWho: 'Bedrijven die voorop willen lopen nu zoeken verschuift van Google naar Ai.',
    steps: 'default',
    faq: [
      ['Wat is LLM-vindbaarheid of GEO?', 'GEO staat voor Generative Engine Optimization: je website en online aanwezigheid zo inrichten dat taalmodellen zoals ChatGPT jouw bedrijf kennen en aanbevelen.'],
      ['Is dit hetzelfde als SEO?', 'Er is overlap, want goede SEO helpt hier ook. Maar Ai-assistenten letten extra op duidelijke, gestructureerde informatie en op wat andere bronnen over je zeggen.'],
      ['Garanderen jullie dat ChatGPT mij noemt?', 'Nee, dat kan niemand. Wel vergroten we de kans flink en meten we hoe jouw zichtbaarheid zich ontwikkelt.'],
    ],
    related: ['zoekmachine-optimalisatie', 'ai-oplossingen', 'onepage-website'],
  },
  {
    slug: 'ai-oplossingen', cat: 'ai', name: 'Ai-oplossingen',
    short: 'Slimmer werken met Ai',
    price: { from: '€495', unit: 'eenmalig' },
    title: 'Ai die je echt tijd bespaart.',
    intro: 'Van een chatbot die klantvragen beantwoordt tot automatische offertes of slimme verwerking van e-mails. We kijken waar in jouw bedrijf tijd weglekt en bouwen een oplossing die dat oplost.',
    includes: ['Inventarisatie: waar levert Ai het meeste op?', 'Ai-assistent of chatbot met jouw bedrijfsinformatie', 'Automatiseringen tussen je bestaande tools', 'Uitleg en training voor jou en je team', 'Heldere afspraken over privacy en data'],
    forWho: 'Ondernemers die merken dat terugkerend werk te veel tijd kost.',
    steps: 'default',
    faq: [
      ['Moet ik technisch zijn om Ai te gebruiken?', 'Nee. We bouwen het zo dat jij het gewoon kunt gebruiken, en we leggen precies uit hoe het werkt.'],
      ['Is mijn bedrijfsdata veilig?', 'We kiezen tools en instellingen die passen bij jouw gegevens, en leggen vooraf vast wat er met je data gebeurt.'],
      ['Wat is een goed eerste Ai-project?', 'Iets dat vaak terugkomt en weinig uitzonderingen kent, zoals veelgestelde vragen beantwoorden of offerteaanvragen voorbereiden.'],
    ],
    related: ['data-analyse-rapportage', 'maatwerk-website', 'llm-vindbaarheid'],
  },
  {
    slug: 'data-analyse-rapportage', cat: 'ai', name: 'Data-analyse & rapportage',
    short: 'Inzicht in je cijfers',
    price: { from: '€560', unit: 'eenmalig', monthly: '€199' },
    title: 'Je cijfers, eindelijk overzichtelijk.',
    intro: 'We brengen data uit je website, advertenties, webshop en administratie samen in één helder dashboard. Zo zie je in één oogopslag wat werkt en waar je kansen laat liggen.',
    includes: ['Meetplan: welke cijfers doen ertoe?', 'Correcte inrichting van Google Analytics en tracking', 'Dashboard met je belangrijkste KPI’s', 'Periodieke rapportage met conclusies en advies', 'Uitleg zodat je de cijfers zelf kunt lezen'],
    forWho: 'Ondernemers die beslissingen willen nemen op basis van cijfers in plaats van gevoel.',
    steps: 'default',
    faq: [
      ['Welke bronnen kunnen jullie koppelen?', 'Onder andere Google Analytics, Search Console, Google Ads, Meta, je webshop en spreadsheets. Andere bronnen bekijken we per situatie.'],
      ['Hoe vaak krijg ik een rapportage?', 'Maandelijks of per kwartaal, wat het best bij je past. Het dashboard zelf is altijd actueel.'],
      ['Ik heb nog geen tracking. Kan dat?', 'Ja. Dan beginnen we met het correct inrichten van de metingen, inclusief een cookiemelding.'],
    ],
    related: ['ai-oplossingen', 'google-ads', 'zoekmachine-optimalisatie'],
  },
  {
    slug: 'rebranding', cat: 'beeld', name: 'Rebranding',
    short: 'Een merk dat klopt',
    price: { from: '€950', unit: 'eenmalig' },
    title: 'Een merk dat laat zien wie je bent.',
    intro: 'We vertalen het verhaal van je bedrijf naar een heldere huisstijl: kleuren, typografie, beeld en toon. Alles vastgelegd in een brandbook, zodat je overal herkenbaar bent.',
    includes: ['Merkverhaal en positionering', 'Kleurenpalet en typografie', 'Logo-optimalisatie of nieuw logo', 'Brandbook met alle richtlijnen', 'Templates voor social media en drukwerk'],
    forWho: 'Bedrijven waarvan de uitstraling niet meer past bij wie ze nu zijn.',
    steps: 'default',
    faq: [
      ['Moet mijn logo helemaal anders?', 'Niet per se. Vaak is een verfijning van wat er al is sterker dan een compleet nieuw logo. Dat bepalen we samen.'],
      ['Wat is een brandbook?', 'Een document met alle merkrichtlijnen: kleuren, lettertypes, logogebruik en toon. Handig voor jezelf, je team en iedereen die voor je werkt.'],
      ['Passen jullie ook mijn website aan?', 'Graag. Een rebranding combineren met een nieuwe website zorgt dat alles direct klopt.'],
    ],
    related: ['onepage-website', 'online-marketing', 'drone-fotografie-video'],
  },
  {
    slug: 'drone-fotografie-video', cat: 'beeld', name: "Drone foto's & video's",
    short: 'Je bedrijf vanuit de lucht',
    price: { from: '€195', unit: 'per opname' },
    title: 'Je bedrijf vanuit een ander perspectief.',
    intro: 'Luchtbeelden laten in één beeld zien wat foto’s vanaf de grond niet kunnen: de ligging, de schaal en de omgeving. Perfect voor je website, social media en presentaties.',
    includes: ['Luchtfoto’s in hoge resolutie', '4K-video, inclusief montage', 'Vluchtplanning: locatie, luchtruim en weer', 'Nabewerking in jouw huisstijl', 'Beelden klaar voor web en social'],
    forWho: 'Bedrijfspanden, bouwprojecten, recreatie, horeca, makelaars en evenementen.',
    steps: 'drone',
    faq: [
      ['Mag overal gevlogen worden?', 'Niet overal. Rond vliegvelden en boven bepaalde gebieden gelden beperkingen. Dat checken we vooraf, zodat je niet voor verrassingen staat.'],
      ['Wat gebeurt er bij slecht weer?', 'Dan plannen we samen een nieuw moment in. Veiligheid en beeldkwaliteit gaan voor.'],
      ['Krijg ik de ruwe beelden ook?', 'Je krijgt een bewerkte selectie. Ruwe beelden zijn op aanvraag beschikbaar.'],
    ],
    related: ['fpv-drone-beelden', 'online-marketing', 'onepage-website'],
  },
  {
    slug: 'fpv-drone-beelden', cat: 'beeld', name: 'FPV drone beelden',
    short: 'Vliegende fly-through video',
    price: { from: '€349', unit: 'per opname' },
    title: 'Vlieg je publiek door je bedrijf heen.',
    intro: 'Met een FPV-drone vliegen we in één vloeiende beweging door je pand, over je terrein of tussen je mensen door. Het resultaat: een video die vanaf de eerste seconde de aandacht vasthoudt.',
    includes: ['Indoor en outdoor fly-throughs', 'Draaiboek en vliegroute vooraf', 'Montage met muziek en titels', 'Formaten voor website, Reels en TikTok', 'Te combineren met reguliere dronebeelden'],
    forWho: 'Horeca, showrooms, sportscholen, evenementen, bedrijfspanden en vastgoed.',
    steps: 'drone',
    faq: [
      ['Wat is FPV?', 'FPV staat voor First Person View. De piloot vliegt met een videobril, waardoor de drone strakke bochten en vloeiende bewegingen kan maken die een gewone drone niet haalt.'],
      ['Is binnen vliegen veilig?', 'We bereiden elke vlucht voor met een vaste route en vliegen binnen met een drone die daarvoor geschikt is.'],
      ['Hoe lang is een FPV-video?', 'Meestal 30 tot 90 seconden. Kort genoeg om de aandacht vast te houden, lang genoeg om je hele locatie te laten zien.'],
    ],
    related: ['drone-fotografie-video', 'online-marketing', 'rebranding'],
  },
];

export const stepSets = steps;

// Pakketprijs = som van de normale 'vanaf'-prijzen van de diensten in het pakket, min €100 pakketkorting.
const PAKKET_KORTING = 100;
const num = (v) => Number(String(v).replace(/[^0-9]/g, '')) || 0;
const pakketPrijs = (list, korting = PAKKET_KORTING) => '€' + (list.reduce((t, [slug]) => t + num(services.find((x) => x.slug === slug).price.from), 0) - korting);

export const packages = [
  // Elk pakket bundelt 3 of 4 diensten (slug uit `services` + korte toelichting wat er in het pakket zit).
  { label: 'Pakket 1', name: 'Starter', unit: 'eenmalig, excl. maandkosten', intro: 'Snel en goed online, en meteen vindbaar.',
    services: [
      ['onepage-website', 'Eén sterke pagina, responsive met contactformulier'],
      ['zoekmachine-optimalisatie', 'Basis SEO: titels, teksten en techniek op orde'],
      ['llm-vindbaarheid', 'Zo vinden ChatGPT en Google Ai je ook'],
    ] },
  { label: 'Pakket 2', name: 'Groei', unit: 'eenmalig, excl. maandkosten', featured: true, intro: 'Een complete website die klanten binnenhaalt.',
    services: [
      ['maatwerk-website', "Tot 8 pagina's, volledig op maat ontworpen"],
      ['zoekmachine-optimalisatie', 'SEO per pagina, gericht op jouw regio'],
      ['google-ads', 'Opzet van je eerste campagne'],
      ['drone-fotografie-video', "Eén opname met drone foto's voor je site"],
    ] },
  { label: 'Pakket 3', name: 'Compleet', korting: 0, unit: 'eenmalig, excl. maandkosten', intro: 'Merk, website en marketing uit één hand.',
    services: [
      ['rebranding', 'Nieuwe huisstijl met brandbook'],
      ['webshop-laten-maken', 'Website of webshop op basis van je nieuwe merk'],
      ['online-marketing', 'Social media en campagnes doorlopend geregeld'],
      ['ai-oplossingen', 'Slimme automatisering die je tijd bespaart'],
    ] },
];
for (const p of packages) p.price = pakketPrijs(p.services, p.korting ?? PAKKET_KORTING); // korting per pakket instelbaar (Compleet: geen korting)

// TIJDELIJKE PRIJS
// Zolang hier een bedrag staat, toont de hele site overal "vanaf <bedrag>" (diensten, categorieën, pakketten).
// Terug naar de normale prijzen hierboven? Zet de waarde op null en draai `npm run build`.
export const tijdelijkePrijs = '€1975';
// Let op: zodra er in /system → Prijzen is opgeslagen, gelden die prijzen op de live site (ze worden in de browser ingeladen).

// Normale prijzen (vóór de tijdelijke prijs). /system gebruikt deze als standaardwaarden.
export const basisPrijzen = {
  tijdelijkePrijs: tijdelijkePrijs || '',
  services: services.map((s) => ({ slug: s.slug, name: s.name, cat: s.cat, ...s.price })),
  categories: categories.map((c) => ({ id: c.id, name: c.name, from: c.from || '' })),
  packages: packages.map((p) => ({ name: p.name, price: p.price, unit: p.unit })),
};

if (tijdelijkePrijs) {
  for (const c of categories) c.from = tijdelijkePrijs;
  for (const s of services) {
    s.price = { ...s.price, from: tijdelijkePrijs };
    delete s.price.monthly;
    if (s.price.note && s.price.note.includes('€')) delete s.price.note;
  }
}
