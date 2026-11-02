import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const base = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const flag = name => argv.includes(name);
const value = (name, fallback) => { const i=argv.indexOf(name); return i>=0 ? argv[i+1] : fallback; };
const number = Number(value('--letter','1'));
const dryRun = flag('--dry-run');
if (!Number.isInteger(number) || number < 1 || number > 28) throw new Error('Letter must be an integer from 1 to 28.');
const letters = JSON.parse(await fs.readFile(path.join(base,'data/letters.json'),'utf8'));
const letter = letters.find(x=>x.number===number);
if (!letter) throw new Error('This letter has not yet been verified against the published companion page. Add a verified record to data/letters.json first.');
const bible = await fs.readFile(path.join(base,'SERIES_BIBLE.md'),'utf8');
const template = await fs.readFile(path.join(base,'prompts/episode-generator.md'),'utf8');
const prompt = [template,'\n## Approved series bible\n',bible,'\n## Verified letter input (JSON)\n',JSON.stringify(letter,null,2),'\nFORMAT: 9:16\nDURATION_SECONDS: 90\nAPPROVED_CHARACTERS: Asad, Jamal\nSTORY_PROBLEM: a missing golden letter star\nRespond with structured Markdown. Mark any unverified workbook detail NEEDS VERIFICATION.'].join('\n');
const outputDir=path.join(base,'output');
await fs.mkdir(outputDir,{recursive:true});
const slug=String(number).padStart(2,'0');
if(dryRun) {
  const filename=path.join(outputDir,slug+'-prompt-preview.md');
  await fs.writeFile(filename,prompt,'utf8');
  console.log('DRY RUN: wrote '+filename+'; no API request or charge.');
  process.exit(0);
}
if(!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY is missing. Set it in your local environment; never commit it.');
const maxTokens=Number(process.env.MAX_OUTPUT_TOKENS||3500);
if(!Number.isInteger(maxTokens)||maxTokens<256||maxTokens>8000) throw new Error('MAX_OUTPUT_TOKENS must be 256–8000.');
const { default: Anthropic }=await import('@anthropic-ai/sdk');
const client=new Anthropic({apiKey:process.env.ANTHROPIC_API_KEY,maxRetries:0});
// Discover available models with the account's own API key (no billable generation).
const available = [];
for await (const item of client.models.list({limit:100})) available.push(item.id);
const preferred = process.env.CLAUDE_MODEL?.trim();
const isSonnet = id => /claude-sonnet-/i.test(id);
const sonnets = available.filter(isSonnet).sort((a,b)=>b.localeCompare(a,undefined,{numeric:true}));
const model = preferred && available.includes(preferred) ? preferred : sonnets[0];
if (!model) throw new Error('No suitable Sonnet model is available to this account. Available model IDs: '+available.join(', '));
if (preferred && preferred!==model) console.log('Configured model unavailable; using available Sonnet model '+model);
console.log('Calling Claude API once for letter '+number+' using '+model+'. This is a billable request.');
const response=await client.messages.create({model,max_tokens:maxTokens,messages:[{role:'user',content:prompt}]});
const text=response.content.filter(block=>block.type==='text').map(block=>block.text).join('\n');
const filename=path.join(outputDir,slug+'-episode-draft.md');
await fs.writeFile(filename,text,'utf8');
console.log(JSON.stringify({file:filename,model:response.model,usage:response.usage,stop_reason:response.stop_reason},null,2));
