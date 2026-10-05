"use strict";
const c=window.WEDDING;
const date=new Date(`${c.date}T${c.time}:00+07:00`);
const dateText=new Intl.DateTimeFormat('vi-VN',{day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Ho_Chi_Minh'}).format(date);
document.title=`${c.bride} & ${c.groom} · Thiệp mời thành hôn`;
document.querySelectorAll('[data-bind]').forEach(el=>el.textContent=c[el.dataset.bind]||'');
document.querySelectorAll('[data-date]').forEach(el=>el.textContent=dateText);
const guestParam=new URLSearchParams(location.search).get('guest');
const guest=guestParam?.trim() || 'Quý khách';
document.querySelectorAll('.guest').forEach(el=>el.textContent=guest);
['bride','groom'].forEach(side=>document.getElementById(`${side}-parents`).textContent=c[`${side}Parents`].map((name,i)=>`${i?'Bà':'Ông'}: ${name}`).join(' · '));
function mapLink(customUrl,address){
  if(customUrl){try{const url=new URL(customUrl);if(url.protocol==='https:'||url.protocol==='http:')return url.href;}catch{}}
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
document.getElementById('map').href=mapLink(c.venueMapUrl,c.venue+', '+c.address);
document.getElementById('groom-map').href=mapLink(c.groomMapUrl,c.groomAddress);
document.getElementById('bride-map').href=mapLink(c.brideMapUrl,c.brideAddress);
const [year,month,day]=c.date.split('-').map(Number);
document.getElementById('day').textContent=String(day).padStart(2,'0');
document.getElementById('weekday').textContent=new Intl.DateTimeFormat('vi-VN',{weekday:'long',timeZone:'Asia/Ho_Chi_Minh'}).format(date);
document.getElementById('month-year').textContent=`Tháng ${month} · ${year}`;
document.getElementById('calendar-title').textContent=`Tháng ${month}, ${year}`;
const cal=document.getElementById('calendar');
function cell(text,cls=''){const el=document.createElement('span');el.textContent=text;el.className=cls;cal.append(el);}
['T2','T3','T4','T5','T6','T7','CN'].forEach(x=>cell(x));
for(let i=0;i<(new Date(year,month-1,1).getDay()+6)%7;i++)cell('');
for(let i=1;i<=new Date(year,month,0).getDate();i++)cell(i,i===day?'selected':'');
function countdown(){let seconds=Math.max(0,Math.floor((date-Date.now())/1000));const values=[Math.floor(seconds/86400),Math.floor(seconds/3600)%24,Math.floor(seconds/60)%60,seconds%60];const el=document.getElementById('countdown');el.replaceChildren();values.forEach((n,i)=>{const block=document.createElement('div'),strong=document.createElement('strong'),small=document.createElement('small');strong.textContent=String(n).padStart(2,'0');small.textContent=['Ngày','Giờ','Phút','Giây'][i];block.append(strong,small);el.append(block);});}
countdown();setInterval(countdown,1000);
c.timeline.forEach(([time,label])=>{const el=document.createElement('div');el.className='event';const t=document.createElement('time'),s=document.createElement('span');t.textContent=time;s.textContent=label;el.append(t,s);document.getElementById('timeline').append(el);});
const lightbox=document.getElementById('lightbox');
c.gallery.forEach((src,i)=>{const b=document.createElement('button'),img=document.createElement('img');b.type='button';b.setAttribute('aria-label',`Xem ảnh cưới ${i+1}`);img.src=src;img.alt=`Khoảnh khắc cưới ${i+1}`;img.loading='lazy';img.decoding='async';b.append(img);b.onclick=()=>{document.getElementById('large-photo').src=src;lightbox.showModal();};document.getElementById('gallery').append(b);});
document.getElementById('close-photo').onclick=()=>lightbox.close();
lightbox.addEventListener('click',e=>{if(e.target===lightbox)lightbox.close();});
const audio=document.getElementById('audio'),music=document.getElementById('music');
const youtubeId=/^[A-Za-z0-9_-]{11}$/.test(c.musicYoutubeId||'')?c.musicYoutubeId:'';
let youtubePlayer=null,youtubeReady=false,musicStarted=false,wantsMusic=false;
function setMusicLabel(playing){music.textContent=playing?'Ⅱ':'♫';music.setAttribute('aria-label',playing?'Tắt nhạc':'Bật nhạc');}
function musicLabel(){setMusicLabel(!audio.paused);}
const musicStatus=document.getElementById('music-status');
if(youtubeId){music.hidden=false;document.getElementById('wedding-music').hidden=false;}
else if(c.music){audio.src=c.music;music.hidden=false;}
function createYoutubePlayer(){
  if(youtubePlayer)return;
  youtubePlayer=new YT.Player('youtube-player',{
    width:'100%',height:'300',videoId:youtubeId,
    playerVars:{playsinline:1,controls:1,loop:1,playlist:youtubeId,origin:location.origin},
    events:{
      onReady:event=>{youtubeReady=true;event.target.getIframe().title='Bài này không để đi diễn · Anh Tú Atus & Diệu Nhi';if(wantsMusic)event.target.playVideo();},
      onStateChange:event=>{const playing=event.data===YT.PlayerState.PLAYING;setMusicLabel(playing);if(playing)musicStatus.textContent='';if(event.data===YT.PlayerState.PAUSED)wantsMusic=false;},
      onAutoplayBlocked:()=>{setMusicLabel(false);musicStatus.textContent='Nhấn nút phát trên video hoặc nút ♫ để nghe nhạc.';},
      onError:()=>{setMusicLabel(false);musicStatus.textContent='Chưa phát được video tại đây. Bạn có thể nghe bằng liên kết YouTube bên dưới.';}
    }
  });
}
function startYoutubeMusic(){
  wantsMusic=true;
  if(youtubeReady){youtubePlayer.playVideo();return;}
  if(musicStarted)return;
  musicStarted=true;musicStatus.textContent='Đang tải nhạc…';
  if(window.YT?.Player){createYoutubePlayer();return;}
  window.onYouTubeIframeAPIReady=createYoutubePlayer;
  const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.async=true;
  script.onerror=()=>{musicStarted=false;musicStatus.textContent='Chưa tải được nhạc. Bạn có thể nghe trên YouTube bên dưới.';};
  document.head.append(script);
}
music.onclick=async()=>{
  if(youtubeId){if(youtubeReady&&youtubePlayer.getPlayerState()===YT.PlayerState.PLAYING){wantsMusic=false;youtubePlayer.pauseVideo();}else startYoutubeMusic();}
  else{if(audio.paused){try{await audio.play();}catch{}}else audio.pause();musicLabel();}
};
document.getElementById('open').onclick=()=>{
  document.getElementById('envelope').classList.add('opened');document.body.classList.remove('sealed');document.getElementById('invitation').inert=false;
  document.querySelector('.scroll').focus({preventScroll:true});
  if(youtubeId)startYoutubeMusic();else if(c.music)audio.play().then(musicLabel).catch(musicLabel);
};
document.getElementById('rsvp').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.target);const text=`Tên: ${f.get('name')}\nTham dự: ${f.get('attendance')}\nLời chúc: ${f.get('wish')||''}`;if(c.rsvpEmail){location.href=`mailto:${c.rsvpEmail}?subject=${encodeURIComponent('Xác nhận dự cưới: '+f.get('name'))}&body=${encodeURIComponent(text)}`;document.getElementById('form-status').textContent='Ứng dụng email sẽ mở. Vui lòng gửi email để hoàn tất xác nhận.';}else{const blob=new Blob([text],{type:'text/plain;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='xac-nhan-du-cuoi.txt';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);document.getElementById('form-status').textContent='Đã tải lời xác nhận. Bạn hãy gửi tệp này cho cô dâu hoặc chú rể để hoàn tất.';}});

const giftDialog=document.getElementById('gift-dialog');
document.getElementById('open-gifts').onclick=()=>giftDialog.showModal();
document.getElementById('close-gifts').onclick=()=>giftDialog.close();
giftDialog.addEventListener('click',e=>{if(e.target===giftDialog){const rect=giftDialog.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)giftDialog.close();}});
const giftAccounts=document.getElementById('gift-accounts');
(c.gifts||[]).forEach(gift=>{
  const card=document.createElement('article');card.className='gift-account';
  const title=document.createElement('h3');title.textContent=gift.label;card.append(title);
  if(gift.qrImage){
    const image=document.createElement('img');image.src=gift.qrImage;image.alt=`Mã QR ${gift.label}`;image.className='gift-qr';
    image.onerror=()=>{image.hidden=true;status.textContent='Chưa tải được mã QR. Vui lòng liên hệ cô dâu hoặc chú rể.';};
    const status=document.createElement('p');status.setAttribute('role','status');card.append(image,status);
    [gift.bank,gift.accountName,gift.accountNumber].filter(Boolean).forEach(text=>{const p=document.createElement('p');p.textContent=text;card.append(p);});
    if(gift.accountNumber){const copy=document.createElement('button');copy.type='button';copy.textContent='Sao chép số tài khoản';copy.onclick=async()=>{try{await navigator.clipboard.writeText(gift.accountNumber);status.textContent='Đã sao chép số tài khoản.';}catch{status.textContent='Bạn vui lòng sao chép số tài khoản hiển thị phía trên.';}};card.append(copy);}
  }else{const p=document.createElement('p');p.textContent='Thông tin mừng cưới sẽ được cập nhật. Bạn có thể gửi lời chúc đến chúng mình bên dưới nhé!';card.append(p);}
  giftAccounts.append(card);
});
