// 100 template definitions across 10 industries.
// Generated procedurally so each industry has 10 moods, with consistent schema.

export type HeroStyle = "split" | "fullbleed" | "diagonal" | "geometric" | "cinematic";
export type BackgroundType =
  | "particle-network"
  | "geometric-mesh"
  | "aurora"
  | "floating-shapes"
  | "video-loop"
  | "noise-grid";
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
  };
}

export const TEMPLATES: Template[] = INDUSTRIES.flatMap((industry) =>
  Array.from({ length: 10 }, (_, i) => buildTemplate(industry, i))
);

export const TEMPLATES_BY_INDUSTRY: Record<Industry, Template[]> = INDUSTRIES.reduce((acc, ind) => {
  acc[ind] = TEMPLATES.filter((t) => t.industry === ind);
  return acc;
}, {} as Record<Industry, Template[]>);
