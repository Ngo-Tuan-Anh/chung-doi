"use strict";
const c=window.WEDDING;
const brideFirst=new URLSearchParams(location.search).get('side')==='girl';
if(brideFirst){
  document.querySelectorAll('[data-bind="groom"],[data-bind="bride"]').forEach(el=>{el.dataset.bind=el.dataset.bind==='groom'?'bride':'groom';});
  const families=document.querySelector('.families');
  families.prepend(document.getElementById('bride-parents').parentElement);
}

const date=new Date(`${c.date}T${c.time}:00+07:00`);
const dateText=new Intl.DateTimeFormat('vi-VN',{day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Ho_Chi_Minh'}).format(date);
document.title=`${brideFirst?c.bride:c.groom} & ${brideFirst?c.groom:c.bride} · Thiệp mời thành hôn`;
document.querySelectorAll('[data-bind]').forEach(el=>el.textContent=c[el.dataset.bind]||'');
document.querySelectorAll('[data-date]').forEach(el=>el.textContent=dateText);
const guestParam=new URLSearchParams(location.search).get('guest');
const guest=guestParam?.trim() || 'Quý khách';
document.querySelectorAll('.guest').forEach(el=>el.textContent=guest);
['bride','groom'].forEach(side=>document.getElementById(`${side}-parents`).textContent=c[`${side}Parents`].map((name,i)=>`${i?'Bà':'Ông'}: ${name}`).join('\n'));
function mapLink(customUrl,address){
  if(customUrl){try{const url=new URL(customUrl);if(url.protocol==='https:'||url.protocol==='http:')return url.href;}catch{}}
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
document.getElementById('map').href=mapLink(c.venueMapUrl,c.venue+', '+c.address);
document.getElementById('groom-map').href=mapLink(c.groomMapUrl,c.groomAddress);
document.getElementById('bride-map').href=mapLink(c.brideMapUrl,c.brideAddress);
if(brideFirst){
  document.getElementById('announcement-heading').textContent='TR\u00c2N TR\u1eccNG TH\u00d4NG B\u00c1O';
  document.querySelector('#announcement .couple').hidden=true;
  const details=document.getElementById('ceremony-details');
  details.innerHTML='<h2>B\u1eeeA C\u01a0M TH\u00c2N M\u1eacT</h2><p class="eyebrow">\u0110\u01af\u1ee2C T\u1ed4 CH\u1ee8C V\u00c0O 17:00 - TH\u1ee8 7</p><p>17 th\u00e1ng 10, 2026</p><p>t\u1ee9c 8 th\u00e1ng 9, 2026 \u00e2m</p><div class="flourish" aria-hidden="true">\u2766</div><h2>L\u1ec4 VU QUY</h2><p class="eyebrow">\u0110\u01af\u1ee2C T\u1ed4 CH\u1ee8C V\u00c0O 13:00 - CH\u1ee6 NH\u1eacT</p><p>18 th\u00e1ng 10, 2026</p><p>t\u1ee9c 9 th\u00e1ng 9, 2026 \u00e2m</p><h3>T\u1ea1i t\u01b0 gia nh\u00e0 g\u00e1i</h3>';
  const address=document.createElement('p');address.textContent=c.brideAddress;
  const link=document.createElement('a');link.className='address-link';link.textContent='Ch\u1ec9 \u0111\u01b0\u1eddng nh\u00e0 g\u00e1i \u2197';link.href=mapLink(c.brideMapUrl,c.brideAddress);link.target='_blank';link.rel='noopener';details.append(address,link);
}

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
const album=document.getElementById('album'),gallery=document.getElementById('gallery');
const photos=c.gallery||[],slides=[],dots=[];
let activePhoto=0,albumTimer=null,albumVisible=false,albumPaused=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const albumToggle=document.getElementById('album-toggle');
function renderAlbum(){
  slides.forEach((slide,i)=>{
    const offset=(i-activePhoto+photos.length)%photos.length;
    slide.className='album-slide'+(offset===0?' active':offset===1?' next':offset===photos.length-1?' previous':'');
    slide.tabIndex=offset===0?0:-1;slide.setAttribute('aria-hidden',offset===0?'false':'true');
    dots[i].setAttribute('aria-current',offset===0?'true':'false');
  });
  document.getElementById('album-counter').textContent=photos.length?`${activePhoto+1} / ${photos.length}`:'Chưa có ảnh';
}
function stopAlbum(){clearInterval(albumTimer);albumTimer=null;}
function syncAlbum(){
  stopAlbum();
  albumToggle.textContent=albumPaused?'\u25b6':'\u2161';
  const toggleLabel=albumPaused?'T\u1ef1 \u0111\u1ed9ng ch\u1ea1y album':'T\u1ea1m d\u1eebng album';
  albumToggle.setAttribute('aria-label',toggleLabel);albumToggle.title=toggleLabel;
  if(photos.length>1&&albumVisible&&!albumPaused&&!document.hidden&&!lightbox.open)albumTimer=setInterval(()=>{activePhoto=(activePhoto+1)%photos.length;renderAlbum();},2000);
}
function movePhoto(step){if(!photos.length)return;activePhoto=(activePhoto+step+photos.length)%photos.length;renderAlbum();syncAlbum();}
photos.forEach((src,i)=>{
  const b=document.createElement('button'),img=document.createElement('img');b.type='button';b.setAttribute('aria-label',`Xem ảnh cưới ${i+1}`);img.src=src;img.alt=`Khoảnh khắc cưới ${i+1}`;img.loading='lazy';img.decoding='async';b.append(img);
  b.onclick=()=>{activePhoto=i;renderAlbum();showLargePhoto();lightbox.showModal();syncAlbum();};gallery.append(b);slides.push(b);
  const dot=document.createElement('button');dot.type='button';dot.setAttribute('aria-label',`Chuyển đến ảnh ${i+1}`);dot.onclick=()=>{activePhoto=i;renderAlbum();syncAlbum();};document.getElementById('album-dots').append(dot);dots.push(dot);
});
document.getElementById('album-prev').onclick=()=>movePhoto(-1);
document.getElementById('album-next').onclick=()=>movePhoto(1);
albumToggle.onclick=()=>{albumPaused=!albumPaused;syncAlbum();};
album.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();movePhoto(e.key==='ArrowLeft'?-1:1);}});
let touchStartX=null;
gallery.addEventListener('touchstart',e=>{touchStartX=e.touches[0].clientX;},{passive:true});
gallery.addEventListener('touchend',e=>{if(touchStartX===null)return;const delta=e.changedTouches[0].clientX-touchStartX;if(Math.abs(delta)>50)movePhoto(delta<0?1:-1);touchStartX=null;},{passive:true});
album.addEventListener('mouseenter',stopAlbum);album.addEventListener('mouseleave',syncAlbum);
album.addEventListener('focusin',stopAlbum);album.addEventListener('focusout',e=>{if(!album.contains(e.relatedTarget))syncAlbum();});
document.addEventListener('visibilitychange',syncAlbum);
new IntersectionObserver(entries=>{albumVisible=entries[0].isIntersecting;syncAlbum();},{threshold:.2}).observe(album);
renderAlbum();syncAlbum();
if(photos.length<2)document.querySelector('.album-controls').hidden=true;
document.getElementById('close-photo').onclick=()=>lightbox.close();
lightbox.addEventListener('close',syncAlbum);
lightbox.addEventListener('click',e=>{if(e.target===lightbox)lightbox.close();});
const audio=document.getElementById('audio'),music=document.getElementById('music');
const youtubeId=!c.music&&/^[A-Za-z0-9_-]{11}$/.test(c.musicYoutubeId||'')?c.musicYoutubeId:'';
let youtubePlayer=null,youtubeReady=false,musicStarted=false,wantsMusic=false;
function setMusicLabel(playing){music.textContent=playing?'Ⅱ':'♫';music.setAttribute('aria-label',playing?'Tắt nhạc':'Bật nhạc');}
function musicLabel(){setMusicLabel(!audio.paused);}
const musicStatus=document.getElementById('music-status');
if(youtubeId){music.hidden=false;}
else if(c.music){audio.src=c.music;audio.preload='auto';audio.load();music.hidden=false;}
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
function startYoutubeMusic(play=true){
  wantsMusic=play;
  if(youtubeReady){if(play)youtubePlayer.playVideo();return;}
  if(musicStarted)return;
  musicStarted=true;musicStatus.textContent='Đang tải nhạc…';
  if(window.YT?.Player){createYoutubePlayer();return;}
  window.onYouTubeIframeAPIReady=createYoutubePlayer;
  const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.async=true;
  script.onerror=()=>{musicStarted=false;musicStatus.textContent='Chưa tải được nhạc. Bạn có thể nghe trên YouTube bên dưới.';};
  document.head.append(script);
}
if(youtubeId)startYoutubeMusic(false);
music.onclick=async()=>{
  if(youtubeId){if(youtubeReady&&youtubePlayer.getPlayerState()===YT.PlayerState.PLAYING){wantsMusic=false;youtubePlayer.pauseVideo();}else startYoutubeMusic();}
  else{if(audio.paused){try{await audio.play();}catch{}}else audio.pause();musicLabel();}
};
document.getElementById('open').onclick=()=>{
  document.getElementById('envelope').classList.add('opened');document.body.classList.remove('sealed');document.getElementById('invitation').inert=false;
  document.getElementById('invitation').focus({preventScroll:true});
  startAutoScroll();
  launchFireworks();
  document.querySelector('.hero').classList.add('slideshow-running');
  if(youtubeId)startYoutubeMusic();else if(c.music)audio.play().then(musicLabel).catch(musicLabel);
};

const giftDialog=document.getElementById('gift-dialog');
document.getElementById('open-gifts').onclick=()=>giftDialog.showModal();
document.getElementById('close-gifts').onclick=()=>giftDialog.close();
giftDialog.addEventListener('click',e=>{if(e.target===giftDialog){const rect=giftDialog.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)giftDialog.close();}});
const giftAccounts=document.getElementById('gift-accounts');
const orderedGifts=[...(c.gifts||[])];
if(brideFirst)orderedGifts.reverse();
orderedGifts.forEach(gift=>{
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

// Slowly reveal the invitation; hand control back on any visitor interaction.
let autoScrollFrame=null,autoScrollDelay=null,autoScrollPosition=0,autoScrollLastTime=null;
function stopAutoScroll(){
  clearTimeout(autoScrollDelay);autoScrollDelay=null;
  if(autoScrollFrame!==null)cancelAnimationFrame(autoScrollFrame);
  autoScrollFrame=null;autoScrollLastTime=null;
}
function advanceAutoScroll(time){
  if(document.hidden||document.querySelector('dialog[open]')){stopAutoScroll();return;}
  if(autoScrollLastTime===null)autoScrollLastTime=time;
  const elapsed=Math.min(time-autoScrollLastTime,100);autoScrollLastTime=time;
  const bottom=Math.max(0,document.documentElement.scrollHeight-window.innerHeight);
  autoScrollPosition=Math.min(bottom,autoScrollPosition+18*elapsed/1000);
  window.scrollTo({top:autoScrollPosition,behavior:'instant'});
  if(autoScrollPosition>=bottom){stopAutoScroll();return;}
  autoScrollFrame=requestAnimationFrame(advanceAutoScroll);
}
function startAutoScroll(){
  stopAutoScroll();
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  autoScrollDelay=setTimeout(()=>{autoScrollPosition=window.scrollY;autoScrollFrame=requestAnimationFrame(advanceAutoScroll);},2000);
}
['wheel','touchstart','pointerdown'].forEach(type=>document.addEventListener(type,stopAutoScroll,{passive:true,capture:true}));
document.addEventListener('keydown',stopAutoScroll);
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAutoScroll();});

// Short decorative fireworks when the invitation opens.
function launchFireworks(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const canvas=document.createElement('canvas');canvas.className='opening-fireworks';canvas.setAttribute('aria-hidden','true');
  const ctx=canvas.getContext('2d');if(!ctx)return;
  document.body.append(canvas);
  let width,height,frame,started=null,last=null,nextBurst=0;
  const particles=[],colors=['#ffe7a0','#ffd166','#fff0e7','#a8e6cf','#ff9caa'];
  function resize(){width=window.innerWidth;height=window.innerHeight;const ratio=Math.min(window.devicePixelRatio||1,2);canvas.width=width*ratio;canvas.height=height*ratio;ctx.setTransform(ratio,0,0,ratio,0,0);}
  function cleanup(){cancelAnimationFrame(frame);canvas.remove();window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',onVisibility);}
  function onVisibility(){if(document.hidden)cleanup();}
  function burst(){
    const x=width*(.15+Math.random()*.7),y=height*(.12+Math.random()*.4),color=colors[Math.floor(Math.random()*colors.length)];
    for(let i=0;i<48;i++){const angle=Math.PI*2*i/48,speed=65+Math.random()*110;particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:0,duration:1.2+Math.random()*.6,color});}
  }
  function animate(time){
    if(started===null){started=time;last=time;}
    const elapsed=time-started,dt=Math.min((time-last)/1000,.05);last=time;
    ctx.clearRect(0,0,width,height);
    if(elapsed<2400&&elapsed>=nextBurst){burst();nextBurst=elapsed+380;}
    for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.life+=dt;if(p.life>=p.duration){particles.splice(i,1);continue;}p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=75*dt;ctx.globalAlpha=1-p.life/p.duration;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,2,0,Math.PI*2);ctx.fill();}
    ctx.globalAlpha=1;
    if(elapsed>4500){cleanup();return;}
    frame=requestAnimationFrame(animate);
  }
  resize();window.addEventListener('resize',resize);document.addEventListener('visibilitychange',onVisibility);frame=requestAnimationFrame(animate);
}

function showLargePhoto(){
  const image=document.getElementById('large-photo');image.src=photos[activePhoto];image.alt=`Wedding photo ${activePhoto+1} / ${photos.length}`;
  document.getElementById('photo-counter').textContent=`${activePhoto+1} / ${photos.length}`;
}
function moveLargePhoto(step){if(!photos.length)return;movePhoto(step);showLargePhoto();}
document.getElementById('photo-prev').onclick=()=>moveLargePhoto(-1);
document.getElementById('photo-next').onclick=()=>moveLargePhoto(1);
lightbox.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();moveLargePhoto(e.key==='ArrowLeft'?-1:1);}});
let photoTouch=null;
lightbox.addEventListener('touchstart',e=>{photoTouch=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null;},{passive:true});
lightbox.addEventListener('touchend',e=>{if(!photoTouch)return;const dx=e.changedTouches[0].clientX-photoTouch.x,dy=e.changedTouches[0].clientY-photoTouch.y;photoTouch=null;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy))moveLargePhoto(dx<0?1:-1);},{passive:true});
lightbox.addEventListener('touchcancel',()=>{photoTouch=null;});
