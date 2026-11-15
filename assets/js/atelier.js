'use strict';
(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const shareUrl = location.href.split('#')[0].split('?')[0];
  let toastTimer;

  function toast(message) {
    const element = $('#toast');
    element.textContent = message;
    element.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => element.classList.remove('visible'), 3500);
  }

  function openModal(dialog) {
    if (!dialog) return;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }
  function closeModal(dialog) {
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }

  $$('dialog').forEach(dialog => {
    $('[data-close]', dialog).addEventListener('click', () => closeModal(dialog));
    dialog.addEventListener('click', event => {
      if (event.target === dialog) closeModal(dialog);
    });
  });

  async function copyLink() {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const field = document.createElement('textarea');
        field.value = shareUrl;
        field.style.position = 'fixed';
        field.style.left = '-9999px';
        document.body.appendChild(field);
        field.focus();
        field.select();
        const didCopy = document.execCommand('copy');
        field.remove();
        if (!didCopy) throw new Error('No se pudo copiar');
      }
      toast('Enlace copiado. ¡Listo para compartir!');
    } catch (_) {
      toast('Copia el enlace desde la barra de tu navegador.');
    }
  }

  $$('[data-share]').forEach(button => button.addEventListener('click', async () => {
    const data = {
      title: 'ATELIER 01 · Tarjetiva',
      text: 'Mira este modelo de tarjeta digital de Tarjetiva.',
      url: shareUrl
    };
    if (navigator.share) {
      try { await navigator.share(data); }
      catch (error) { if (error.name !== 'AbortError') await copyLink(); }
    } else await copyLink();
  }));

  $('#save-contact').addEventListener('click', () => {
    const vcard = [
      'BEGIN:VCARD', 'VERSION:3.0',
      'FN:Valeria Soto (DEMO Tarjetiva)',
      'N:Soto;Valeria;;;',
      'ORG:Estudio ficticio de interiorismo - Tarjetiva',
      'TITLE:Disenadora de interiores - ejemplo',
      'EMAIL;TYPE=INTERNET:demo@example.com',
      'URL:https://tarjetiva.com/',
      'NOTE:Datos ficticios. Este contacto solo demuestra la funcion de la tarjeta.',
      'END:VCARD'
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([vcard], { type: 'text/vcard;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Valeria-Soto-Tarjetiva-Demo.vcf';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    toast('Contacto de demostración descargado.');
  });

  const demoActions = {
    whatsapp: {
      title: 'WhatsApp al instante.',
      description: 'En tu tarjeta real, este botón abrirá directamente tu WhatsApp con un mensaje listo para enviar.'
    },
    telefono: {
      title: 'Una llamada, un toque.',
      description: 'Aquí irá tu número real para que las personas puedan llamarte desde el teléfono.'
    },
    correo: {
      title: 'Contacto por correo.',
      description: 'Este botón abrirá un nuevo correo con tu dirección profesional ya escrita.'
    },
    ubicacion: {
      title: 'Encuéntrame fácilmente.',
      description: 'Aquí se abrirá la ubicación de tu negocio en el mapa, con el destino listo para navegar.'
    }
  };
  $$('[data-demo]').forEach(button => button.addEventListener('click', () => {
    const info = demoActions[button.dataset.demo];
    if (!info) return;
    $('#demo-title').textContent = info.title;
    $('#demo-description').textContent = info.description;
    openModal($('#demo-dialog'));
  }));

  const tabs = $$('.tab');
  function activateTab(tab, focus) {
    const panel = $('#panel-' + tab.dataset.tab);
    tabs.forEach(item => {
      const active = item === tab;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
      $('#panel-' + item.dataset.tab).hidden = !active;
    });
    if (focus) tab.focus();
    if (!panel) return;
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activateTab(tab, false));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); activateTab(tabs[next], true); }
    });
  });

  const track = $('#gallery-track');
  function scrollGallery(direction) {
    const item = $('.gallery-item', track);
    if (!item) return;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    track.scrollBy({ left: direction * (item.getBoundingClientRect().width + gap), behavior: 'smooth' });
  }
  $('.gallery-prev').addEventListener('click', () => scrollGallery(-1));
  $('.gallery-next').addEventListener('click', () => scrollGallery(1));

  const qrImage = $('#qr-image');
  function showQr() {
    $('#qr-loading').hidden = false;
    $('#qr-fallback').hidden = true;
    qrImage.hidden = true;
    const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&format=png&data=' + encodeURIComponent(shareUrl);
    if (qrImage.src !== qrUrl) qrImage.src = qrUrl;
    else if (qrImage.complete && qrImage.naturalWidth) {
      $('#qr-loading').hidden = true;
      qrImage.hidden = false;
    }
    openModal($('#qr-dialog'));
  }
  qrImage.addEventListener('load', () => {
    $('#qr-loading').hidden = true;
    qrImage.hidden = false;
  });
  qrImage.addEventListener('error', () => {
    $('#qr-loading').hidden = true;
    $('#qr-fallback').hidden = false;
  });
  $('#show-qr').addEventListener('click', showQr);
  $('#copy-url').addEventListener('click', copyLink);
})();