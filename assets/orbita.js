'use strict';
(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const shareUrl = location.href.split(/[?#]/)[0];
  let toastTimer;
  function toast(message) {
    const node = $('#toast');
    node.textContent = message;
    node.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove('show'), 3200);
  }
  function openDialog(dialog) {
    if (!dialog) return;
    $$('dialog[open]').forEach(closeDialog);
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }
  function closeDialog(dialog) {
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }
  $$('dialog').forEach(dialog => {
    $('.close-modal', dialog).addEventListener('click', () => closeDialog(dialog));
    dialog.addEventListener('click', event => { if (event.target === dialog) closeDialog(dialog); });
  });
  const portrait = $('.photo-frame img');
  if (portrait) {
    const showFallback = () => { portrait.hidden = true; };
    portrait.addEventListener('error', showFallback, { once: true });
    if (portrait.complete && portrait.naturalWidth === 0) showFallback();
  }
  const themeToggle = $('#mode-toggle');
  themeToggle.addEventListener('click', () => {
    const aurora = document.body.dataset.skin !== 'aurora';
    document.body.dataset.skin = aurora ? 'aurora' : 'night';
    themeToggle.setAttribute('aria-pressed', String(aurora));
    toast(aurora ? 'Aura pastel activada' : 'Aura eléctrica activada');
  });
  async function copyLink() {
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(shareUrl);
      else {
        const field = document.createElement('textarea');
        field.value = shareUrl;
        field.style.position = 'fixed';
        field.style.left = '-9999px';
        document.body.appendChild(field);
        field.select();
        const ok = document.execCommand('copy');
        field.remove();
        if (!ok) throw new Error('copy failed');
      }
      toast('Enlace copiado para compartir.');
    } catch (_) { toast('Copia el enlace desde la barra del navegador.'); }
  }
  $('#copy-link').addEventListener('click', copyLink);
  $('#share-card').addEventListener('click', async () => {
    if (navigator.share) {
      try { await navigator.share({ title: 'ÓRBITA 02 · Tarjetiva', text: 'Mira esta tarjeta digital.', url: shareUrl }); }
      catch (error) { if (error.name !== 'AbortError') await copyLink(); }
    } else await copyLink();
  });
  $('#save-contact').addEventListener('click', () => {
    const card = [
      'BEGIN:VCARD', 'VERSION:3.0', 'FN:Luna Vega (DEMO Tarjetiva)', 'N:Vega;Luna;;;',
      'ORG:Perfil ficticio · Tarjetiva', 'TITLE:Directora creativa (DEMO)',
      'EMAIL;TYPE=INTERNET:demo@example.com', 'URL:https://tarjetiva.com/',
      'NOTE:Ejemplo ficticio para demostrar la funcion Guardar contacto.', 'END:VCARD'
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([card], { type: 'text/vcard;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Luna-Vega-DEMO-Tarjetiva.vcf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 3500);
    toast('Contacto ficticio descargado.');
  });
  const channels = {
    whatsapp: ['WhatsApp inmediato.', 'En una tarjeta personalizada este acceso abre WhatsApp con tu número real y un mensaje listo para enviar.'],
    phone: ['Una llamada, un toque.', 'Aquí se marcará tu número de teléfono real. En esta demostración no utilizamos números inventados.'],
    email: ['Conecta por correo.', 'En tu tarjeta real se abrirá un correo nuevo dirigido a tu dirección profesional.'],
    location: ['Llega sin perderte.', 'Aquí se abrirá el mapa de la dirección real que configures para tu negocio.']
  };
  $$('[data-channel]').forEach(button => button.addEventListener('click', () => {
    const info = channels[button.dataset.channel];
    if (!info) return;
    $('#info-title').textContent = info[0];
    $('#info-text').textContent = info[1];
    openDialog($('#info-dialog'));
  }));
  const tabs = $$('.tab');
  function activateTab(tab, withFocus = false) {
    tabs.forEach(item => {
      const active = item === tab;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
      $('#panel-' + item.dataset.tab).hidden = !active;
    });
    if (withFocus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', event => {
      let next = null;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== null) { event.preventDefault(); activateTab(tabs[next], true); }
    });
  });
  const projects = {
    pulse: { name: 'PULSE®', className: 'p-one', description: 'Identidad conceptual para un festival de música electrónica. Un universo visual enérgico creado como muestra ficticia.' },
    form: { name: 'FORMA✳', className: 'p-two', description: 'Exploración cromática y de packaging para una marca creativa imaginaria. Proyecto de demostración.' },
    acid: { name: 'ACID↗', className: 'p-three', description: 'Un sistema gráfico vibrante y experimental para una comunidad digital ficticia.' }
  };
  $$('.project').forEach(button => button.addEventListener('click', () => {
    const project = projects[button.dataset.project];
    if (!project) return;
    $('#project-title').textContent = project.name;
    $('#project-description').textContent = project.description;
    const art = $('#project-art');
    art.className = 'project-modal-art ' + project.className;
    art.textContent = project.name;
    openDialog($('#project-dialog'));
  }));
  $('#back-projects').addEventListener('click', () => closeDialog($('#project-dialog')));
  const qrImage = $('#qr-image');
  $('#show-qr').addEventListener('click', () => {
    $('#qr-loading').hidden = false;
    $('#qr-fallback').hidden = true;
    qrImage.hidden = true;
    const imageUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&format=png&data=' + encodeURIComponent(shareUrl);
    if (qrImage.src !== imageUrl) qrImage.src = imageUrl;
    else if (qrImage.complete && qrImage.naturalWidth) { $('#qr-loading').hidden = true; qrImage.hidden = false; }
    openDialog($('#qr-dialog'));
  });
  qrImage.addEventListener('load', () => { $('#qr-loading').hidden = true; qrImage.hidden = false; });
  qrImage.addEventListener('error', () => { $('#qr-loading').hidden = true; $('#qr-fallback').hidden = false; });
})();
