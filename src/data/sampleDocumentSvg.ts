/**
 * Generates an SVG data URL representing a realistic scanned historical
 * West Bengal Land Record (Khatian / RoR Porcha) with official seals,
 * Bengali headers, handwritten ink variations, stamps, and signatures.
 */

export function getSampleDocumentSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" width="800" height="1100" style="background:#FAF6EE; font-family:'Segoe UI', Arial, sans-serif;">
  <defs>
    <!-- Paper Texture Filter -->
    <filter id="paper-texture" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise"/>
      <feDiffuseLighting in="noise" lighting-color="#F6F0DF" surfaceScale="1.5" result="light">
        <feDistantLight azimuth="60" elevation="50"/>
      </feDiffuseLighting>
      <feBlend mode="multiply" in="SourceGraphic" in2="light"/>
    </filter>

    <!-- Faded ink filter -->
    <filter id="ink-bleed" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="0.4" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background with subtle age stains -->
  <rect width="800" height="1100" fill="#F8F4E8"/>
  <rect width="780" height="1080" x="10" y="10" fill="none" stroke="#D7C9AC" stroke-width="1.5"/>
  <rect width="768" height="1068" x="16" y="16" fill="none" stroke="#8E7D63" stroke-width="2"/>
  
  <!-- Subtle aged paper stain spots -->
  <circle cx="700" cy="90" r="60" fill="#EEDFBA" opacity="0.4"/>
  <circle cx="90" cy="980" r="80" fill="#E8D9B0" opacity="0.3"/>
  <circle cx="420" cy="550" r="140" fill="#F0E3C8" opacity="0.25"/>

  <!-- Top Emblems & Header -->
  <g transform="translate(400, 75)" text-anchor="middle">
    <!-- Circular Seal -->
    <circle cx="0" cy="0" r="32" fill="none" stroke="#163A63" stroke-width="2"/>
    <circle cx="0" cy="0" r="28" fill="none" stroke="#163A63" stroke-dasharray="2,2"/>
    <text y="-8" font-size="7" font-weight="bold" fill="#163A63" letter-spacing="1">GOVT. OF WEST BENGAL</text>
    <text y="5" font-size="11" font-weight="bold" fill="var(--color-error)">★ সত্যমেব জয়তে ★</text>
    <text y="16" font-size="6.5" font-weight="bold" fill="#163A63">DEPT OF LAND REFORMS</text>
  </g>

  <!-- Official Form Title -->
  <text x="400" y="135" text-anchor="middle" font-size="14" font-weight="bold" fill="#1E293B" letter-spacing="0.5">
    ফরম নং ৫৪৪০ / FORM NO. 5440 (রেকর্ড অব রাইটস / RECORD OF RIGHTS)
  </text>
  <text x="400" y="153" text-anchor="middle" font-size="11" font-weight="600" fill="#475569">
    পশ্চিমবঙ্গ ভূমি সংস্কার আইন, ১৯৫৫ (WEST BENGAL LAND REFORMS ACT)
  </text>

  <!-- Form Metadata Header Bar -->
  <g transform="translate(40, 170)">
    <rect width="720" height="42" fill="#EAE2CE" stroke="#7A6A52" stroke-width="1.2"/>
    <line x1="240" y1="0" x2="240" y2="42" stroke="#7A6A52"/>
    <line x1="480" y1="0" x2="480" y2="42" stroke="#7A6A52"/>
    
    <text x="12" y="18" font-size="10" font-weight="bold" fill="#334155">জিলা / District: <tspan font-family="Georgia, serif" font-weight="normal" fill="#0F172A">Darjeeling (দার্জিলিং)</tspan></text>
    <text x="12" y="34" font-size="9" fill="#64748B">J.L. No. / জে. এল. নং: 42</text>

    <text x="252" y="18" font-size="10" font-weight="bold" fill="#334155">থানা / Tehsil: <tspan font-family="Georgia, serif" font-weight="normal" fill="#0F172A">XYZ (দার্জিলিং সদর)</tspan></text>
    <text x="252" y="34" font-size="9" fill="#64748B">Circle / রেভিনিউ সার্কেল: North-02</text>

    <text x="492" y="18" font-size="10" font-weight="bold" fill="#334155">মৌজা / Village: <tspan font-family="Georgia, serif" font-weight="normal" fill="#0F172A">ABC (কাঞ্চনজঙ্ঘা মৌজা)</tspan></text>
    <text x="492" y="34" font-size="9" fill="#64748B">Year of Survey / জরীপ সন: ১৯৬৮-৬৯</text>
  </g>

  <!-- Large Porcha / Khatian Identification Header -->
  <g transform="translate(40, 230)">
    <!-- Stamp Box (Top Right) -->
    <g transform="translate(560, 5)">
      <rect width="140" height="60" fill="#FFF5F5" stroke="#DC2626" stroke-width="1.5" stroke-dasharray="4,2"/>
      <text x="70" y="22" text-anchor="middle" font-size="10" font-weight="bold" fill="#DC2626">REVENUE STAMP</text>
      <text x="70" y="38" text-anchor="middle" font-size="12" font-weight="bold" fill="#991B1B">₹ ২০.০০</text>
      <text x="70" y="52" text-anchor="middle" font-size="8" fill="var(--color-error)">REVENUE AUDIT PASSED</text>
      <!-- Stamp Cross Ink -->
      <line x1="10" y1="10" x2="130" y2="50" stroke="#1D4ED8" stroke-width="1.5" opacity="0.6"/>
      <line x1="10" y1="50" x2="130" y2="10" stroke="#1D4ED8" stroke-width="1.5" opacity="0.6"/>
    </g>

    <!-- Khatian Badge -->
    <rect width="260" height="48" fill="#F1ECE0" stroke="#4A3B2C" stroke-width="1.5"/>
    <text x="15" y="22" font-size="11" font-weight="bold" fill="#1E293B">খতিয়ান নম্বর / KHATIAN NO:</text>
    <text x="15" y="42" font-family="'Courier New', monospace" font-size="20" font-weight="900" fill="#092B4C">১ ৪৫ ৬  /  1456</text>
  </g>

  <!-- Primary Tabular Layout (The Porcha Fields) -->
  <g transform="translate(40, 310)">
    <!-- Outer Table Frame -->
    <rect width="720" height="490" fill="#FFFDF8" stroke="#332B20" stroke-width="2"/>

    <!-- Horizontal Column Headers -->
    <rect width="720" height="38" fill="#E2D8C3" stroke="#332B20" stroke-width="1.2"/>
    <line x1="0" y1="38" x2="720" y2="38" stroke="#332B20" stroke-width="1.5"/>

    <!-- Vertical Column Separators -->
    <!-- Col 1: Serial (50px) -->
    <line x1="50" y1="0" x2="50" y2="490" stroke="#4A3B2C" stroke-width="1.2"/>
    <!-- Col 2: Owner & Parent Name (220px) -->
    <line x1="270" y1="0" x2="270" y2="490" stroke="#4A3B2C" stroke-width="1.2"/>
    <!-- Col 3: Share/অংশ (70px) -->
    <line x1="340" y1="0" x2="340" y2="490" stroke="#4A3B2C" stroke-width="1.2"/>
    <!-- Col 4: Plot No / দাগ নং (110px) -->
    <line x1="450" y1="0" x2="450" y2="490" stroke="#4A3B2C" stroke-width="1.2"/>
    <!-- Col 5: Land Type / শ্রেণী (130px) -->
    <line x1="580" y1="0" x2="580" y2="490" stroke="#4A3B2C" stroke-width="1.2"/>
    <!-- Col 6: Area / পরিমাণ (140px) -->

    <!-- Header Text -->
    <text x="25" y="24" text-anchor="middle" font-size="10" font-weight="bold" fill="#1E293B">ক্রমিক</text>
    <text x="160" y="16" text-anchor="middle" font-size="10" font-weight="bold" fill="#1E293B">রায়তের নাম ও পিতার নাম</text>
    <text x="160" y="30" text-anchor="middle" font-size="9" fill="#475569">Owner &amp; Parentage</text>
    
    <text x="305" y="24" text-anchor="middle" font-size="10" font-weight="bold" fill="#1E293B">অংশ (Share)</text>
    
    <text x="395" y="16" text-anchor="middle" font-size="10" font-weight="bold" fill="#1E293B">দাগ নম্বর</text>
    <text x="395" y="30" text-anchor="middle" font-size="9" fill="#475569">Plot No.</text>

    <text x="515" y="16" text-anchor="middle" font-size="10" font-weight="bold" fill="#1E293B">জমির শ্রেণী</text>
    <text x="515" y="30" text-anchor="middle" font-size="9" fill="#475569">Classification</text>

    <text x="650" y="16" text-anchor="middle" font-size="10" font-weight="bold" fill="#1E293B">জমির পরিমাণ</text>
    <text x="650" y="30" text-anchor="middle" font-size="9" fill="#475569">Area (Acre)</text>

    <!-- Table Rows -->
    <!-- Row 1: Primary Target Row for Ramesh Das (Record #1024) -->
    <g transform="translate(0, 38)">
      <!-- Row background light tint -->
      <rect width="720" height="90" fill="#FFFCF3"/>
      <line x1="0" y1="90" x2="720" y2="90" stroke="#4A3B2C" stroke-width="1"/>

      <!-- Col 1: Serial -->
      <text x="25" y="48" text-anchor="middle" font-family="'Courier New', monospace" font-size="14" font-weight="bold" fill="#334155">১ / 1</text>

      <!-- Col 2: Owner & Parent Name (Target bounding box coordinate area: x~55, y~38) -->
      <!-- Handwritten style representation of Ramesh Das -->
      <text x="60" y="32" font-family="'Brush Script MT', 'Segoe Script', cursive, serif" font-size="18" font-weight="bold" fill="#0C2340">
        রমেশ দাস / Ramesh Das
      </text>
      <text x="60" y="54" font-family="'Brush Script MT', 'Segoe Script', cursive, serif" font-size="14" fill="#1E3A8A">
        পিতা: হরণ দাস / S/o Haran Das
      </text>
      <text x="60" y="74" font-size="10" fill="#475569">
        সাং: এবিসি, দার্জিলিং (Res: ABC, Darjeeling)
      </text>

      <!-- Col 3: Share -->
      <text x="305" y="48" text-anchor="middle" font-family="'Courier New', monospace" font-size="13" font-weight="bold" fill="#1E293B">১.০০০ / 1.00</text>

      <!-- Col 4: Plot No. (Handwritten with slight blur mimicking the 372/302 OCR ambiguity) -->
      <g transform="translate(360, 20)">
        <text x="35" y="32" text-anchor="middle" font-family="'Courier New', cursive, monospace" font-size="22" font-weight="bold" fill="#0A2540" letter-spacing="2">
          ৩০২
        </text>
        <text x="35" y="48" text-anchor="middle" font-size="11" font-style="italic" fill="#64748B">
          [ 302 / 372 ]
        </text>
      </g>

      <!-- Col 5: Land Type -->
      <text x="515" y="40" text-anchor="middle" font-family="Georgia, serif" font-size="13" font-weight="bold" fill="#1E293B">কৃষি / আমন</text>
      <text x="515" y="58" text-anchor="middle" font-size="10" fill="#475569">Agricultural</text>

      <!-- Col 6: Area -->
      <text x="650" y="38" text-anchor="middle" font-family="'Courier New', monospace" font-size="16" font-weight="bold" fill="#0F172A">০.৮২ একর</text>
      <text x="650" y="56" text-anchor="middle" font-size="12" font-weight="bold" fill="#1E3A8A">0.82 Acre</text>
      <text x="650" y="72" text-anchor="middle" font-size="9" fill="#DC2626">(Ref: 0.75 Ac)</text>
    </g>

    <!-- Row 2: Secondary Neighboring Record (Suresh Das) -->
    <g transform="translate(0, 128)">
      <line x1="0" y1="75" x2="720" y2="75" stroke="#7A6A52" stroke-width="0.8"/>
      <text x="25" y="42" text-anchor="middle" font-family="'Courier New', monospace" font-size="13" fill="#475569">২ / 2</text>
      <text x="60" y="32" font-family="'Brush Script MT', cursive, serif" font-size="15" fill="#334155">সুরেশ দাস / Suresh Das</text>
      <text x="60" y="52" font-size="11" fill="#64748B">পিতা: হরেন দাস / S/o Haren Das</text>
      
      <text x="305" y="42" text-anchor="middle" font-size="12" fill="#334155">০.৫০০</text>
      <text x="395" y="42" text-anchor="middle" font-family="'Courier New', monospace" font-size="14" font-weight="bold" fill="#334155">৩০৩ (303)</text>
      <text x="515" y="35" text-anchor="middle" font-size="12" fill="#334155">বাস্তু (Homestead)</text>
      <text x="650" y="42" text-anchor="middle" font-family="'Courier New', monospace" font-size="13" fill="#334155">০.৪৫ একর (0.45)</text>
    </g>

    <!-- Row 3: Third Neighboring Record (Animesh Roy) -->
    <g transform="translate(0, 203)">
      <line x1="0" y1="75" x2="720" y2="75" stroke="#7A6A52" stroke-width="0.8"/>
      <text x="25" y="42" text-anchor="middle" font-family="'Courier New', monospace" font-size="13" fill="#475569">৩ / 3</text>
      <text x="60" y="32" font-family="'Brush Script MT', cursive, serif" font-size="15" fill="#334155">অনিমেষ রায় / Animesh Roy</text>
      <text x="60" y="52" font-size="11" fill="#64748B">পিতা: বিমল রায় / S/o Bimal Roy</text>
      
      <text x="305" y="42" text-anchor="middle" font-size="12" fill="#334155">১.০০০</text>
      <text x="395" y="42" text-anchor="middle" font-family="'Courier New', monospace" font-size="14" font-weight="bold" fill="#334155">৩০৪ (304)</text>
      <text x="515" y="35" text-anchor="middle" font-size="12" fill="#334155">পুকুর (Waterbody)</text>
      <text x="650" y="42" text-anchor="middle" font-family="'Courier New', monospace" font-size="13" fill="#334155">০.৬০ একর (0.60)</text>
    </g>

    <!-- Additional Ledger Rows & Lines -->
    <g transform="translate(0, 278)">
      <line x1="0" y1="70" x2="720" y2="70" stroke="#7A6A52" stroke-width="0.8"/>
      <line x1="0" y1="140" x2="720" y2="140" stroke="#7A6A52" stroke-width="0.8"/>
      <text x="25" y="38" text-anchor="middle" font-size="11" fill="#94A3B8">৪</text>
      <text x="60" y="38" font-size="11" fill="#94A3B8">-- সমষ্টি খতিয়ান হিসেব / Ledger aggregation --</text>
      <text x="650" y="38" text-anchor="middle" font-size="11" fill="#94A3B8">১.৮৭ একর</text>
    </g>
  </g>

  <!-- Official Footer, Verification Stamps & Signature -->
  <g transform="translate(40, 830)">
    <!-- Official Oval Stamp -->
    <g transform="translate(90, 80) rotate(-10)">
      <ellipse cx="0" cy="0" rx="75" ry="36" fill="none" stroke="#6D28D9" stroke-width="2.2" stroke-dasharray="8,2"/>
      <text y="-14" text-anchor="middle" font-size="8" font-weight="bold" fill="#6D28D9">GOVT. OF WEST BENGAL</text>
      <text y="3" text-anchor="middle" font-size="9" font-weight="bold" fill="#4C1D95">DARJEELING REVENUE DIV.</text>
      <text y="18" text-anchor="middle" font-size="7.5" fill="#6D28D9">VERIFIED AGAINST CADASTRE</text>
    </g>

    <!-- Round Verification Stamp -->
    <g transform="translate(340, 75)">
      <circle cx="0" cy="0" r="32" fill="none" stroke="#059669" stroke-width="2"/>
      <circle cx="0" cy="0" r="28" fill="none" stroke="#059669" stroke-width="0.8"/>
      <text y="-8" text-anchor="middle" font-size="7.5" font-weight="bold" fill="#047857">AI EXTRACTED</text>
      <text y="5" text-anchor="middle" font-size="9" font-weight="bold" fill="#065F46">MATCH 94%</text>
      <text y="16" text-anchor="middle" font-size="7" fill="#047857">DIGI-LAND</text>
    </g>

    <!-- Officer Signature -->
    <g transform="translate(540, 60)">
      <!-- Signature squiggly line -->
      <path d="M 0,25 Q 25,0 45,28 T 85,20 T 120,35" fill="none" stroke="#092B4C" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="-10" y1="45" x2="140" y2="45" stroke="#334155" stroke-width="1"/>
      <text x="65" y="60" text-anchor="middle" font-size="10" font-weight="bold" fill="#1E293B">রাজস্ব আধিকারিক / Revenue Officer</text>
      <text x="65" y="74" text-anchor="middle" font-size="9" fill="#64748B">Darjeeling Sadar Sub-Division</text>
      <text x="65" y="88" text-anchor="middle" font-size="8" fill="#94A3B8">Date: 12-09-2026</text>
    </g>
  </g>

  <!-- Bottom Page Number and Security Code -->
  <g transform="translate(40, 1040)">
    <text x="0" y="0" font-family="'Courier New', monospace" font-size="9" fill="#64748B">REF: WB-DRJ-1456-PORCHA-ROR-1024</text>
    <text x="720" y="0" text-anchor="end" font-size="9" fill="#64748B">Page 1 of 1 (Form No. 5440-C)</text>
  </g>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
