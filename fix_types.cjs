const fs = require('fs');

const fixHook = (file, hook) => {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(/=\s*\((false|true|"Semua"|0)\)/g, '= useState($1)');
  content = content.replace(/=\s*(?:<[^>]+>\s*)?\(\s*null\s*\)/g, match => {
    return '= useState' + match.replace(/^=/, '').trim();
  });
  if (content.includes('useState') && !content.includes('useState} from') && !content.includes('useState,') && !content.includes('useState } from')) {
    content = 'import { useState } from "react";\n' + content;
  }
  if (content.includes('useEffect') && !content.includes('useEffect} from') && !content.includes('useEffect,') && !content.includes('useEffect } from')) {
    content = content.replace(/import { useState } from "react";/, 'import { useState, useEffect } from "react";');
  }
  fs.writeFileSync(file, content);
};

['src/App.tsx', 'src/components/layout/Navbar.tsx', 'src/components/sections/DusunPage.tsx', 'src/components/sections/UMKMSection.tsx', 'src/components/sections/Hero.tsx'].forEach(f => fixHook(f));

let app = fs.readFileSync('src/App.tsx', 'utf-8');
app = app.replace('import { PACKAGES, DusunData }', 'import { PACKAGES } from "./data/mockData";\nimport type { DusunData }');
fs.writeFileSync('src/App.tsx', app);

let navbar = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf-8');
if (!navbar.includes('LogoGardu')) {
  navbar = 'import { LogoGardu } from "../../App";\n' + navbar;
}
fs.writeFileSync('src/components/layout/Navbar.tsx', navbar);

let dusun = fs.readFileSync('src/components/sections/DusunPage.tsx', 'utf-8');
dusun = dusun.replace('import { DusunData }', 'import type { DusunData }');
dusun = dusun.replace('Info, ', ''); // remove unused
fs.writeFileSync('src/components/sections/DusunPage.tsx', dusun);

let hero = fs.readFileSync('src/components/sections/Hero.tsx', 'utf-8');
hero = hero.replace('import { LogoGardu } from "../../App";', '');
fs.writeFileSync('src/components/sections/Hero.tsx', hero);

console.log('Fixed types');
