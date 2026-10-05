"use strict";
const c=window.WEDDING;
const date=new Date(`${c.date}T${c.time}:00+07:00`);
const dateText=new Intl.DateTimeFormat('vi-VN',{day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Ho_Chi_Minh'}).format(date);
document.title=`${c.bride} & ${c.groom} · Thiệp mời thành hôn`;
document.querySelectorAll('[data-bind]').forEach(el=>el.textContent=c[el.dataset.bind]||'');
document.querySelectorAll('[data-date]').forEach(el=>el.textContent=dateText);
const guest=new URLSearchParams(location.search).get('guest')||c.guest;
document.querySelectorAll('.guest').forEach(el=>el.textContent=guest);
['bride','groom'].forEach(side=>document.getElementById(`${side}-parents`).textContent=c[`${side}Parents`].map((name,i)=>`${i?'Bà':'Ông'}: ${name}`).join(' · '));
document.getElementById('map').href=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.venue+', '+c.address)}`;
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
if(c.music){audio.src=c.music;music.hidden=false;}
function musicLabel(){music.textContent=audio.paused?'♫':'Ⅱ';music.setAttribute('aria-label',audio.paused?'Bật nhạc':'Tắt nhạc');}
music.onclick=async()=>{if(audio.paused){try{await audio.play();}catch{}}else audio.pause();musicLabel();};
document.getElementById('open').onclick=()=>{document.getElementById('envelope').classList.add('opened');document.body.classList.remove('sealed');document.getElementById('invitation').inert=false;document.querySelector('.scroll').focus({preventScroll:true});if(c.music)audio.play().then(musicLabel).catch(musicLabel);};
document.getElementById('rsvp').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.target);const text=`Tên: ${f.get('name')}\nTham dự: ${f.get('attendance')}\nLời chúc: ${f.get('wish')||''}`;if(c.rsvpEmail){location.href=`mailto:${c.rsvpEmail}?subject=${encodeURIComponent('Xác nhận dự cưới: '+f.get('name'))}&body=${encodeURIComponent(text)}`;document.getElementById('form-status').textContent='Ứng dụng email sẽ mở. Vui lòng gửi email để hoàn tất xác nhận.';}else{const blob=new Blob([text],{type:'text/plain;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='xac-nhan-du-cuoi.txt';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);document.getElementById('form-status').textContent='Đã tải lời xác nhận. Bạn hãy gửi tệp này cho cô dâu hoặc chú rể để hoàn tất.';}});
