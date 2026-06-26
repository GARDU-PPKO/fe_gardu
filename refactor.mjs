import fs from 'fs';
import path from 'path';

const content = fs.readFileSync('src/App.tsx', 'utf-8');
const parts = content.split(/\/\/\s*───\s*.*?\s*───.*/g);

// Helper to extract arrays
const extractData = (str, varName) => {
  const regex = new RegExp(`const\\s+${varName}\\s*=\\s*(\\[[\\s\\S]*?\\]);`);
  const match = str.match(regex);
  return match ? match[0] : '';
};

// 1. DATA
const dusunMatch = parts[3].match(/const DUSUN = (\[[\s\S]*?\]);\s*function DusunSlider/);
const dusunStr = dusunMatch ? `export const DUSUN = ${dusunMatch[1]};\nexport type DusunData = typeof DUSUN[0];` : '';

const packagesStr = extractData(parts[5], 'PACKAGES').replace('const PACKAGES', 'export const PACKAGES');
const catsStr = extractData(parts[6], 'CATS').replace('const CATS', 'export const CATS');
const productsStr = extractData(parts[6], 'PRODUCTS').replace('const PRODUCTS', 'export const PRODUCTS');
const budayaStr = extractData(parts[7], 'BUDAYA_ITEMS').replace('const BUDAYA_ITEMS', 'export const BUDAYA_ITEMS');

const mockDataContent = `
${dusunStr}
${packagesStr}
${catsStr}
${productsStr}
${budayaStr}
`;
fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync('src/data/mockData.ts', mockDataContent.trim());

// 2. COMPONENTS
const writeComp = (folder, filename, funcName, rawCode, extraImports = '') => {
  fs.mkdirSync(`src/components/${folder}`, { recursive: true });
  
  // Make function default export
  let code = rawCode.replace(`function ${funcName}`, `export default function ${funcName}`);
  
  const imports = `import { useState, useEffect, useRef } from "react";
import {
  Menu, X, ArrowRight, MapPin, Phone, Mail,
  Users, Home, Briefcase, Mountain, Star,
  MessageSquare, Info, Camera,
  ChevronLeft, ChevronRight, CheckCircle,
  Clock, Ticket, Leaf,
  Eye, Waves, TreePine, Heart
} from "lucide-react";
${extraImports}

const scrollTo = (href: string) => {
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
};
`;
  fs.writeFileSync(`src/components/${folder}/${filename}`, (imports + '\n' + code).trim());
};

// Remove data from component code
const cleanDusunSlider = parts[3].replace(/const DUSUN = \[[\s\S]*?\];\s*/, '');
const cleanDusunPage = parts[4].replace(/type DusunData = typeof DUSUN\[0\];\s*/, '');
const cleanPackages = parts[5].replace(/const PACKAGES = \[[\s\S]*?\];\s*/, '');
const cleanUmkm = parts[6].replace(/const CATS = \[[\s\S]*?\];\s*/, '').replace(/const PRODUCTS = \[[\s\S]*?\];\s*/, '');
const cleanBudaya = parts[7].replace(/const BUDAYA_ITEMS = \[[\s\S]*?\];\s*/, '');

writeComp('layout', 'Navbar.tsx', 'Navbar', parts[1]);
writeComp('sections', 'DusunSlider.tsx', 'DusunSlider', cleanDusunSlider, `import { DUSUN } from "../../data/mockData";`);
writeComp('sections', 'Hero.tsx', 'Hero', parts[2], `import DusunSlider from "./DusunSlider";\nimport { DUSUN } from "../../data/mockData";\nimport { LogoGardu } from "../../App";`);
writeComp('sections', 'DusunPage.tsx', 'DusunPage', cleanDusunPage, `import { DusunData } from "../../data/mockData";`);
writeComp('sections', 'TourPackages.tsx', 'TourPackages', cleanPackages, `import { PACKAGES } from "../../data/mockData";`);
writeComp('sections', 'UMKMSection.tsx', 'UMKMSection', cleanUmkm, `import { CATS, PRODUCTS } from "../../data/mockData";`);
writeComp('sections', 'KebudayaanSection.tsx', 'KebudayaanSection', cleanBudaya, `import { BUDAYA_ITEMS } from "../../data/mockData";`);

// 3. FOOTER
const appParts = parts[8].split(/{\/\* Footer \*\/}/);
let footerCodeRaw = appParts[1] ? appParts[1].substring(0, appParts[1].lastIndexOf('</div>')) : '';

const footerCode = `export default function Footer() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      {/* Footer */}
      ${footerCodeRaw.trim()}
    </>
  );
}`;

const fixedFooter = footerCode.replace(
  /<a href="#" className="w-10 h-10 rounded-full bg-white\/10 flex items-center justify-center hover:bg-green-600 hover:-translate-y-1 transition text-white text-xs font-bold">\s*IG\s*<\/a>/g,
  '<a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-600 hover:-translate-y-1 transition text-white text-lg"><FaInstagram /></a>'
).replace(
  /<a href="#" className="w-10 h-10 rounded-full bg-white\/10 flex items-center justify-center hover:bg-green-600 hover:-translate-y-1 transition text-white text-xs font-bold">\s*FB\s*<\/a>/g,
  '<a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-600 hover:-translate-y-1 transition text-white text-lg"><FaFacebook /></a>'
).replace(
  /<a href="#" className="w-10 h-10 rounded-full bg-white\/10 flex items-center justify-center hover:bg-green-600 hover:-translate-y-1 transition text-white text-xs font-bold">\s*YT\s*<\/a>/g,
  '<a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-600 hover:-translate-y-1 transition text-white text-lg"><FaYoutube /></a>'
);

const footerImports = `import { MapPin, Phone, Mail, ArrowRight, Heart } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";\n`;
fs.writeFileSync('src/components/layout/Footer.tsx', footerImports + fixedFooter);


// 4. APP.TSX
const newAppCode = `
import { useState } from "react";
import { Phone, Ticket, MessageSquare, X } from "lucide-react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Hero from "./components/sections/Hero";
import DusunPage from "./components/sections/DusunPage";
import TourPackages from "./components/sections/TourPackages";
import UMKMSection from "./components/sections/UMKMSection";
import KebudayaanSection from "./components/sections/KebudayaanSection";
import { PACKAGES, DusunData } from "./data/mockData";

export const LogoGardu = "https://ui-avatars.com/api/?name=DG&background=16a34a&color=fff";

${appParts[0]}
      <Footer />
    </div>
  );
}
`;
fs.writeFileSync('src/App.tsx', newAppCode.trim());
console.log("Refactoring complete");
