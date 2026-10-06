// Whole-word matching avoids blocking ordinary words such as class or assignment.
const defaults = ['idiot','stupid','fuck','fucking','fucker','motherfucker','shit','bullshit','bitch','bastard','asshole','cunt','dick','pussy','nigger','nigga','faggot','كس','كسم','كسامك','كسمك','كسام','شرموط','شرموطة','عرص','خول','متناك','زب','زبي','قحبة','احا','خرا','خرا','زاني','kosomak','kosom','kossom','kosmak','kosamak','kosomk','ksmk','a7a','a7aa','khara','5ara','5awal','khawal','sharmout','sharmouta','4armouta','3ars','3رص','metnak','metnaak','zeb','zeby'];
export function normalizeText(value:string){return value.normalize('NFKC').toLowerCase().replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u206F\u064B-\u065F\u0670\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/(.)\1{2,}/gu,'$1$1')}
export function prohibited(text:string,extra:string[]=[],exceptions:string[]=[]){
 const normal=normalizeText(text);if(/\b(f[\W_]*[u*][\W_]*[c*][\W_]*k(?:ing|er|you)?|sh[!i1*]t)\b/i.test(normal))return true;const words=normal.match(/[\p{L}\p{N}@$]+/gu)||[];
 const compact=(s:string)=>normalizeText(s).replace(/(.)\1+/gu,'$1').replace(/0/g,'o').replace(/[1!]/g,'i').replace(/3/g,'e').replace(/@/g,'a').replace(/\$/g,'s');
 const allowed=new Set(exceptions.map(compact));const blocked=new Set([...defaults,...extra].map(compact).filter(Boolean));
 const bad=(s:string)=>!allowed.has(compact(s))&&blocked.has(compact(s));
 if(words.some(bad))return true;if(words.some(w=>w.startsWith('يا')&&bad(w.slice(2))))return true;
 for(let width=2;width<=4;width++)for(let i=0;i<=words.length-width;i++)if(bad(words.slice(i,i+width).join(' ')))return true;
 // Catch deliberately separated letters, including f.u.c.k and Arabic equivalents.
 const runs=normal.match(/(?:[\p{L}\p{N}][\s._*\-]+){2,}[\p{L}\p{N}]/gu)||[];
 return runs.some(run=>bad(run.replace(/[\s._*\-]/g,'')));
}
