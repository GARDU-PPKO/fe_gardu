import fs from 'fs';
import path from 'path';

// 1. Clean up unused libraries from package.json
const pkgPath = 'package.json';
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
const depsToRemove = [
  "@radix-ui/react-accordion", "@radix-ui/react-alert-dialog", "@radix-ui/react-aspect-ratio", 
  "@radix-ui/react-avatar", "@radix-ui/react-checkbox", "@radix-ui/react-collapsible", 
  "@radix-ui/react-context-menu", "@radix-ui/react-dropdown-menu", "@radix-ui/react-hover-card", 
  "@radix-ui/react-label", "@radix-ui/react-menubar", "@radix-ui/react-navigation-menu", 
  "@radix-ui/react-popover", "@radix-ui/react-progress", "@radix-ui/react-radio-group", 
  "@radix-ui/react-scroll-area", "@radix-ui/react-select", "@radix-ui/react-separator", 
  "@radix-ui/react-slider", "@radix-ui/react-switch", "@radix-ui/react-tabs", 
  "@radix-ui/react-toggle", "@radix-ui/react-toggle-group", "@radix-ui/react-tooltip",
  "class-variance-authority", "clsx", "cmdk", "date-fns", "embla-carousel-react", 
  "input-otp", "next-themes", "react-day-picker", "react-hook-form", "react-resizable-panels", 
  "sonner", "tailwind-merge", "vaul"
];

depsToRemove.forEach(dep => {
  delete pkg.dependencies[dep];
});

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
console.log("Cleaned package.json");

// 2. Delete src/components/ui
const uiPath = path.join('src', 'components', 'ui');
if (fs.existsSync(uiPath)) {
  fs.rmSync(uiPath, { recursive: true, force: true });
  console.log("Deleted src/components/ui");
}

// 3. Fix unused imports in components
const componentsDir = 'src/components';
const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else if (dirFile.endsWith('.tsx')) {
      filelist.push(dirFile);
    }
  });
  return filelist;
};

const allLucideIcons = [
  "Menu", "X", "ArrowRight", "MapPin", "Phone", "Mail",
  "Users", "Home", "Briefcase", "Mountain", "Star",
  "MessageSquare", "Info", "Camera",
  "ChevronLeft", "ChevronRight", "CheckCircle",
  "Clock", "Ticket", "Leaf",
  "Eye", "Waves", "TreePine", "Heart"
];

const files = walkSync(componentsDir);
files.push('src/App.tsx'); // Also check App.tsx

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  
  // Find which icons are actually used in the file
  const usedIcons = allLucideIcons.filter(icon => {
    // Check for <Icon or { icon: Icon } or Icon />
    const regex = new RegExp(`(<${icon}[\\s>])|(\\bicon:\\s*${icon}\\b)|([^\\w]${icon}[^\\w])`, 'g');
    const matches = content.match(regex) || [];
    // Filter out the import statement itself
    const actualUsage = matches.filter(m => !m.includes(`import {`) && !m.includes(`} from "lucide-react"`));
    // Another simple heuristic: if it appears more than once, it's used.
    const count = (content.match(new RegExp(`\\b${icon}\\b`, 'g')) || []).length;
    return count > 1; // 1 is the import itself
  });

  // Replace the massive lucide-react import block with just the used icons
  const importRegex = /import\s+\{[\s\S]*?\}\s+from\s+"lucide-react";/;
  if (usedIcons.length > 0) {
    content = content.replace(importRegex, `import { ${usedIcons.join(', ')} } from "lucide-react";`);
  } else {
    content = content.replace(importRegex, '');
  }
  
  // Also remove unused `useState`, `useEffect`, `useRef`, `scrollTo` if not used
  const checkUsed = (word) => {
    const count = (content.match(new RegExp(`\\b${word}\\b`, 'g')) || []).length;
    return count > 1;
  };
  
  if (!checkUsed('useState')) content = content.replace(/useState,?\s*/g, '');
  if (!checkUsed('useEffect')) content = content.replace(/useEffect,?\s*/g, '');
  if (!checkUsed('useRef')) content = content.replace(/useRef,?\s*/g, '');
  // Clean up empty React imports
  content = content.replace(/import\s*{\s*}\s*from\s*"react";\n/g, '');
  
  if (!checkUsed('scrollTo')) {
    content = content.replace(/const scrollTo = [\s\S]*?};\n/, '');
  }

  fs.writeFileSync(file, content);
});

console.log("Cleaned unused imports");
