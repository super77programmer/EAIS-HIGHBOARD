import {createRemoteJWKSet,jwtVerify} from 'jose';
import {db} from '@/lib/db';
import {DOMAIN,json,clean,config,random,cookie,setCookie,newSession,hash,limit,RateLimitError} from '@/lib/communications';
export const dynamic='force-dynamic';
const keys=createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));
async function revoke(r:Request,key:string){const token=cookie(r,key);if(token)await db().prepare('DELETE FROM comm_sessions WHERE token=?').bind(await hash(token)).run()}
export async function POST(r:Request){try{
 if(r.headers.get('origin')!==new URL(r.url).origin)return json({error:'Request not allowed'},403);
 // Count malformed requests too, before body parsing or public-key verification.
 await limit('auth:'+(r.headers.get('cf-connecting-ip')||'local'),20);
 const raw=await r.text();if(raw.length>14000)return json({error:'Request too large'},413);
 const b=JSON.parse(raw);const d=db();
 if(b.action==='begin'){
  const nonce=random(),now=Date.now();await d.prepare('DELETE FROM auth_challenges WHERE expires<=?').bind(now).run();
  const previous=cookie(r,'hb_google_nonce');if(previous)await d.prepare('DELETE FROM auth_challenges WHERE nonce=?').bind(await hash(previous)).run();
  await d.prepare('INSERT INTO auth_challenges(nonce,expires) VALUES(?,?)').bind(await hash(nonce),now+600000).run();
  return json({nonce},200,{'Set-Cookie':setCookie('hb_google_nonce',nonce,600)});
 }
 if(b.action==='logout'){
  await revoke(r,'hb_identity');const nonce=cookie(r,'hb_google_nonce');if(nonce)await d.prepare('DELETE FROM auth_challenges WHERE nonce=?').bind(await hash(nonce)).run();
  const response=json({ok:true});for(const key of ['hb_identity','hb_admin','hb_google_nonce'])response.headers.append('Set-Cookie',setCookie(key,'',0));
  if(b.forgetGuest){await revoke(r,'hb_guest');response.headers.append('Set-Cookie',setCookie('hb_guest','',0))}return response;
 }
 const cfg=await config();if(!cfg.googleClientId)return json({error:'The school needs to connect Google sign-in first.'},503);
 const {payload:p}=await jwtVerify(clean(b.credential,12000),keys,{audience:cfg.googleClientId,issuer:['https://accounts.google.com','accounts.google.com'],algorithms:['RS256'],maxTokenAge:'10m',requiredClaims:['exp','iat','sub','email','nonce']});
 if(typeof p.nonce!=='string'||! /^[a-f0-9]{64}$/.test(p.nonce)||p.nonce!==cookie(r,'hb_google_nonce')||p.email_verified!==true||p.hd!==DOMAIN||typeof p.email!=='string'||!p.email.toLowerCase().endsWith('@'+DOMAIN)||typeof p.sub!=='string'||!p.sub||p.sub.length>255)return json({error:'Use your verified school Google account.'},403);
 // Atomic consumption makes the challenge single-use, including concurrent requests.
 const used=await d.prepare('DELETE FROM auth_challenges WHERE nonce=? AND expires>?').bind(await hash(p.nonce),Date.now()).run();
 if(used.meta.changes!==1)return json({error:'This sign-in expired or was already used. Start Google sign-in again.'},403);
 const email=p.email.toLowerCase();
 const person=await d.prepare('SELECT active,role FROM comm_people WHERE email=?').bind(email).first<{active:number;role:string}>();
 if(person&&!person.active)return json({error:'This account is disabled. Contact the school.'},403);
 // Bind roster email to Google's stable account identifier; recycled addresses cannot inherit access.
 await d.prepare('INSERT OR IGNORE INTO google_accounts(subject,email) VALUES(?,?)').bind(p.sub,email).run();
 const linked=await d.prepare('SELECT subject FROM google_accounts WHERE email=?').bind(email).first<{subject:string}>();
 if(linked?.subject!==p.sub)return json({error:'Your school account has changed. Contact the school to update your account.'},403);
 const name=clean(typeof p.name==='string'?p.name:b.name,80);
 await d.prepare("INSERT OR IGNORE INTO comm_people(email,name,role,class_name,classes,active) VALUES(?,?,'student','','[]',1)").bind(email,name).run();
 if(person?.role==='administrator')await d.prepare("INSERT INTO comm_config(key,value) VALUES('bootstrapClosed','1') ON CONFLICT(key) DO UPDATE SET value='1'").run();
 await revoke(r,'hb_identity');const token=await newSession(email,1);const response=json({ok:true});
 response.headers.append('Set-Cookie',setCookie('hb_identity',token,86400));for(const key of ['hb_google_nonce','hb_admin'])response.headers.append('Set-Cookie',setCookie(key,'',0));return response;
 }catch(e){if(e instanceof RateLimitError)return json({error:e.message},429,{'Retry-After':'60'});console.error('School sign-in failed',e instanceof Error?e.message:'error');return json({error:'Could not verify school sign-in. Please start again with your school account.'},400)}
}
