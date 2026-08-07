const sections=[...document.querySelectorAll('[data-section]')];
const links=[...document.querySelectorAll('[data-nav]')];
const page=document.querySelector('[data-page]');
const rail=document.querySelector('.rail');
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;const index=sections.indexOf(entry.target);links.forEach(link=>link.classList.toggle('active',link.hash===`#${entry.target.id}`));if(page)page.textContent=`${String(index).padStart(2,'0')} / 07`;})},{threshold:.55});
sections.forEach(section=>observer.observe(section));
document.querySelector('[data-menu]')?.addEventListener('click',()=>rail?.classList.toggle('open'));
links.forEach(link=>link.addEventListener('click',()=>rail?.classList.remove('open')));
document.querySelector('[data-slider]')?.addEventListener('input',event=>{const value=event.target.value;const before=document.querySelector('[data-before]');const line=document.querySelector('[data-line]');if(before)before.style.width=`${value}%`;if(line)line.style.left=`${value}%`;});
