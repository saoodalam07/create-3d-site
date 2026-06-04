// 100 template definitions across 10 industries.
// Generated procedurally so each industry has 10 moods, with consistent schema.

export type HeroStyle = "split" | "fullbleed" | "diagonal" | "geometric" | "cinematic";
export type BackgroundType =
  | "particle-network"
  | "geometric-mesh"
  | "aurora"
  | "floating-shapes"
  | "video-loop"
  | "noise-grid"
  | "construction-3d"
  | "waterfall-3d"
  | "photo-parallax";
export type ScrollAnimation =
  | "depth-rise"
  | "perspective-reveal"
  | "parallax-layers"
  | "card-cascade"
  | "counter-3d"
  | "section-morph";

export interface Template {
  templateId: string;
  name: string;
  industry: Industry;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  heroStyle: HeroStyle;
  backgroundType: BackgroundType;
  sections: string[];
  effects3d: string[];
  headlineFont: string;
  bodyFont: string;
  mood: string;
  scrollAnimation: ScrollAnimation;
  // Copy
  headline: string;
  subline: string;
  ctaLabel: string;
  stats: { number: string; label: string }[];
  services: { name: string; description: string }[];
  photos: string[];
}

export const INDUSTRIES = [
  "Construction",
  "Architecture",
  "Tech",
  "Healthcare",
  "Finance",
  "Real Estate",
  "Education",
  "Manufacturing",
  "Energy",
  "Retail",
] as const;
export type Industry = (typeof INDUSTRIES)[number];

export const INDUSTRY_COLORS: Record<Industry, string> = {
  Construction: "#f59e0b",
  Architecture: "#64748b",
  Tech: "#8b5cf6",
  Healthcare: "#06b6d4",
  Finance: "#10b981",
  "Real Estate": "#ef4444",
  Education: "#3b82f6",
  Manufacturing: "#ea580c",
  Energy: "#eab308",
  Retail: "#ec4899",
};

// Real-image pools per industry. Mix of curated Unsplash IDs that are reliably
// available + an Unsplash Source fallback keyed by industry keywords so each
// template gets a different photo set without us hand-curating 100 lists.
const UNSPLASH_IDS: Record<Industry, string[]> = {
  Construction: [
    "1504307651254-35680f356dfd","1541888946425-d81bb19240f5","1581094271901-8022df4466f9",
    "1590856029826-c7a73142bbf1","1503387762-cf4f0f5b0c45","1565008447742-97f6f38c985c",
  ],
  Architecture: [
    "1487958449943-2429e8be8625","1431576901776-e539bd916ba2","1486325212027-8081e485255e",
    "1449157291145-7efd050a4d0e","1460472178825-e5240623afd5","1503387837-b154d5074bd2",
  ],
  Tech: [
    "1518770660439-4636190af475","1517694712202-14dd9538aa97","1531297484001-80022131f5a1",
    "1551434678-e076c223a692","1581090464777-f3220bbe1b8b","1573164713988-8665fc963095",
  ],
  Healthcare: [
    "1576091160399-112ba8d25d1d","1538108149393-fbbd81895907","1582719508461-905c673771fd",
    "1559757148-5c350d0d3c56","1631815587646-b85a1bb027e1","1584820927498-cfe5211fd8bf",
  ],
  Finance: [
    "1518186285589-2f7649de83e0","1565514020179-026b92b84bb6","1554224155-6726b3ff858f",
    "1559526324-4b87b5e36e44","1543286386-713bdd548da4","1611974789855-9c2a0a7236a3",
  ],
  "Real Estate": [
    "1564013799919-ab600027ffc6","1568605114967-8130f3a36994","1570129477492-45c003edd2be",
    "1502672023488-70e25813eb80","1512917774080-9991f1c4c750","1494526585095-c41746248156",
  ],
  Education: [
    "1503676260728-1c00da094a0b","1523580494863-6f3031224c94","1509062522246-3755977927d7",
    "1517842645767-c639042777db","1546410531-bb4caa6b424d","1571260899304-425eee4c7efc",
  ],
  Manufacturing: [
    "1565793298595-6a879b1d9492","1581091226825-a6a2a5aee158","1567789884554-0b844b597180",
    "1504917595217-d4dc5ebe6122","1542838132-92c53300491e","1518709268805-4e9042af2176",
  ],
  Energy: [
    "1466611653911-95081537e5b7","1509391366360-2e959784a276","1497435334941-8c899ee9e8e9",
    "1473341304170-971dccb5ac1e","1518709268805-4e9042af2176","1542601906990-b4d3fb778b09",
  ],
  Retail: [
    "1441986300917-64674bd600d8","1483985988355-763728e1935b","1490481651871-ab68de25d43d",
    "1556905055-8f358a7a47b2","1567401893414-76b7b1e5a7a5","1521577352947-9bb58764b69a",
  ],
};
const KEYWORDS: Record<Industry, string> = {
  Construction: "construction,building,site,crane,worker",
  Architecture: "architecture,modern-building",
  Tech: "technology,computer,software",
  Healthcare: "healthcare,medical,clinic",
  Finance: "finance,office,city",
  "Real Estate": "real-estate,house,interior",
  Education: "education,classroom,books",
  Manufacturing: "manufacturing,factory,machine",
  Energy: "energy,solar,wind-turbine",
  Retail: "retail,store,shop",
};
function photosFor(industry: Industry, idx: number): string[] {
  const ids = UNSPLASH_IDS[industry];
  const offset = idx % ids.length;
  const rotated = [...ids.slice(offset), ...ids.slice(0, offset)];
  const primary = rotated.slice(0, 4).map((id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`);
  const extra = `https://source.unsplash.com/1200x800/?${KEYWORDS[industry]}&sig=${idx + 1}`;
  return [...primary, extra];
}

const MOODS: Record<Industry, string[]> = {
  Construction: ["heavy-civil","luxury-residential","green-sustainable","smart-building","industrial-warehouse","architectural-portfolio","demolition","modular-prefab","heritage-restoration","infrastructure-gov"],
  Tech: ["saas-minimal","ai-company","developer-tools","cybersecurity","fintech","data-analytics","hardware","gaming-studio","open-source","deeptech"],
  Architecture: ["modern-studio","brutalist","parametric","interior-design","landscape","urban-planning","heritage","residential-luxury","commercial","sustainable"],
  Healthcare: ["clinic","telemedicine","pharma","wellness","dental","mental-health","medical-device","hospital","biotech","research-lab"],
  Finance: ["investment-bank","crypto","insurance","accounting","venture-capital","wealth-management","neobank","trading","mortgage","audit"],
  "Real Estate": ["luxury-listings","commercial-property","proptech","rental-platform","agency","new-development","industrial-property","coworking","property-management","REIT"],
  Education: ["university","edtech-platform","online-courses","k12","bootcamp","tutoring","research-institute","language-school","corporate-training","library"],
  Manufacturing: ["heavy-industry","precision-engineering","automotive","aerospace","electronics","food-processing","textiles","chemicals","packaging","robotics"],
  Energy: ["solar","wind","oil-gas","nuclear","ev-charging","battery-storage","smart-grid","hydro","energy-consulting","utilities"],
  Retail: ["luxury-fashion","d2c-brand","marketplace","grocery","electronics-store","furniture","beauty","sportswear","sustainable-brand","pop-up"],
};

const NAMES: Record<Industry, string[]> = {
  Construction: ["Ironclad Pro","Skyline Build","Verdant Frame","Atlas Smart","Forge Yard","Atelier Build","Demolish Co","Modulex","Patina Works","Civicore"],
  Tech: ["Lumen SaaS","Cortex AI","Devforge","Sentinel Sec","Ledgerly","Datacrest","Hardline","Pixel Arena","Opencraft","Quantora"],
  Architecture: ["Studio Norte","Bruta","Parametria","Inside Out","Greenline","Urbano","Heritage Hall","Maison Lux","Commerz","Eco Atelier"],
  Healthcare: ["Clinica","Telecare","Pharmos","Wellbeing","Smile Studio","Mindframe","Medex","Cityhealth","BioOrbit","Labworks"],
  Finance: ["Northbank","Cryptos","Insurio","Ledger Plus","Vanguard VC","Wealthcraft","Nimblebank","Tradehub","Mortix","Auditly"],
  "Real Estate": ["Estatera","Comprop","Proptech Hub","Rentic","Agency Co","New Build","Indproperty","Cowork","Manageit","REIT Pro"],
  Education: ["Universa","Edupath","Coursely","K12 Hub","Bootforge","Tutorly","Researchq","Lingua","Corptrain","Bibliotek"],
  Manufacturing: ["Heavyworks","Precisia","Autoline","Aeroforge","Electrix","Foodworks","Textura","Chemix","Packline","Roboticum"],
  Energy: ["Solaris","Windmark","Petrocore","Atomwave","Voltgrid","Battarx","Smartgrid","Hydrowave","Consultia","Utilitypro"],
  Retail: ["Maison","D2C Lab","Marketsphere","Freshly","Electroshop","Casaform","Beauty Co","Sportora","Greenshop","Popnow"],
};

const HERO_STYLES: HeroStyle[] = ["split","fullbleed","diagonal","geometric","cinematic"];
const BACKGROUNDS: BackgroundType[] = ["particle-network","geometric-mesh","aurora","floating-shapes","video-loop","noise-grid"];
const SCROLL_ANIMS: ScrollAnimation[] = ["depth-rise","perspective-reveal","parallax-layers","card-cascade","counter-3d","section-morph"];
const FONTS_HEAD = ["Space Grotesk","Syne","Outfit","Sora","Urbanist","Instrument Serif","DM Serif Display","Cormorant","Bebas Neue","Archivo Black"];
const FONTS_BODY = ["Inter","DM Sans","Plus Jakarta Sans","Manrope","Work Sans","IBM Plex Sans","Karla","Nunito Sans","Hind","Cabin"];

const HEADLINES: Record<Industry, string[]> = {
  Construction: ["We Build What Stands the Test of Time","Steel, Concrete, Vision","Engineered to Outlast"],
  Architecture: ["Spaces That Move People","Form Follows Curiosity","Designing the Quiet Future"],
  Tech: ["Software That Disappears","Ship Faster. Sleep Better.","Infrastructure for the Next Decade"],
  Healthcare: ["Care, Reimagined","Health Without Friction","Better Outcomes Start Here"],
  Finance: ["Capital, Confidently","Money That Works Quietly","Your Wealth, Engineered"],
  "Real Estate": ["Where Stories Find a Home","Property, Precisely","The City, Curated"],
  Education: ["Learn Without Limits","Knowledge Built for Now","Where Curiosity Compounds"],
  Manufacturing: ["Precision at Industrial Scale","From Raw to Remarkable","Built Where It Matters"],
  Energy: ["Powering What Comes Next","Clean Power. Steady Grid.","Energy, Reinvented"],
  Retail: ["Goods With a Backstory","Made for the Way You Live","Style That Stays"],
};

const SERVICES: Record<Industry, string[]> = {
  Construction: ["General Contracting","Project Management","Site Engineering"],
  Architecture: ["Concept Design","Construction Docs","Interior Architecture"],
  Tech: ["Cloud Platform","Developer SDK","Enterprise Support"],
  Healthcare: ["Primary Care","Specialty Services","Preventive Programs"],
  Finance: ["Advisory","Portfolio Management","Tax Strategy"],
  "Real Estate": ["Listings","Valuations","Property Management"],
  Education: ["Live Cohorts","On-Demand Courses","Mentorship"],
  Manufacturing: ["CNC Machining","Assembly","Quality Assurance"],
  Energy: ["Installation","Monitoring","Grid Integration"],
  Retail: ["Online Store","Wholesale","Bespoke Orders"],
};

function pick<T>(arr: T[], i: number): T { return arr[i % arr.length]; }

function shiftHue(hex: string, deg: number): string {
  // simple HSL shift
  const r = parseInt(hex.slice(1,3),16)/255, g=parseInt(hex.slice(3,5),16)/255, b=parseInt(hex.slice(5,7),16)/255;
  const max=Math.max(r,g,b), min=Math.min(r,g,b); let h=0,s=0; const l=(max+min)/2;
  if(max!==min){const d=max-min; s=l>0.5?d/(2-max-min):d/(max+min);
    switch(max){case r:h=((g-b)/d+(g<b?6:0));break;case g:h=((b-r)/d+2);break;default:h=((r-g)/d+4);}
    h*=60;
  }
  h=(h+deg+360)%360;
  const hslToRgb=(h:number,s:number,l:number)=>{const c=(1-Math.abs(2*l-1))*s; const x=c*(1-Math.abs(((h/60)%2)-1)); const m=l-c/2;
    let r1=0,g1=0,b1=0;
    if(h<60){r1=c;g1=x;}else if(h<120){r1=x;g1=c;}else if(h<180){g1=c;b1=x;}else if(h<240){g1=x;b1=c;}else if(h<300){r1=x;b1=c;}else{r1=c;b1=x;}
    return [Math.round((r1+m)*255),Math.round((g1+m)*255),Math.round((b1+m)*255)];
  };
  const [R,G,B]=hslToRgb(h,s,l);
  return "#"+[R,G,B].map(v=>v.toString(16).padStart(2,"0")).join("");
}

function buildTemplate(industry: Industry, idx: number): Template {
  const base = INDUSTRY_COLORS[industry];
  const mood = MOODS[industry][idx];
  const name = NAMES[industry][idx];
  const prefix = industry.slice(0,4).toLowerCase().replace(" ","");
  const id = `${prefix}-${String(idx+1).padStart(3,"0")}`;
  const primary = shiftHue(base, (idx * 12) - 30);
  const secondary = shiftHue(base, (idx * 12) + 40);
  const accent = shiftHue(base, (idx * 12) + 180);
  return {
    templateId: id,
    name,
    industry,
    primaryColor: primary,
    secondaryColor: secondary,
    accentColor: accent,
    heroStyle: pick(HERO_STYLES, idx),
    backgroundType: pick(BACKGROUNDS, idx),
    sections: ["hero","stats","services","about","projects","testimonials","pricing","contact"].slice(0, 6 + (idx % 3)),
    effects3d: ["layered-depth","parallax-tilt","glass-overlay","counter-flip"],
    headlineFont: pick(FONTS_HEAD, idx),
    bodyFont: pick(FONTS_BODY, idx),
    mood,
    scrollAnimation: pick(SCROLL_ANIMS, idx),
    headline: pick(HEADLINES[industry], idx),
    subline: `A ${mood.replace(/-/g," ")} approach to ${industry.toLowerCase()} — crafted by a team that ships, not pitches.`,
    ctaLabel: idx % 2 === 0 ? "Get Started" : "Talk to the Team",
    stats: [
      { number: `${100 + idx * 37}+`, label: "Projects Delivered" },
      { number: `${idx + 4}y`, label: "Track Record" },
      { number: `${85 + idx}%`, label: "Client Retention" },
    ],
    services: SERVICES[industry].map((s) => ({
      name: s,
      description: `${s} engineered for the ${mood.replace(/-/g," ")} segment — measurable outcomes, real timelines.`,
    })),
    photos: photosFor(industry, idx),
  };
}

export const TEMPLATES: Template[] = INDUSTRIES.flatMap((industry) =>
  Array.from({ length: 10 }, (_, i) => buildTemplate(industry, i))
);

export const TEMPLATES_BY_INDUSTRY: Record<Industry, Template[]> = INDUSTRIES.reduce((acc, ind) => {
  acc[ind] = TEMPLATES.filter((t) => t.industry === ind);
  return acc;
}, {} as Record<Industry, Template[]>);
