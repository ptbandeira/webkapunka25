const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const revFile = path.join(repoRoot, 'client', 'public', 'content', '.rev');

function main(){
  const stamp = new Date().toISOString();
  fs.mkdirSync(path.dirname(revFile), { recursive: true });
  fs.writeFileSync(revFile, `${stamp}\n`);
  console.log('[write-content-rev] Wrote', path.relative(repoRoot, revFile), stamp);
}

try {
  main();
}catch(err){
  console.error('[write-content-rev] Failed:', err && err.message ? err.message : err);
  process.exitCode = 1;
}
