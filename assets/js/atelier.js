"use strict";
(() => {
 const $=(s,root=document)=>root.querySelector(s), $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
 const page=location.href.split('#')[0].split('?')[0];
 const projects={
  olivo:{name:"Casa Olivo",category:"RESIDENCIAL / 2025",description:"Un hogar sereno donde la textura de los materiales naturales encuentra el equilibrio con la luz y las proporciones contemporáneas. Este proyecto es un ejemplo ficticio de la demostración.",image:"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=82"},
  norte:{name:"Atelier Norte",category:"COMERCIAL / 2024",description:"Un espacio concebido para transmitir calma, identidad y presencia. Una atmósfera que conecta una marca con las personas. Proyecto conceptual ficticio.",image:"https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=82"},
  patina:{name:"Pátina Loft",category:"RESIDENCIAL / 2023",description:"Materiales honestos y una paleta suave transforman un interior cotidiano en un refugio luminoso. Proyecto conceptual ficticio.",image:"https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=82"}
 };
 let noticeTimer;
 function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("active");clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>el.classList.remove("active"),3100);}
 function close(el){if(el.close)el.close();else el.removeAttribute("open");}
 function open(el){$$("dialog[open]").forEach(close);if(el.showModal)el.showModal();else el.setAttribute("open","");}
 $$("dialog").forEach(el=>{$(".close-modal",el).addEventListener("click",()=>close(el));el.addEventListener("click",event=>{if(event.target===el)close(el);});});
 const qr=$("#qr-dialog"),qrImage=$("#qr-image");
 function showQR(){qrImage.hidden=false;$("#qr-error").hidden=true;qrImage.src="https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=12&format=png&data="+encodeURIComponent(page);open(qr);}
 qrImage.addEventListener("error",()=>{qrImage.hidden=true;$("#qr-error").hidden=false;});
 $$(".open-qr").forEach(button=>button.addEventListener("click",showQR));
 $$(".open-contact").forEach(button=>button.addEventListener("click",()=>open($("#contact-dialog"))));
 async function copy(){try{if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(page);else{const el=document.createElement("textarea");el.value=page;document.body.appendChild(el);el.select();let ok=document.execCommand("copy");el.remove();if(!ok)throw Error("No clipboard");}toast("Enlace copiado. ¡Compártelo!");}catch(e){toast("Copia el enlace desde la barra de tu navegador.");}}
 $("#copy-url").addEventListener("click",copy);
 $$(".share").forEach(button=>button.addEventListener("click",async()=>{if(navigator.share){try{await navigator.share({title:"ATELIER 01 · Tarjetiva",text:"Mira este modelo de tarjeta digital premium.",url:page});}catch(e){if(e.name!=="AbortError")await copy();}}else await copy();}));
 $("#download-vcard").addEventListener("click",()=>{const v=["BEGIN:VCARD","VERSION:3.0","FN:Valeria Soto (DEMO Tarjetiva)","N:Soto;Valeria;;;","ORG:Estudio ficticio de demostracion","TITLE:Interiorismo (DEMO)","EMAIL;TYPE=INTERNET:demo@example.com","URL:https://tarjetiva.com/","NOTE:Contacto ficticio utilizado para la demostracion de Tarjetiva.","END:VCARD"].join("\r\n");const url=URL.createObjectURL(new Blob([v],{type:"text/vcard;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download="Tarjetiva-Contacto-Demo.vcf";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);toast("Contacto de ejemplo descargado.");});
 $$(".filter").forEach(btn=>btn.addEventListener("click",()=>{$$(".filter").forEach(b=>{b.classList.toggle("active",b===btn);b.setAttribute("aria-pressed",String(b===btn));});$$(".project").forEach(card=>card.hidden=btn.dataset.filter!=="todos"&&card.dataset.type!==btn.dataset.filter);}));
 $$(".project").forEach(btn=>btn.addEventListener("click",()=>{const p=projects[btn.dataset.project];$("#project-dialog-category").textContent=p.category;$("#project-dialog-title").textContent=p.name;$("#project-dialog-description").textContent=p.description;const img=$("#project-dialog-image");img.src=p.image;img.alt="Fotografía ilustrativa de "+p.name;open($("#project-dialog"));}));
 $(".close-project").addEventListener("click",()=>close($("#project-dialog")));
 let ticking=false;function progress(){let size=document.documentElement.scrollHeight-innerHeight;$("#progress").style.width=(size>0?100*scrollY/size:0)+"%";ticking=false;}
 addEventListener("scroll",()=>{if(!ticking){ticking=true;requestAnimationFrame(progress);}},{passive:true});addEventListener("resize",progress);progress();
 if("IntersectionObserver" in window&&!matchMedia("(prefers-reduced-motion:reduce)").matches){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}}),{threshold:.08,rootMargin:"0px 0px 45px 0px"});$$(".reveal").forEach(node=>observer.observe(node));}else $$(".reveal").forEach(node=>node.classList.add("visible"));
 $$("img").forEach(img=>img.addEventListener("error",()=>{if(img!==qrImage)img.style.opacity=0;},{once:true}));
})();