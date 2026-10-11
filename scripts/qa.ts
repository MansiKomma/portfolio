import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const browser=await chromium.launch({...(process.env.PLAYWRIGHT_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH}:{}),headless:true});
await fs.mkdir('qa',{recursive:true});
const results:unknown[]=[];
for(const width of [390,1024,1440]){
 const context=await browser.newContext({viewport:{width,height:900},isMobile:width===390,hasTouch:width===390});const page=await context.newPage();const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(`window.__name=(fn)=>fn; window.qaShifts=[];window.qaTasks=[];new PerformanceObserver(list=>{for(const e of list.getEntries()){if(!e.hadRecentInput)window.qaShifts.push(e.value);}}).observe({type:'layout-shift',buffered:true});new PerformanceObserver(list=>{for(const e of list.getEntries())window.qaTasks.push(e.duration);}).observe({type:'longtask',buffered:true});`);
 await page.goto(process.env.QA_URL||'http://127.0.0.1:5173/',{waitUntil:'networkidle'});await page.waitForTimeout(1800);
 await page.screenshot({path:`qa/hero-${width}.png`});
 // Walk the actual scroll path to reveal once-only content and load lazy images.
 const height=await page.evaluate(()=>document.documentElement.scrollHeight);
 for(let y=0;y<height;y+=700){await page.evaluate(y=>window.scrollTo(0,y),y);await page.waitForTimeout(90);}
 await page.waitForTimeout(900);await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(900);
 const initial=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.alt),cls:(window as unknown as {qaShifts:number[]}).qaShifts.reduce((a,b)=>a+b,0),longTasks:(window as unknown as {qaTasks:number[]}).qaTasks.filter(n=>n>50),cards:document.querySelectorAll('.archive-card').length}));
 await page.screenshot({path:`qa/full-${width}.png`,fullPage:true});
 await page.locator('.project').nth(1).scrollIntoViewIfNeeded();await page.waitForTimeout(900);await page.screenshot({path:`qa/work-${width}.png`});
 await page.locator('[data-filter="AI"]').click();await page.waitForTimeout(800);const filtered=await page.locator('.archive-card:not([hidden])').count();if(filtered!==8)throw new Error(`AI filter returned ${filtered}`);
 await page.locator('.archive-card:not([hidden]) [data-work]').first().click();await page.waitForTimeout(600);
 if(await page.locator('[data-drive-player]').count()!==1)throw new Error('Drive player missing');
 await page.screenshot({path:`qa/lightbox-${width}.png`});
 const iframe=page.frameLocator('[data-drive-player]');let playerVerified=false;try{await iframe.getByRole('button',{name:/^Play/}).first().waitFor({timeout:15000});playerVerified=true;}catch{}
 await page.screenshot({path:`qa/lightbox-${width}.png`});
 const caption=await page.locator('.lightbox-caption').innerText();await page.keyboard.press('ArrowRight');await page.waitForTimeout(500);if(await page.locator('.lightbox-caption').innerText()===caption)throw new Error('Arrow navigation failed');await page.keyboard.press('Escape');await page.waitForTimeout(500);if(await page.locator('[data-drive-player]').count())throw new Error('Iframe persisted after close');
 await page.locator('[data-filter="All"]').click();await page.waitForTimeout(800);if(await page.locator('.archive-card:not([hidden])').count()!==44)throw new Error('Archive restoration failed');
 if(width===390){await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(700);await page.locator('.menu-toggle').click();await page.locator('#mobile-menu').waitFor({state:'visible'});await page.keyboard.press('Escape');await page.locator('#mobile-menu').waitFor({state:'hidden'});}
 results.push({width,...initial,filtered,playerVerified,errors});await context.close();
}
const context=await browser.newContext({viewport:{width:390,height:900},reducedMotion:'reduce'});const page=await context.newPage();await page.addInitScript('window.__name=(fn)=>fn');await page.goto(process.env.QA_URL||'http://127.0.0.1:5173/');await page.waitForTimeout(1000);results.push({reducedMotion:true,pinSpacers:await page.locator('.pin-spacer').count(),loader:await page.locator('.loader').count(),horizontalOverflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});await page.screenshot({path:'qa/reduced-mobile.png'});await context.close();await browser.close();await fs.writeFile('qa/results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
