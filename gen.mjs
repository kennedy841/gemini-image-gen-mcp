import { GoogleGenAI, Modality } from '@google/genai';
import fs from 'fs';
const cfg=JSON.parse(fs.readFileSync('/Users/naps/.claude.json','utf8'));
let env=null;(function w(o){if(env)return;if(o&&typeof o==='object'){if(o['gemini-image-generation']?.env){env=o['gemini-image-generation'].env;return;}for(const k of Object.keys(o))w(o[k]);}})(cfg);
const client=new GoogleGenAI({apiKey:env.GEMINI_API_KEY});
const prompt='Top-down photograph of an authentic Neapolitan Margherita pizza on a rustic dark wooden board, fresh basil leaves, melted fiordilatte mozzarella, San Marzano tomato sauce, drizzle of olive oil, charred leopard-spotted crust, warm natural restaurant lighting, appetizing professional food photography, high detail, square composition';
const out='/Users/naps/IdeaProjects/agent_isnap_platform/repos/agent-public-site/demo/pizzeria/img/margherita.png';
try{
  const r=await client.models.generateContent({model:'gemini-3.1-flash-image',contents:[{text:prompt}],config:{temperature:1,responseModalities:[Modality.TEXT,Modality.IMAGE]}});
  const parts=r?.candidates?.[0]?.content?.parts||[];
  let saved=false;
  for(const p of parts){
    if(p.inlineData?.data){ fs.writeFileSync(out, Buffer.from(p.inlineData.data,'base64')); console.log('SAVED',out,'mime',p.inlineData.mimeType, fs.statSync(out).size,'bytes'); saved=true; }
    else if(p.text){ console.log('TEXT:',p.text.slice(0,120)); }
  }
  if(!saved) console.log('NO IMAGE in response:',JSON.stringify(r).slice(0,400));
}catch(e){ console.log('ERR',e.status||'', e.message?.slice(0,300)); }
