import {unzipSync,strFromU8} from 'fflate';
// Structural checks reduce disguised/active file uploads; they are not antivirus scanning.
export function validateFile(bytes:Uint8Array,name:string,type:string){const s=(a:number,b:number)=>String.fromCharCode(...bytes.slice(a,b));const ext=name.toLowerCase().split('.').pop();
 if(['docx','xlsx','pptx'].includes(ext||'')){
  if(s(0,4)!=='PK\u0003\u0004')throw Error('This Office file is damaged or not a supported document.');
  let total=0,entries=0;const archive=unzipSync(bytes,{filter:f=>{entries++;total+=f.originalSize;if(entries>2000||total>60*1024*1024||f.originalSize>20*1024*1024)throw Error('This document expands beyond the safe size limit.');if(/(^\/|\.\.|\\\\)/.test(f.name)||/vbaproject|activex|embeddings|\.exe$|\.js$/i.test(f.name))throw Error('Documents with macros or embedded programs are not allowed.');return /\.xml$|\.rels$/i.test(f.name)}});
  const main=ext==='docx'?'word/document.xml':ext==='xlsx'?'xl/workbook.xml':'ppt/presentation.xml';if(!archive['[Content_Types].xml']||!archive[main])throw Error('The document contents do not match its file type.');
  for(const [n,v] of Object.entries(archive)){const xml=strFromU8(v);if(/<!DOCTYPE|<!ENTITY/i.test(xml)||/\.rels$/i.test(n)&&/TargetMode\s*=\s*["']External["']/i.test(xml))throw Error('Remove external document links or embedded content before uploading.');}
  return ({docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',xlsx:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',pptx:'application/vnd.openxmlformats-officedocument.presentationml.presentation'} as any)[ext!];
 }
 if(ext==='pdf'){if(s(0,5)!=='%PDF-'||!s(Math.max(0,bytes.length-2048),bytes.length).includes('%%EOF'))throw Error('This PDF is damaged.');const text=new TextDecoder('latin1').decode(bytes);if(/\/(JavaScript|JS|Launch|EmbeddedFile|RichMedia|OpenAction|AA)\b/.test(text))throw Error('Use a flattened PDF without scripts or embedded files.');return 'application/pdf'}
 if(['jpg','jpeg'].includes(ext||'')&&bytes.length>100&&bytes[0]===255&&bytes[1]===216&&bytes.at(-2)===255&&bytes.at(-1)===217)return 'image/jpeg';
 if(ext==='png'&&bytes.length>44&&[137,80,78,71,13,10,26,10].every((n,i)=>bytes[i]===n)&&s(12,16)==='IHDR'&&s(bytes.length-8,bytes.length-4)==='IEND')return 'image/png';
 if(ext==='gif'&&/^GIF8[79]a$/.test(s(0,6))&&bytes.length>20&&bytes.at(-1)===59)return 'image/gif';
 if(ext==='webp'&&bytes.length>20&&s(0,4)==='RIFF'&&s(8,12)==='WEBP')return 'image/webp';
 if(['mp4','m4a','mov'].includes(ext||'')&&bytes.length>32&&s(4,8)==='ftyp')return ext==='m4a'||type.startsWith('audio/')?'audio/mp4':'video/mp4';
 if(ext==='webm'&&bytes.length>32&&bytes[0]===26&&bytes[1]===69&&bytes[2]===223&&bytes[3]===163)return type.startsWith('audio/')?'audio/webm':'video/webm';
 if(['ogg','oga'].includes(ext||'')&&bytes.length>32&&s(0,4)==='OggS')return 'audio/ogg';
 if(ext==='wav'&&bytes.length>44&&s(0,4)==='RIFF'&&s(8,12)==='WAVE')return 'audio/wav';
 if(ext==='mp3'&&bytes.length>32&&(s(0,3)==='ID3'||bytes[0]===255&&(bytes[1]&224)===224))return 'audio/mpeg';
 throw Error('The file contents do not match a supported format. Use images, MP4/WebM, audio, a flattened PDF or a standard Office document.');
}
