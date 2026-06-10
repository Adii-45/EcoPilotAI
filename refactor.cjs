const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    filelist = fs.statSync(path.join(dir, file)).isDirectory()
      ? walkSync(path.join(dir, file), filelist)
      : filelist.concat(path.join(dir, file));
  });
  return filelist;
};

const files = walkSync('src').filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  content = content.replace(/\bbg-white\/70\b/g, 'bg-surface/70');
  content = content.replace(/\bbg-white\/50\b/g, 'bg-surface/50');
  content = content.replace(/\bbg-white\/40\b/g, 'bg-surface/40');
  content = content.replace(/\bbg-white\b/g, 'bg-surface-container-lowest');
  
  content = content.replace(/\bborder-slate-100\b/g, 'border-outline-variant');
  content = content.replace(/\bborder-slate-200\b/g, 'border-outline-variant');
  content = content.replace(/\bborder-white\b/g, 'border-surface-container-highest');
  
  content = content.replace(/\btext-slate-900\b/g, 'text-on-surface');
  content = content.replace(/\btext-slate-700\b/g, 'text-on-surface-variant');
  content = content.replace(/\btext-slate-400\b/g, 'text-on-surface-variant');
  
  content = content.replace(/\bhover:bg-slate-50\b/g, 'hover:bg-surface-container-low');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});
