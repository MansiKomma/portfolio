import fs from 'node:fs/promises';import { site } from '../src/data/site';import works from '../src/data/works.json';
const origin=(process.env.SITE_ORIGIN || site.origin).replace(/\/+$/, '');
const graph={'@context':'https://schema.org','@graph':[{'@type':'Person',name:site.name,jobTitle:site.role,url:origin,knowsAbout:[...site.aiTools,...site.tools]},...works.map(w=>({'@type':w.type==='video'?'VideoObject':'CreativeWork',name:w.title,thumbnailUrl:w.cover,...(w.type==='video'?{embedUrl:w.embed}:{}),creator:{'@type':'Person',name:site.name}}))]};
const escape=(value:string)=>value.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]!));
let html=await fs.readFile('index.html','utf8');
html=html.replace(/<title>[\s\S]*?<\/title>/,`<title>${escape(site.name)} | ${escape(site.role)}</title>`).replace(/<meta name="description"[^>]*>/,`<meta name="description" content="${escape(site.bio)}">`).replace(/<meta property="og:title"[^>]*>/,`<meta property="og:title" content="${escape(site.name)} | ${escape(site.role)}">`).replace(/<meta property="og:description"[^>]*>/,`<meta property="og:description" content="${escape(site.bio)}">`).replace(/<meta property="og:image"[^>]*>/,`<meta property="og:image" content="${origin}/og.jpg">`);
html=html.replace(/<script id="structured-data"[\s\S]*?<\/script>/,'').replace(/<link rel="canonical"[^>]*>/,'').replace(/<meta property="og:url"[^>]*>/,'');html=html.replace('</head>',`<link rel="canonical" href="${origin}/"><meta property="og:url" content="${origin}/"><script id="structured-data" type="application/ld+json">${JSON.stringify(graph).replace(/</g,'\\u003c')}</script></head>`);await fs.writeFile('index.html',html);

await fs.writeFile('public/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc></url></urlset>`);
await fs.writeFile('public/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
