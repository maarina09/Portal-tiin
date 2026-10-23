// ── ELEMENTOS ──
const themeToggle = document.getElementById('themeToggle');
const themeLabel = document.getElementById('themeLabel');
const styleBtn = document.getElementById('styleBtn');
const stylePanel = document.getElementById('stylePanel');
const colorOpts = document.querySelectorAll('.color-opt');
const fontSelect = document.getElementById('fontSelect');
const customColorPicker = document.getElementById('customColorPicker');
const customColorContainer = document.getElementById('customColorContainer');
const cursor = document.getElementById('cursor');
const cursorOutline = document.getElementById('cursorOutline');

// ── CURSOR PERSONALIZADO ──
if (window.innerWidth > 768) {
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    // Delay suave para o outline
    setTimeout(() => {
      cursorOutline.style.left = e.clientX + 'px';
      cursorOutline.style.top = e.clientY + 'px';
    }, 50);
  });

  const interactiveElements = document.querySelectorAll('a, button, .color-opt, .cbx, select, input');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-hover');
      cursorOutline.classList.add('cursor-outline-hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover');
      cursorOutline.classList.remove('cursor-outline-hover');
    });
  });
}

// ── ESTADO INICIAL / LOCALSTORAGE ──
const config = JSON.parse(localStorage.getItem('portfolio-style-config')) || {
  theme: 'dark',
  primaryColor: '#2f80ff',
  fontFamily: "'Syne', sans-serif"
};

// ── APLICAR CONFIGURAÇÃO INICIAL ──
function applyConfig() {
  // Tema
  if (config.theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    themeToggle.checked = true;
    themeLabel.innerText = 'Modo Escuro';
  } else {
    document.documentElement.removeAttribute('data-theme');
    themeToggle.checked = false;
    themeLabel.innerText = 'Modo Claro';
  }

  // Cor Principal
  document.documentElement.style.setProperty('--primary-color', config.primaryColor);
  document.documentElement.style.setProperty('--accent', config.primaryColor);
  document.documentElement.style.setProperty('--glow-color', `${config.primaryColor}26`); // 15% opacity
  
  // Marcar botão de cor ativo
  colorOpts.forEach(opt => {
    opt.classList.remove('active');
    if (opt.dataset.color === config.primaryColor) {
      opt.classList.add('active');
    } else if (opt.dataset.color === 'custom' && !['#2f80ff', '#10b981', '#ef4444', '#8b5cf6', '#f59e0b'].includes(config.primaryColor)) {
      opt.classList.add('active');
      customColorContainer.style.display = 'flex';
      customColorPicker.value = config.primaryColor;
    }
  });

  // Fonte
  document.documentElement.style.setProperty('--main-font', config.fontFamily);
  fontSelect.value = config.fontFamily;
}

function saveConfig() {
  localStorage.setItem('portfolio-style-config', JSON.stringify(config));
}

// ── EVENTOS ──

// Alternar Painel
styleBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  stylePanel.classList.toggle('active');
});

document.addEventListener('click', (e) => {
  if (!stylePanel.contains(e.target) && e.target !== styleBtn) {
    stylePanel.classList.remove('active');
  }
});

// Tema
themeToggle.addEventListener('change', () => {
  if (themeToggle.checked) {
    document.documentElement.setAttribute('data-theme', 'light');
    themeLabel.innerText = 'Modo Escuro';
    config.theme = 'light';
  } else {
    document.documentElement.removeAttribute('data-theme');
    themeLabel.innerText = 'Modo Claro';
    config.theme = 'dark';
  }
  saveConfig();
});

// Cores
colorOpts.forEach(opt => {
  opt.addEventListener('click', () => {
    const color = opt.dataset.color;
    
    colorOpts.forEach(o => o.classList.remove('active'));
    opt.classList.add('active');

    if (color === 'custom') {
      customColorContainer.style.display = 'flex';
      updatePrimaryColor(customColorPicker.value);
    } else {
      customColorContainer.style.display = 'none';
      updatePrimaryColor(color);
    }
  });
});

customColorPicker.addEventListener('input', (e) => {
  updatePrimaryColor(e.target.value);
});

function updatePrimaryColor(color) {
  config.primaryColor = color;
  document.documentElement.style.setProperty('--primary-color', color);
  document.documentElement.style.setProperty('--accent', color);
  document.documentElement.style.setProperty('--glow-color', `${color}26`);
  saveConfig();
}

// Tipografia
fontSelect.addEventListener('change', (e) => {
  const font = e.target.value;
  config.fontFamily = font;
  document.documentElement.style.setProperty('--main-font', font);
  saveConfig();
});

// Efeito dinâmico nos cards (Hover Glow)
const cards = document.querySelectorAll('.glow-card');
cards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});

// Animação de entrada (Fade-in ao scrollar)
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.05 });
reveals.forEach(el => observer.observe(el));

// Inicializar preferências do Usuário
applyConfig();





