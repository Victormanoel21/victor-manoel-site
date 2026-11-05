/* =========================================================
   VICTOR MANUEL — CONFIGURAÇÕES DO SITE
   Edite links, músicas e integrações nesta área.
   ========================================================= */

// Adicione ou remova músicas. Para cada faixa, informe a capa e os links.
const TRACKS = [
  {
    title: "Illusion Night",
    cover: "Illusion-night.png",
    spotify: "https://open.spotify.com/track/7tOMT5ILp9bTSTAocKAeuq?si=UAGIoZwLQuW4EJ9t8Rz7RA&utm_source=copy-link",
    youtube: "https://youtu.be/qa1r3WlA-FM?is=PTj3X9MfieUGmblg"
  },
  {
    title: "Illusion Night",
    cover: "cover-illusion-night.png",
    spotify: "https://open.spotify.com/",
    youtube: "https://www.youtube.com/"
  }
];

// Coloque seu número com código do país e DDD, somente números.
// Exemplo: 5511999999999
const WHATSAPP_NUMBER = "5500000000000";

// Integrações opcionais: informe URLs de um backend/serviço que receba os dados.
// Sem esses endereços, o formulário e o chat ficam em modo de demonstração.
const CONTACT_ENDPOINT = ""; // Ex.: https://seusite.com/api/contact
const CHAT_ENDPOINT = "";    // Ex.: wss://seusite.com/chat ou endpoint HTTP configurado no servidor

const musicGrid = document.getElementById("musicGrid");
const trackCount = document.getElementById("trackCount");

function renderTracks() {
  musicGrid.innerHTML = TRACKS.map((track, index) => `
    <article class="track-card">
      <div class="track-cover">
        <img src="${escapeHTML(track.cover)}" alt="Capa de ${escapeHTML(track.title)}"
             onerror="this.style.display='none'; this.nextElementSibling.hidden=false">
        <div class="track-cover-fallback" hidden>${escapeHTML(track.title)}</div>
      </div>
      <div class="track-meta">
        <h3>${escapeHTML(track.title)}</h3>
        <p>Victor Manuel · Faixa ${String(index + 1).padStart(2, "0")}</p>
      </div>
      <div class="track-platforms">
        <a href="${safeURL(track.spotify)}" target="_blank" rel="noopener noreferrer">Spotify ↗</a>
        <a href="${safeURL(track.youtube)}" target="_blank" rel="noopener noreferrer">YouTube ↗</a>
      </div>
    </article>
  `).join("");
  trackCount.textContent = `${String(TRACKS.length).padStart(2, "0")} ${TRACKS.length === 1 ? "FAIXA" : "FAIXAS"}`;
}

// Evita inserir conteúdo não confiável como HTML.
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
}
function safeURL(value) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? escapeHTML(url.href) : "#";
  } catch { return "#"; }
}

renderTracks();
document.getElementById("year").textContent = new Date().getFullYear();

// Menu mobile
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.textContent = open ? "×" : "☰";
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.textContent = "☰";
}));

// Navegação destaca a seção visível
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-link");
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
    }
  });
}, { threshold: 0.35 });
sections.forEach(section => sectionObserver.observe(section));

// Animação de entrada ao rolar
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// WhatsApp: atualize WHATSAPP_NUMBER no início deste arquivo.
const whatsappLink = document.getElementById("whatsappLink");
whatsappLink.href = `https://wa.me/${WHATSAPP_NUMBER}`;

// Campo de anexo
const attachment = document.getElementById("attachment");
const fileHint = document.getElementById("fileHint");
attachment.addEventListener("change", () => {
  fileHint.textContent = attachment.files[0]
    ? `${attachment.files[0].name} (${(attachment.files[0].size / 1024 / 1024).toFixed(2)} MB)`
    : "Selecionar arquivo (opcional)";
});

// Formulário de contato. O servidor deve aceitar multipart/form-data para receber anexos.
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
contactForm.addEventListener("submit", async event => {
  event.preventDefault();
  if (!CONTACT_ENDPOINT) {
    formStatus.textContent = "Demonstração: seus dados ainda não foram enviados. Configure CONTACT_ENDPOINT no script.js e conecte um serviço/backend para receber mensagens e anexos.";
    return;
  }
  const submitButton = contactForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = "Enviando...";
  try {
    const response = await fetch(CONTACT_ENDPOINT, { method: "POST", body: new FormData(contactForm) });
    if (!response.ok) throw new Error("Falha no envio");
    formStatus.textContent = "Mensagem enviada! Obrigado por entrar em contato. ✨";
    contactForm.reset();
    fileHint.textContent = "Selecionar arquivo (opcional)";
  } catch {
    formStatus.textContent = "Não foi possível enviar agora. Verifique a conexão e a configuração do serviço de contato.";
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Enviar mensagem <span>↗</span>';
  }
});

// Janela de chat. Para atendimento real, conecte CHAT_ENDPOINT a um backend
// com autenticação, armazenamento e entrega das mensagens em tempo real.
const chatLauncher = document.getElementById("chatLauncher");
const chatPanel = document.getElementById("chatPanel");
const chatClose = document.getElementById("chatClose");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");
const chatStatus = document.getElementById("chatStatus");

function setChatOpen(open) {
  chatPanel.classList.toggle("open", open);
  chatPanel.setAttribute("aria-hidden", String(!open));
  if (open) chatInput.focus();
}
chatLauncher.addEventListener("click", () => setChatOpen(!chatPanel.classList.contains("open")));
chatClose.addEventListener("click", () => setChatOpen(false));

function addChatMessage(message, type) {
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${type}`;
  bubble.textContent = message;
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatForm.addEventListener("submit", async event => {
  event.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;
  addChatMessage(message, "user");
  chatInput.value = "";

  if (!CHAT_ENDPOINT) {
    chatStatus.textContent = "Mensagem exibida apenas nesta demonstração. Configure CHAT_ENDPOINT para receber mensagens de verdade.";
    addChatMessage("Sua mensagem apareceu aqui, mas o atendimento ainda não está conectado. Você também pode me chamar pelo WhatsApp. 💬", "bot");
    return;
  }

  try {
    const response = await fetch(CHAT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, sentAt: new Date().toISOString() })
    });
    if (!response.ok) throw new Error("Falha no chat");
    chatStatus.textContent = "Mensagem enviada ao serviço de atendimento.";
    addChatMessage("Mensagem enviada! Obrigado por falar comigo. ✨", "bot");
  } catch {
    chatStatus.textContent = "Não foi possível enviar. Tente novamente mais tarde.";
    addChatMessage("Ops! Não consegui enviar sua mensagem agora. Tente pelo WhatsApp.", "bot");
  }
});


// Registro do Service Worker (PWA)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then(registration => {
        console.log("PWA ativado!", registration.scope);
      })
      .catch(error => {
        console.error("Erro ao registrar o PWA:", error);
      });
  });
}
