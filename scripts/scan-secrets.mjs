import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
const ignoredDirs = new Set(['.git', 'node_modules', '.next', 'dist', 'build']);
const secretPatterns = [/SUPABASE_SERVICE_ROLE_KEY[ \t]*=[ \t]*[^\s#]+/, /eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/, /sk-[A-Za-z0-9_-]{16,}/, /xai-[A-Za-z0-9_-]{16,}/, /msk_[A-Za-z0-9_-]{16,}/, /msy_[A-Za-z0-9_-]{16,}/];
const findings = [];
function walk(dir) { for (const entry of readdirSync(dir)) { if (ignoredDirs.has(entry)) continue; const path = join(dir, entry); const st = statSync(path); if (st.isDirectory()) walk(path); else if (st.isFile() && st.size < 2_000_000) { const text = readFileSync(path, 'utf8'); for (const pattern of secretPatterns) if (pattern.test(text)) findings.push(path); } } }
walk('.');
if (findings.length) { console.error('Potential secrets found:'); [...new Set(findings)].forEach((f) => console.error(`- ${f}`)); process.exit(1); }
console.log('Secret scan passed: no known live secret patterns found.');
