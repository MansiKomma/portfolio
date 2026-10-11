import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import catalog from '../src/data/drive-catalog.json';
const browser=await chromium.launch({...(process.env.PLAYWRIGHT_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH}:{}),headless:true});
const page=await browser.newPage();await page.addInitScript('window.__name = (fn) => fn');await page.goto('http://127.0.0.1:5173/');
const results:Record<string,{width:number;height:number;error?:string}>={};
for(let n=0;n<catalog.length;n+=8){const batch=catalog.slice(n,n+8);const dims=await page.evaluate(async batch=>Promise.all(batch.map(file=>new Promise<{id:string;width:number;height:number;error?:string}>(resolve=>{const i=new Image();let done=false;const finish=(error?:string)=>{if(done)return;done=true;resolve({id:file.id,width:i.naturalWidth,height:i.naturalHeight,...(error?{error}:{})});};i.onload=()=>finish();i.onerror=()=>finish('Thumbnail did not load');setTimeout(()=>finish('Thumbnail timeout'),15000);i.src=`https://lh3.googleusercontent.com/d/${file.id}=w960`;}))),batch);for(const d of dims){results[d.id]={width:d.width,height:d.height,...(d.error?{error:d.error}:{})};console.log(d.id,d.width,d.height,d.error||'OK');}}
await fs.writeFile('src/data/thumbnail-metadata.json',JSON.stringify(results,null,2));
await page.screenshot({path:'../../outputs/initial-preview.png',fullPage:false});
const hero=catalog.find(f=>f.name==='Clayco.mp4')!;
await page.goto(`https://drive.google.com/file/d/${hero.id}/preview`);await page.waitForTimeout(3000);console.log('Embed page:',(await page.locator('body').innerText()).slice(0,800));await page.screenshot({path:'../../outputs/embed-preview.png'});
await browser.close();
