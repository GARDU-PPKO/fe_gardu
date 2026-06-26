import fs from 'fs';

let dusun = fs.readFileSync('src/components/sections/DusunSlider.tsx', 'utf-8');
dusun = dusun.replace(
  '    setCanPrev(el.scrollLeft > 8);\r\n    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);',
  `export default function DusunSlider({ onSelect }: { onSelect: (d: typeof DUSUN[0]) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const CARD_W = 252;

  const updateState = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    setActiveIdx(Math.min(Math.round(el.scrollLeft / CARD_W), DUSUN.length - 1));
  };`
);
dusun = dusun.replace('const trackRef = <HTMLDivElement>(null);', 'const trackRef = useRef<HTMLDivElement>(null);');

if (!dusun.includes('import { useState, useRef } from "react";')) {
  dusun = 'import { useState, useRef } from "react";\n' + dusun;
}
fs.writeFileSync('src/components/sections/DusunSlider.tsx', dusun);

let kebudayaan = fs.readFileSync('src/components/sections/KebudayaanSection.tsx', 'utf-8');
kebudayaan = kebudayaan.replace(
  /const \[lb, setLb\] = <{ img: string; judul: string; desc: string; cat: string } \| null>\(null\);/,
  'const [lb, setLb] = useState<{ img: string; judul: string; desc: string; cat: string } | null>(null);'
);
if (!kebudayaan.includes('import { useState } from "react";')) {
  kebudayaan = 'import { useState } from "react";\n' + kebudayaan;
}
fs.writeFileSync('src/components/sections/KebudayaanSection.tsx', kebudayaan);
console.log('Fixed hooks syntax');
