// Index read-only Drive metadata. No media files are downloaded.
import fs from 'node:fs/promises';
import catalog from '../src/data/drive-catalog.json';
import metadata from '../src/data/thumbnail-metadata.json';
import { site } from '../src/data/site';
const titleCase=(s:string)=>s.replace(/\.[^.]+$/,'').replace(/[_-]+/g,' ').replace(/\s+/g,' ').trim().replace(/\b\w/g,c=>c.toUpperCase());
const works=catalog.map(file=>({
 id:file.id,title:titleCase(file.name),category:file.category,
 type:/\.(mp4|mov|webm|m4v)$/i.test(file.name)?'video':/\.(png|jpe?g|webp|avif|gif)$/i.test(file.name)?'image':/\.pdf$/i.test(file.name)?'pdf':'other',
 files:[`https://drive.google.com/file/d/${file.id}/view`],source:`${file.category}/${file.name}`,
 width:(metadata as Record<string,{width:number;height:number}>)[file.id]?.width||0,height:(metadata as Record<string,{width:number;height:number}>)[file.id]?.height||0,
 aspect:((metadata as Record<string,{width:number;height:number}>)[file.id]?.width||1)/((metadata as Record<string,{width:number;height:number}>)[file.id]?.height||1),
 orientation:((metadata as Record<string,{width:number;height:number}>)[file.id]?.width||1)/((metadata as Record<string,{width:number;height:number}>)[file.id]?.height||1)<.85?'vertical':((metadata as Record<string,{width:number;height:number}>)[file.id]?.width||1)/((metadata as Record<string,{width:number;height:number}>)[file.id]?.height||1)>1.2?'horizontal':'square',year:null,yearSource:'Unknown: no project date supplied',
 cover:`https://lh3.googleusercontent.com/d/${file.id}=w1200`,placeholder:'',
 variants:[320,480,960,1600,2400].map(width=>({width,jpg:`https://lh3.googleusercontent.com/d/${file.id}=w${width}`,webp:`https://lh3.googleusercontent.com/d/${file.id}=w${width}-rw`})),
 duration:0,preview:'',video:'',webm:'',embed:`https://drive.google.com/file/d/${file.id}/preview`,
 description:'',client:'',date:'', // TODO: add verified metadata
}));
await fs.writeFile('src/data/works.json',JSON.stringify(works,null,2)+'\n');
const summary=Object.fromEntries([...new Set(works.map(w=>w.category))].map(category=>[category,{count:works.filter(w=>w.category===category).length,types:works.filter(w=>w.category===category).reduce((a,w)=>(a[w.type]=(a[w.type]||0)+1,a),{} as Record<string,number>)}]));
await fs.writeFile('processing-report.json',JSON.stringify({mode:'Drive embeds, per user instruction',total:works.length,summary,failures:[],googleNativeFiles:[],notes:['44 entries in complete recursive listing. No folder level reached 50 files.','Earlier partial download stopped and ignored. No media downloaded during sync or build.','Dimensions resolved from thumbnails. Dates and descriptions are not inferred.','No portrait or CV identified.','Google Drive controls playback, streaming and embedding availability.']},null,2));
await fs.writeFile('public/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${site.origin}/</loc></url></urlset>`);
await fs.writeFile('public/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${site.origin}/sitemap.xml\n`);
console.table(summary);console.log(`${works.length} entries indexed; no media downloads.`);
