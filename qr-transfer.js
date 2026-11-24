/* BunpoPanda progress transfer v24. No network requests; QR codes contain a compressed snapshot. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const HISTORY='jlpt-grammar-blitz-history-v1', SUMMARY='bunpopanda-quiz-summary-v20';
const PROFILE_NAME='bunpopanda-profile-name',PROFILE_PHOTO='bunpopanda-profile-photo';
const QR_PREFIX='BP24';
const LAST_IMPORTED='bunpopanda-last-imported-qr-v30';
const qrState={pages:[],page:0,seen:new Map(),currentSession:'',fullPayload:'',camera:null,scanTimer:0,scanning:false};
const textEncoder=new TextEncoder(),textDecoder=new TextDecoder();
function b64(bytes){let s='';for(let i=0;i<bytes.length;i+=8192)s+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function unb64(s){s=s.replace(/-/g,'+').replace(/_/g,'/');s+='='.repeat((4-s.length%4)%4);return Uint8Array.from(atob(s),c=>c.charCodeAt(0))}
function digest(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(36)}
async function gzip(bytes){if(!('CompressionStream'in window))return {method:'j',bytes};try{const stream=new Blob([bytes]).stream().pipeThrough(new CompressionStream('gzip'));return{method:'g',bytes:new Uint8Array(await new Response(stream).arrayBuffer())}}catch{return {method:'j',bytes}}}
async function ungzip(bytes,method){if(method==='j')return bytes;if(!('DecompressionStream'in window))throw Error('This browser cannot read compressed transfers. Use the latest Chrome or Safari, or import a JSON backup.');const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));return new Uint8Array(await new Response(stream).arrayBuffer())}
async function smallProfilePhoto(src,size=96,quality=.78){if(!src||!src.startsWith('data:image/'))return null;try{const im=new Image();await new Promise((ok,bad)=>{im.onload=ok;im.onerror=bad;im.src=src});const c=document.createElement('canvas');c.width=c.height=size;const cx=c.getContext('2d');const crop=Math.min(im.naturalWidth,im.naturalHeight);cx.drawImage(im,(im.naturalWidth-crop)/2,(im.naturalHeight-crop)/2,crop,crop,0,0,size,size);return c.toDataURL('image/jpeg',quality)}catch{return null}}
function getStatistics(){const stats=window.BPStatsAPI;if(!stats)throw Error('Quiz statistics have not loaded');return stats.summarize(stats.getRecords(),stats.getSummary())}
function updateBackupLabel(){const button=$('bpBackupStats');if(!button)return;let recent=[];try{recent=JSON.parse(localStorage.getItem(HISTORY)||'[]')}catch{}const n=Array.isArray(recent)?recent.length:0;const total=window.BPStatsAPI?.getSummary()?.rounds||0;button.disabled=!n;button.textContent=n?'Back Up':total?'Backed up':'Back Up';button.title=n?`${n} new rounds ready to back up`:total?'Your statistics have been backed up. Complete another quiz to back up more.':'No quiz results to back up yet.'}
function note(message){const area=$('bpQRStatus');if(area)area.textContent=message}
function snapStats(){return getStatistics()}
const libraryLevels=()=>[...new Set(data.map(x=>x.level||'N5'))];
function librarySignature(){return digest(data.map(x=>`${x.level||'N5'}:${x.expression}`).join('\n'))}
const levelOrder=['N5','N4','N3','N2','N1'];
function compactStats(s){return [s.rounds,s.correct,s.wrong,s.accuracySum,s.scoredRounds, ...levelOrder.map(l=>[s.levels?.[l]?.sum||0,s.levels?.[l]?.count||0]),Object.entries(s.days||{}).map(([day,v])=>[day,v.sum,v.count])];}
function expandStats(a){if(!Array.isArray(a)||a.length<11)throw Error('Invalid quiz statistics.');const levels={};for(let i=0;i<5;i++)levels[levelOrder[i]]={sum:Number(a[i+5]?.[0]||0),count:Number(a[i+5]?.[1]||0)};return {version:1,rounds:Number(a[0]||0),correct:Number(a[1]||0),wrong:Number(a[2]||0),accuracySum:Number(a[3]||0),scoredRounds:Number(a[4]||0),levels,days:Object.fromEntries((a[10]||[]).map(([date,sum,count])=>[date,{sum,count}]))}}
async function makeSnapshot(photoSize=96){const name=localStorage.getItem(PROFILE_NAME)||'User',photo=await smallProfilePhoto(localStorage.getItem(PROFILE_PHOTO),photoSize);const s=getStatistics();return {t:'BP',v:2,n:name,p:photo,x:data.filter(x=>mastered.has(x.id)).map(x=>[x.level||'N5',x.expression]),s:compactStats(s),l:libraryLevels(),h:librarySignature()}}
function canvasQR(value){if(!window.BPQRCode)throw Error('QR encoder file could not be loaded. Extract the entire ZIP, keeping qr-encoder.js beside index.html.');const qr=new window.BPQRCode(0,window.BPQRLevel.L);qr.addData(value);qr.make();return qr}
async function buildPages(){
 for(const size of [32,24,16,12,8]){const snapshot=await makeSnapshot(size);const packed=await gzip(textEncoder.encode(JSON.stringify(snapshot)));const payload='BP25|'+packed.method+b64(packed.bytes);
 // One QR code maximum. A QR in byte mode cannot hold an arbitrary base64 photo, even at 400px.
 if(payload.length>2900)continue;
 try{canvasQR(payload);return [payload]}catch(e){continue}
 }
 return []; // The full transfer remains available as copyable text even if QR capacity is exceeded.
}
function draw(index){const payload=qrState.pages[index];if(!payload)return;qrState.page=index;const qr=canvasQR(payload),count=qr.getModuleCount(),canvas=$('bpQRCanvas'),ctx=canvas.getContext('2d');const W=1100,H=1240;canvas.width=W;canvas.height=H;ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);ctx.fillStyle='#135d37';ctx.font='900 44px Nunito,Arial,sans-serif';ctx.textAlign='center';ctx.fillText('BunpoPanda',W/2+18,58);ctx.font='600 25px Nunito,Arial,sans-serif';const name=localStorage.getItem(PROFILE_NAME)||'User';ctx.fillText(`${name.slice(0,24)} · Progress transfer`,W/2+18,100);const profile=localStorage.getItem(PROFILE_PHOTO);if(profile&&profile.startsWith('data:image/')){const im=new Image();im.onload=()=>{if(qrState.page!==index)return;ctx.save();ctx.beginPath();ctx.arc(105,66,47,0,Math.PI*2);ctx.clip();ctx.drawImage(im,58,19,94,94);ctx.restore()};im.src=profile;}const quiet=4,side=1000,pixel=side/(count+2*quiet),left=(W-side)/2,top=135;ctx.fillStyle='#fff';ctx.fillRect(left,top,side,side);ctx.fillStyle='#0a1710';for(let y=0;y<count;y++)for(let x=0;x<count;x++)if(qr.isDark(y,x)){ctx.fillRect(Math.floor(left+(x+quiet)*pixel),Math.floor(top+(y+quiet)*pixel),Math.ceil(pixel+.2),Math.ceil(pixel+.2))}ctx.fillStyle='#315c42';ctx.font='700 28px Nunito,Arial,sans-serif';ctx.fillText(`QR ${index+1} of ${qrState.pages.length} · ${data.filter(x=>mastered.has(x.id)).length} mastered`,W/2,1184);$('bpQRPageInfo').textContent='One QR progress transfer';$('bpQRPrev').hidden=true;$('bpQRNext').hidden=true;$('bpQRDetail').textContent='Save this QR and import it on the receiving device.'}
async function transferText(){
 const snapshot=await makeSnapshot(96);
 const packed=await gzip(textEncoder.encode(JSON.stringify(snapshot)));
 return 'BP25|'+packed.method+b64(packed.bytes);
}
async function generate(){
 const button=$('bpGenerateQR');button.disabled=true;button.textContent='Preparing…';
 try{
   // Back up recent rounds before building the transfer, with explicit consent.
   let recent=[];try{recent=JSON.parse(localStorage.getItem(HISTORY)||'[]')}catch{}
   if(Array.isArray(recent)&&recent.length){
      if(!confirm('Back up your '+recent.length+' recent quiz round(s) before generating the QR?\n\nThis preserves lifetime totals and averages but clears individual round history.\n\nCancel keeps your current history and does not generate a transfer.'))return;
      const api=window.BPStatsAPI;
      const compacted=api.summarize(api.getRecords(),api.getSummary());
      localStorage.setItem(SUMMARY,JSON.stringify(compacted));
      localStorage.removeItem(HISTORY);
      quizRecords=[];
      api.renderLifetime();updateBackupLabel();
   }
   // Keep a better-quality profile in transfer text and in the saved PNG metadata.
   // The visible QR uses the largest thumbnail that genuinely fits one QR.
   const raw=await transferText();
   qrState.fullPayload=raw;
   const field=$('bpQRTransferText');field.value=raw;
   qrState.pages=[];
   try{
     for(const size of [96,80,64,56,48,40,32,24,16]){
       const snapshot=await makeSnapshot(size);
       const packed=await gzip(textEncoder.encode(JSON.stringify(snapshot)));
       const candidate='BP25|'+packed.method+b64(packed.bytes);
       if(candidate.length>2900)continue;
       try{canvasQR(candidate);qrState.pages=[candidate];break}catch{}
     }
     if(!qrState.pages.length)throw Error('More data than one QR can hold');
     draw(0);$('bpQRCanvas').hidden=false;$('bpQRSave').disabled=false;
     $('bpQRDetail').textContent='Scan the QR, or save its PNG for a sharper photo transfer.';
   }catch(qrError){
     $('bpQRCanvas').hidden=true;$('bpQRSave').disabled=true;
     $('bpQRPageInfo').textContent='One QR cannot fit all data. Copy the complete high-quality transfer text below.';
     $('bpQRDetail').textContent='Your full progress transfer is ready as text.';
   }
   $('bpQRModal').hidden=false;
 }catch(err){alert('Transfer generation failed: '+err.message)}
 finally{button.disabled=false;button.textContent='Generate QR'}
}
function crc32(bytes){let crc=0xffffffff;for(const v of bytes){crc^=v;for(let k=0;k<8;k++)crc=crc&1?(crc>>>1)^0xedb88320:crc>>>1}return(crc^0xffffffff)>>>0}
function pngChunk(type,content){const name=new TextEncoder().encode(type);const out=new Uint8Array(content.length+12),view=new DataView(out.buffer);view.setUint32(0,content.length);out.set(name,4);out.set(content,8);view.setUint32(out.length-4,crc32(out.subarray(4,out.length-4)));return out}
function u32(bytes,offset){return new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength).getUint32(offset)}
function addPayloadToPNG(bytes,payload){const pngSig=[137,80,78,71,13,10,26,10];if(!pngSig.every((v,i)=>bytes[i]===v))throw Error('Not a valid PNG');const key=new TextEncoder().encode('BunpoPanda');const value=new TextEncoder().encode(payload);const textChunk=pngChunk('tEXt',new Uint8Array([...key,0,...value]));let pos=8;while(pos+12<=bytes.length){let n=u32(bytes,pos),type=new TextDecoder().decode(bytes.subarray(pos+4,pos+8));if(type==='IEND'){const merged=new Uint8Array(bytes.length+textChunk.length);merged.set(bytes.subarray(0,pos));merged.set(textChunk,pos);merged.set(bytes.subarray(pos),pos+textChunk.length);return merged}pos+=12+n}throw Error('PNG is incomplete')}
function embeddedPayload(bytes){if(bytes.length<8||bytes[0]!==137||bytes[1]!==80)return null;let pos=8;while(pos+12<=bytes.length){const n=u32(bytes,pos),end=pos+12+n;if(end>bytes.length)break;const type=new TextDecoder().decode(bytes.subarray(pos+4,pos+8));if(type==='tEXt'){const content=bytes.subarray(pos+8,pos+8+n);const sep=content.indexOf(0);if(sep>0&&new TextDecoder().decode(content.subarray(0,sep))==='BunpoPanda')return new TextDecoder().decode(content.subarray(sep+1))}pos=end;}return null}
async function saveCurrent(){try{const canvas=$('bpQRCanvas');const base64=canvas.toDataURL('image/png').split(',')[1];const original=Uint8Array.from(atob(base64),c=>c.charCodeAt(0));const bytes=addPayloadToPNG(original,qrState.fullPayload||qrState.pages[qrState.page]);const blob=new Blob([bytes],{type:'image/png'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.download='BunpoPanda-Progress-QR.png';a.href=url;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000)}catch(e){alert('Could not save QR image: '+e.message)}}
function closeModal(){ $('bpQRModal').hidden=true }
function validatedSummary(s){if(!s||s.version!==1||!Number.isSafeInteger(s.rounds)||s.rounds<0||s.rounds>1e8||!s.levels||!s.days||typeof s.days!=='object')throw Error('Invalid quiz statistics in transfer.');return s}
function restore(snapshot){
 let stats,keys,name,photo;
 if(snapshot?.t==='BP'&&snapshot.v===2){stats=validatedSummary(expandStats(snapshot.s));keys=new Set((snapshot.x||[]).filter(v=>Array.isArray(v)&&v.length===2).map(v=>v[0]+'|'+v[1]));name=snapshot.n||'User';photo=snapshot.p;}
 else if(snapshot?.type==='bunpopanda-progress'&&snapshot.version===1){stats=validatedSummary(snapshot.stats);keys=new Set(snapshot.mastered.filter(v=>Array.isArray(v)&&v.length===2).map(v=>v[0]+'|'+v[1]));name=snapshot.name||'User';photo=snapshot.photo;}
 else throw Error('Unrecognized BunpoPanda progress QR.');
 const available=libraryLevels(),filteredLevels=Object.fromEntries(Object.entries(stats.levels).filter(([l])=>available.includes(l)));
 // Only levels included in the current grammar.json are restored. Preserve aggregate round totals.
 const valid={...stats,levels:filteredLevels};
 const matched=data.filter(x=>keys.has((x.level||'N5')+'|'+x.expression)).length;const mismatch=snapshot.h&&snapshot.h!==librarySignature();
 if(!confirm(`Restore progress for ${name}?\n\n${matched} mastery entries match this library.\nLevels available: ${available.join(', ')}.${mismatch?'\nNote: source and destination grammar library versions differ. Matching expressions only will be restored.':''}\nQuiz totals and averages will replace existing results; unknown levels will be ignored.\nProfile name and photo will be updated.\n\nContinue?`))return false;
 localStorage.setItem(PROFILE_NAME,String(name).slice(0,60));if(typeof photo==='string'&&/^data:image\/(?:jpeg|png|webp);base64,/.test(photo))localStorage.setItem(PROFILE_PHOTO,photo);else localStorage.removeItem(PROFILE_PHOTO);
 mastered.clear();for(const x of data)if(keys.has((x.level||'N5')+'|'+x.expression))mastered.add(x.id);save();localStorage.setItem(SUMMARY,JSON.stringify(valid));localStorage.removeItem(HISTORY);quizRecords=[];window.BPStatsAPI.renderLifetime();
 // Settings helpers are scoped to a separate script: use its public callbacks.
 window.BPRefreshMasteryStats?.();window.BPRefreshProfile?.();
 if($('profileName'))$('profileName').value=name;render();updateBackupLabel();note(`Restored ${valid.rounds} rounds and ${matched} mastered expressions.`);return true;
}
function showRestoreSuccess(kind='success'){
 const dialog=$('bpRestoreSuccess');if(!dialog)return;
 const duplicate=kind==='duplicate';
 const title=$('bpRestoreSuccessTitle');if(title)title.textContent=duplicate?'This QR was already imported':'Your data has been updated!';
 const details=dialog.querySelector('.bp-restore-dialog p');
 if(details)details.textContent=duplicate?'You have already restored this exact BunpoPanda transfer on this device. Nothing was changed. Try another QR or generate a new transfer.':(qrState.importedPhoto?'Your profile photo, name, compatible mastery progress, and quiz statistics have been restored.':'Your name, compatible mastery progress, and quiz statistics have been restored. This transfer did not include a profile photo.');
 const ok=$('bpRestoreSuccessOK');if(ok)ok.textContent=duplicate?'Try another QR':'Done';
 dialog.dataset.status=duplicate?'duplicate':'success';
 dialog.hidden=false;if(ok)ok.focus();
}
function dismissRestorePopup(){
 const popup=$('bpRestoreSuccess'),succeeded=popup.dataset.status==='success';
 popup.hidden=true;
 if(succeeded){
   // Reinitialize from persisted data, including the restored picture, only after acknowledgment.
   // file:// works without any server requests.
   location.reload();
 }
}
$('bpRestoreSuccessOK')?.addEventListener('click',dismissRestorePopup);
$('bpRestoreSuccess')?.addEventListener('click',event=>{if(event.target===$('bpRestoreSuccess'))dismissRestorePopup()});
async function processQR(raw){raw=String(raw||'').trim();let snapshot;
 if(raw.startsWith('BP25|')){const method=raw[5],bytes=await ungzip(unb64(raw.slice(6)),method);snapshot=JSON.parse(textDecoder.decode(bytes));}
 else if(raw.startsWith('BP24|')){const m=/^BP24\|([a-z0-9]+)\|(\d+)\|(\d+)\|([A-Za-z0-9_-]+)$/.exec(raw);if(!m)throw Error('Invalid older QR');if(m[3]!=='1')throw Error('This earlier transfer has multiple pages. Use BunpoPanda v24 to restore it.');const payload=m[4];const bytes=await ungzip(unb64(payload.slice(1)),payload[0]);snapshot=JSON.parse(textDecoder.decode(bytes));}
 else throw Error('This is not a BunpoPanda QR');
 // Save the fingerprint only after the user confirms a successful restoration.
 // This persists across restarts and applies to QR scans, PNG imports, and pasted text.
 const fingerprint=digest(raw)+'-'+raw.length;
 if(localStorage.getItem(LAST_IMPORTED)===fingerprint){
   await stopCamera();$('settingsOverlay').hidden=false;showRestoreSuccess('duplicate');return;
 }
 if(restore(snapshot)){
   qrState.importedPhoto=Boolean(snapshot.p||snapshot.photo);
   localStorage.setItem(LAST_IMPORTED,fingerprint);
   await stopCamera();$('settingsOverlay').hidden=false;showRestoreSuccess('success');
 }
}
async function decodeImage(file){const bytes=new Uint8Array(await file.arrayBuffer());const saved=embeddedPayload(bytes);if(saved){await processQR(saved);return}
 if(typeof BarcodeDetector==='undefined')throw Error('This image has no BunpoPanda transfer data. Import a QR PNG saved directly from BunpoPanda, or use a browser supporting BarcodeDetector for screenshots and other QR images.');
 const detector=new BarcodeDetector({formats:['qr_code']});const bitmap=await createImageBitmap(file);try{const hits=await detector.detect(bitmap);if(!hits.length)throw Error('No QR found in the image.');for(const hit of hits)await processQR(hit.rawValue)}finally{bitmap.close()}}
async function importImages(e){const files=[...(e.target.files||[])];if(!files.length)return;try{for(const file of files)await decodeImage(file)}catch(err){alert('QR image import: '+err.message)}finally{e.target.value=''}}
async function stopCamera(){qrState.scanning=false;if(qrState.camera){for(const track of qrState.camera.getTracks())track.stop();qrState.camera=null}const video=$('bpQRVideo');video.srcObject=null;$('bpQRScanner').hidden=true}
async function scan(){if(!('BarcodeDetector'in window)){alert('Camera QR scanning is not supported in this browser. You can import QR images on browsers with native QR decoding, or paste QR text from your phone’s scanner.');return}if(!navigator.mediaDevices?.getUserMedia){alert('Camera scanning requires HTTPS or localhost. You can still import QR images or paste QR text.');return}try{$('bpQRScanner').hidden=false;const detector=new BarcodeDetector({formats:['qr_code']});const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}},audio:false});qrState.camera=stream;$('bpQRVideo').srcObject=stream;await $('bpQRVideo').play();qrState.scanning=true;let last='';let busy=false;const tick=async()=>{if(!qrState.scanning)return;if(!busy&&$('bpQRVideo').readyState>=2){busy=true;try{for(const h of await detector.detect($('bpQRVideo'))){if(h.rawValue===last)continue;last=h.rawValue;await processQR(h.rawValue);$('bpQRScannerStatus').textContent=$('bpQRStatus').textContent;}}catch(e){$('bpQRScannerStatus').textContent=e.message}finally{busy=false}}if(qrState.scanning)setTimeout(tick,300)};tick()}catch(err){await stopCamera();alert('Could not start QR scanner: '+err.message)}}
$('bpGenerateQR')?.addEventListener('click',generate);$('bpQRClose')?.addEventListener('click',closeModal);$('bpQRPrev')?.addEventListener('click',()=>draw(qrState.page-1));$('bpQRNext')?.addEventListener('click',()=>draw(qrState.page+1));$('bpQRSave')?.addEventListener('click',saveCurrent);$('bpQRCopy')?.addEventListener('click',async()=>{const value=$('bpQRTransferText').value;try{await navigator.clipboard.writeText(value);note('Transfer text copied.')}catch{const t=$('bpQRTransferText');t.focus();t.select();try{document.execCommand('copy');note('Transfer text copied.')}catch{note('Select the text and copy manually.')}}});$('bpQRModal')?.addEventListener('click',e=>{if(e.target===$('bpQRModal'))closeModal()});$('bpScanQR')?.addEventListener('click',scan);$('bpQRScannerClose')?.addEventListener('click',stopCamera);$('bpQRScanner')?.addEventListener('click',e=>{if(e.target===$('bpQRScanner'))stopCamera()});$('bpImportQR')?.addEventListener('click',()=>$('bpQRImagePicker').click());$('bpQRImagePicker')?.addEventListener('change',importImages);$('bpPasteQR')?.addEventListener('click',async()=>{try{await processQR($('bpQRPaste').value.trim());$('bpQRPaste').value=''}catch(e){alert(e.message)}});
$('bpBackupStats')?.addEventListener('click',()=>setTimeout(updateBackupLabel,0));$('bpClearStats')?.addEventListener('click',()=>setTimeout(updateBackupLabel,0));$('settingsOpen')?.addEventListener('click',()=>setTimeout(updateBackupLabel,0));updateBackupLabel();
})();
