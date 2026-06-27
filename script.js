// ============================================================
//  maewiino — script.js
//  Handles: loading screen, navbar, reveal animations,
//           mobile menu, form logic, WA message builder
// ============================================================

const WA_NUMBER = '6288215797276';

// --- LOADING SCREEN ---
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loading-screen');
    if (loader) {
      loader.classList.add('hidden');
      document.body.classList.add('loaded');
    }
  }, 2200);
});

// --- NAVBAR SCROLL BEHAVIOR ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// --- MOBILE MENU ---
const navBurger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');

function closeMobileMenu() {
  mobileMenu.classList.remove('active');
  navBurger.classList.remove('active');
  document.body.style.overflow = '';
}

navBurger.addEventListener('click', () => {
  const isActive = mobileMenu.classList.toggle('active');
  navBurger.classList.toggle('active', isActive);
  document.body.style.overflow = isActive ? 'hidden' : '';
});

// Close on overlay click
mobileMenu.addEventListener('click', (e) => {
  if (e.target === mobileMenu) closeMobileMenu();
});

// Close on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMobileMenu();
});

// --- SCROLL REVEAL ---
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach((el) => {
  revealObserver.observe(el);
});

// --- SERVICE CARD SELECTION ---
function selectService(serviceKey) {
  const serviceMap = {
    entertainment: 'Music Entertainment',
    vocal_only: 'Vocal Only',
    solo_performance: 'Solo Performance',
    event: 'Event Music Direction'
  };

  const serviceName = serviceMap[serviceKey];
  const select = document.getElementById('serviceType');

  // Update dropdown
  for (const option of select.options) {
    if (option.value === serviceName) {
      select.value = serviceName;
      select.classList.add('has-value');
      break;
    }
  }

  // Highlight active card
  document.querySelectorAll('.service-card').forEach((card) => {
    card.classList.toggle('active', card.dataset.service === serviceKey);
  });

  // Smooth scroll to booking
  document.getElementById('booking').scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Update preview
  updatePreview();
}

// --- LIVE PREVIEW UPDATE ---
function updatePreview() {
  const name = document.getElementById('clientName').value.trim();
  const service = document.getElementById('serviceType').value;
  const dateRaw = document.getElementById('eventDate').value;
  const duration = document.getElementById('eventDuration').value;
  const location = document.getElementById('eventLocation').value.trim();
  const guests = document.getElementById('guestCount').value.trim();
  const notes = document.getElementById('notes').value.trim();

  const preview = document.getElementById('previewBody');
  const previewBox = document.getElementById('messagePreview');

  // Format date to ID locale
  let dateFormatted = '';
  if (dateRaw) {
    const d = new Date(dateRaw + 'T00:00:00');
    dateFormatted = d.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  // Only show preview if we have at least name or service
  if (!name && !service) {
    preview.innerHTML = '<em class="preview-placeholder">Isi form di atas untuk melihat pratinjau pesan...</em>';
    previewBox.classList.remove('has-content');
    return;
  }

  let msg = `Halo, saya *${name || '...'}* ingin menanyakan ketersediaan maewiino untuk:\n\n`;

  if (service)    msg += `*Layanan*     : ${service}\n`;
  if (dateFormatted) msg += `*Tanggal*     : ${dateFormatted}\n`;
  if (duration)   msg += `*Durasi*      : ${duration}\n`;
  if (location)   msg += `*Lokasi*      : ${location}\n`;
  if (guests)     msg += `*Tamu*        : ${guests}\n`;
  if (notes)      msg += `*Catatan*     : ${notes}\n`;

  msg += `\nMohon informasi lebih lanjut mengenai ketersediaan dan harga. Terima kasih.`;

  preview.textContent = msg;
  previewBox.classList.add('has-content');
}

// Attach live listeners to form fields
['clientName', 'serviceType', 'eventDate', 'eventDuration', 'eventLocation', 'guestCount', 'notes']
  .forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', updatePreview);
      el.addEventListener('change', updatePreview);
    }
  });

// Sync service card highlight when dropdown is changed manually
document.getElementById('serviceType').addEventListener('change', function () {
  const valueToKey = {
    'Music Entertainment': 'entertainment',
    'Vocal Only': 'vocal_only',
    'Solo Performance': 'solo_performance',
    'Event Music Direction': 'event'
  };
  const key = valueToKey[this.value];
  document.querySelectorAll('.service-card').forEach((card) => {
    card.classList.toggle('active', card.dataset.service === key);
  });
});

// --- WHATSAPP SENDER ---
function sendToWhatsApp(e) {
  e.preventDefault();

  const name = document.getElementById('clientName').value.trim();
  const service = document.getElementById('serviceType').value;
  const dateRaw = document.getElementById('eventDate').value;
  const duration = document.getElementById('eventDuration').value;
  const location = document.getElementById('eventLocation').value.trim();
  const guests = document.getElementById('guestCount').value.trim();
  const notes = document.getElementById('notes').value.trim();

  // Validation
  if (!name || !service || !duration) {
    alert('Mohon lengkapi setidaknya: Nama, Jenis Layanan, dan Durasi.');
    return;
  }

  // Format date
  let dateFormatted = '';
  if (dateRaw) {
    const d = new Date(dateRaw + 'T00:00:00');
    dateFormatted = d.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  // Build message
  let msg = `Halo, saya *${name}* ingin menanyakan ketersediaan maewiino untuk:\n\n`;

  msg += `*Layanan*     : ${service}\n`;
  if (dateFormatted) msg += `*Tanggal*     : ${dateFormatted}\n`;
  msg += `*Durasi*      : ${duration}\n`;
  if (location) msg += `*Lokasi*      : ${location}\n`;
  if (guests)   msg += `*Tamu*        : ${guests}\n`;
  if (notes)    msg += `*Catatan*     : ${notes}\n`;

  msg += `\nMohon informasi lebih lanjut mengenai ketersediaan dan harga. Terima kasih.`;

  const encoded = encodeURIComponent(msg);
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encoded}`;

  // Open WhatsApp
  window.open(waUrl, '_blank', 'noopener,noreferrer');

  // Button feedback
  const btn = document.getElementById('submitBtn');
  const origText = btn.innerHTML;
  btn.innerHTML = `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
    Berhasil! WhatsApp dibuka
  `;
  btn.style.background = '#1ebe5d';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = origText;
    btn.style.background = '';
    btn.disabled = false;
  }, 4000);
}

// --- SMOOTH ANCHOR LINKS ---
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
