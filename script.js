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
    title: "Outra vez",
    cover: "outra-vez.png",
    spotify: "https://open.spotify.com/track/4g1iCX2CfoFGtYMHF86ImB?si=kL_rW0rSQwaAlpIrx2PdcQ&utm_source=copy-link",
    youtube: "https://youtu.be/5ODaP4HQ1DE?is=AHqh8y1lWu06Ii-A"
  },
  {
    title: "Clareza",
    cover: "clareza.png",
    spotify: "https://open.spotify.com/",
    youtube: "https://youtu.be/4IWZqd3GLEw?is=yi41yPyaUNoA6jjS"
  },
];

// Coloque seu número com código do país e DDD, somente números.
// Exemplo: 5511999999999
const WHATSAPP_NUMBER = "5585999789037";

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
        <img
          src="${escapeHTML(track.cover)}"
          alt="Capa de ${escapeHTML(track.title)}"
          loading="eager"
          onerror="this.style.display='none'; this.nextElementSibling.hidden=false"
        >
        <div class="track-cover-fallback" hidden>
          ${escapeHTML(track.title)}
        </div>
      </div>

      <div class="track-meta">
        <h3>${escapeHTML(track.title)}</h3>
        <p>Victor Manoel · Faixa ${String(index + 1).padStart(2, "0")}</p>
      </div>

      <div class="track-platforms">

        <a
          class="platform-button spotify-button"
          href="${safeURL(track.spotify)}"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>♫</span> Spotify <span>↗</span>
        </a>

        <a
          class="platform-button youtube-button"
          href="${safeURL(track.youtube)}"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>▶</span> YouTube <span>↗</span>
        </a>

      </div>
    </article>
  `).join("");

  trackCount.textContent =
    `${String(TRACKS.length).padStart(2, "0")} ${TRACKS.length === 1 ? "FAIXA" : "FAIXAS"}`;
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


/* =====================================
   ASSISTENTE VIRTUAL - VICTOR MANOEL
   Sistema de conversação local
===================================== */

const chatLauncher = document.getElementById("chatLauncher");
const chatPanel = document.getElementById("chatPanel");
const chatClose = document.getElementById("chatClose");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");
const chatTyping = document.getElementById("chatTyping");

/* ABRIR E FECHAR O ASSISTENTE */

function setChatOpen(open) {
  chatPanel.classList.toggle("open", open);
  chatPanel.setAttribute("aria-hidden", String(!open));
  chatLauncher.setAttribute("aria-expanded", String(open));

  if (open) {
    chatInput.focus();
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

chatLauncher.addEventListener("click", () => {
  setChatOpen(!chatPanel.classList.contains("open"));
});

chatClose.addEventListener("click", () => {
  setChatOpen(false);
});

/* FECHAR COM A TECLA ESC */

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && chatPanel.classList.contains("open")) {
    setChatOpen(false);
  }
});

/* ADICIONAR MENSAGENS */

function addChatMessage(message, type, links = []) {
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${type}`;

  bubble.appendChild(document.createTextNode(message));

  links.forEach(link => {
    const anchor = document.createElement("a");

    anchor.href = link.url;
    anchor.textContent = link.label;
    anchor.className = "chat-inline-link";
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";

    bubble.appendChild(document.createElement("br"));
    bubble.appendChild(anchor);
  });

  const time = document.createElement("small");
  time.className = "chat-time";
  time.textContent = new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  });

  bubble.appendChild(time);

  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/* NORMALIZAR TEXTO */

function normalizeChatText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* ESCOLHER UMA RESPOSTA */

function randomChatResponse(responses) {
  return responses[Math.floor(Math.random() * responses.length)];
}

/* CÉREBRO DO ASSISTENTE */

function getAssistantResponse(message) {
  const text = normalizeChatText(message);

  /* CUMPRIMENTOS */

  if (/^(oi|ola|opa|eai|e ae|bom dia|boa tarde|boa noite|tudo bem)(\s|$)/.test(text)) {
    return {
      text: randomChatResponse([
        "Olá! 👋 Que bom ter você por aqui! Como posso ajudar?",
        "Oi! Seja muito bem-vindo! 💙 O que gostaria de saber sobre Victor Manoel?",
        "Olá! Tudo bem por aí? Estou aqui para apresentar o universo musical de Victor Manoel. 🎵",
        "Opa! Seja bem-vindo! É um prazer receber sua visita. Como posso ajudar?"
      ])
    };
  }

  /* AGRADECIMENTOS */

  if (/obrigad|valeu|agradeco|muito bom/.test(text)) {
    return {
      text: randomChatResponse([
        "Por nada! 💙 Sempre que precisar, estarei por aqui.",
        "Eu que agradeço pela visita! Continue acompanhando Victor Manoel. 🎵",
        "Disponha! Foi um prazer conversar com você. 😊"
      ])
    };
  }

  /* DESPEDIDAS */

  if (/^(tchau|ate mais|ate logo|falou|fui|adeus)/.test(text)) {
    return {
      text: randomChatResponse([
        "Até mais! Obrigado pela visita e volte sempre! 💙",
        "Foi um prazer conversar com você. Até a próxima! 👋",
        "Até logo! Continue acompanhando as novidades de Victor Manoel! 🎵"
      ])
    };
  }

  /* ILLUSION NIGHT */

  if (/illusion night|illusion/.test(text)) {
    return {
      text: "Illusion Night é uma das faixas de Victor Manoel, com uma proposta de trap romântico. 🌙🎵 Você pode ouvir e conhecer a música nas plataformas:",
      links: [
        {
          label: "♫ Ouvir no Spotify",
          url: "https://open.spotify.com/track/7tOMT5ILp9bTSTAocKAeuq?si=UAGIoZwLQuW4EJ9t8Rz7RA&utm_source=copy-link"
        },
        {
          label: "▶ Assistir no YouTube",
          url: "https://youtu.be/qa1r3WlA-FM?is=PTj3X9MfieUGmblg"
        }
      ]
    };
  }

  /* HISTÓRIA E IDENTIDADE DO ARTISTA */

  if (
    /quem e|historia|trajetoria|sobre o artista|sobre victor|biografia|me conta sobre|fale sobre/.test(text)
  ) {
    return {
      text: "Victor Manoel é um artista independente e compositor que transforma sentimentos, ideias e experiências em música. 💙\n\nSua identidade musical explora diferentes sonoridades, passando pelo rap, hip-hop e trap romântico.\n\nSua trajetória reúne trabalhos como Illusion Night, Outra Vez, Meu Porto e Stay With Me Tonight. Cada composição representa uma parte de sua evolução artística.\n\nA proposta é continuar criando, experimentando e compartilhando histórias por meio da música. 🎶"
    };
  }

  /* ÚLTIMOS LANÇAMENTOS */

  if (/ultim|lancamento|novidade|novidades|musica nova|proximo lancamento|novas musicas/.test(text)) {
    return {
      text: "Para acompanhar os lançamentos e novidades de Victor Manoel, fique de olho em seus canais e plataformas digitais! 💙\n\nAssim você poderá conhecer os próximos trabalhos, novidades musicais e futuras estreias.\n\nConfira também Illusion Night:",
      links: [
        {
          label: "♫ Spotify",
          url: "https://open.spotify.com/track/7tOMT5ILp9bTSTAocKAeuq?si=UAGIoZwLQuW4EJ9t8Rz7RA&utm_source=copy-link"
        },
        {
          label: "▶ YouTube",
          url: "https://youtu.be/qa1r3WlA-FM?is=PTj3X9MfieUGmblg"
        }
      ]
    };
  }

  /* DISCOGRAFIA E MÚSICAS */

  if (/discografia|musicas|cancoes|faixas|repertorio|quais musicas|nome das musicas/.test(text)) {
    return {
      text: "Victor Manoel possui trabalhos que representam diferentes fases de sua trajetória musical. 🎵\n\nEntre os títulos apresentados no site estão:\n\n• Illusion Night\n• Outra Vez\n• Meu Porto\n• Stay With Me Tonight\n\nVocê pode explorar a seção de músicas para conhecer os trabalhos disponíveis."
    };
  }

  /* GÊNEROS MUSICAIS */

  if (/genero|estilo musical|tipo de musica|rap|hip hop|trap/.test(text)) {
    return {
      text: "A identidade musical de Victor Manoel transita entre o rap, o hip-hop e o trap romântico. 🎧\n\nSuas composições exploram sentimentos, ideias e diferentes atmosferas musicais."
    };
  }

  /* SPOTIFY */

  if (/spotify/.test(text)) {
    return {
      text: "Você pode ouvir Illusion Night diretamente no Spotify! 💙",
      links: [
        {
          label: "♫ Ouvir Illusion Night no Spotify",
          url: "https://open.spotify.com/track/7tOMT5ILp9bTSTAocKAeuq?si=UAGIoZwLQuW4EJ9t8Rz7RA&utm_source=copy-link"
        }
      ]
    };
  }

  /* YOUTUBE */

  if (/youtube|video|videoclipe|assistir/.test(text)) {
    return {
      text: "Você pode acompanhar Illusion Night pelo YouTube! ▶🎵",
      links: [
        {
          label: "Assistir no YouTube",
          url: "https://youtu.be/qa1r3WlA-FM?is=PTj3X9MfieUGmblg"
        }
      ]
    };
  }

  /* CONTATO */

  if (/contato|conversar com|falar com|proposta|parceria/.test(text)) {
    return {
      text: "Que bom saber do seu interesse! 💙\n\nPara assuntos profissionais, propostas ou parcerias, visite a seção Contato do site de Victor Manoel. Lá você encontra as informações disponíveis para entrar em contato."
    };
  }

  /* RESPOSTA PADRÃO */

  return {
    text: randomChatResponse([
      "Interessante! 😊 Ainda não tenho uma resposta específica para essa pergunta, mas posso ajudar com informações sobre a história, as músicas e os lançamentos de Victor Manoel.",
      "Hmm, quero te ajudar com isso! 💙 Você pode me perguntar sobre Victor Manoel, sua trajetória musical, Illusion Night ou suas plataformas digitais.",
      "Obrigado pela pergunta! Ainda estou aprendendo a responder sobre esse assunto. Que tal conversarmos sobre as músicas e a história de Victor Manoel? 🎵",
      "Não encontrei essa informação no meu conhecimento atual. Mas posso contar sobre o artista, sua identidade musical e seus trabalhos!"
    ])
  };
}

/* RECEBER E RESPONDER ÀS MENSAGENS */

chatForm.addEventListener("submit", event => {
  event.preventDefault();

  const message = chatInput.value.trim();

  if (!message) return;

  addChatMessage(message, "user");
  chatInput.value = "";

  chatInput.disabled = true;
  chatForm.querySelector("button").disabled = true;

  if (chatTyping) {
    chatTyping.hidden = false;
  }

  chatMessages.scrollTop = chatMessages.scrollHeight;

  const response = getAssistantResponse(message);

  setTimeout(() => {
    if (chatTyping) {
      chatTyping.hidden = true;
    }

    addChatMessage(response.text, "bot", response.links || []);

    chatInput.disabled = false;
    chatForm.querySelector("button").disabled = false;
    chatInput.focus();

  }, 750 + Math.random() * 650);
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




/* ==================================
   VICTOR MANOEL - MUSIC PLAYER
================================== */

const musicAudio = document.getElementById("musicAudio");
const musicPlayer = document.querySelector(".music-player");

if (musicAudio && musicPlayer) {

  const playerCover = document.getElementById("playerCover");
  const playerTitle = document.getElementById("playerTitle");
  const playerArtist = document.getElementById("playerArtist");

  const playButton = document.getElementById("playButton");
  const previousButton = document.getElementById("previousButton");
  const nextButton = document.getElementById("nextButton");
  const shuffleButton = document.getElementById("shuffleButton");
  const repeatButton = document.getElementById("repeatButton");

  const progressBar = document.getElementById("progressBar");
  const volumeBar = document.getElementById("volumeBar");

  const currentTimeDisplay = document.getElementById("currentTime");
  const durationDisplay = document.getElementById("duration");

  const playlistToggle = document.getElementById("playlistToggle");
  const playlistPanel = document.getElementById("playlistPanel");
  const playlistItems = document.getElementById("playlistItems");
  const playlistCount = document.getElementById("playlistCount");

  // CADASTRO DAS MÚSICAS
  // Adicione novas músicas seguindo este modelo.

  const playerTracks = [
    {
      title: "Illusion Night",
      artist: "Victor Manoel",
      cover: "imagesillusion-night.png",
      audio: "audioillusion-night.mp3"
    },
    {
      title: "Outra Vez",
      artist: "Victor Manoel",
      cover: "outravezplayer.png",
      audio: "audiooutravez.mp3"
    },
    {
      title: "Clareza",
      artist: "Victor Manoel",
      cover: "clarezaplayer.png",
      audio: "audioclareza.mp3"
    }
  ];

  let currentTrack = 0;
  let isShuffle = false;
  let isRepeat = false;

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  function renderPlaylist() {
    playlistItems.innerHTML = "";

    playerTracks.forEach((track, index) => {
      const item = document.createElement("button");

      item.type = "button";
      item.className = "playlist-track";

      item.innerHTML = `
        <img src="${track.cover}" alt="">
        <span class="playlist-track-info">
          <strong>${track.title}</strong>
          <small>${track.artist}</small>
        </span>
        <i class="fa-solid fa-play"></i>
      `;

      item.addEventListener("click", () => {
        loadTrack(index);
        playTrack();
      });

      playlistItems.appendChild(item);
    });

    playlistCount.textContent =
      `${String(playerTracks.length).padStart(2, "0")} FAIXAS`;

    updatePlaylist();
  }

  function updatePlaylist() {
    const items = playlistItems.querySelectorAll(".playlist-track");

    items.forEach((item, index) => {
      item.classList.toggle("active", index === currentTrack);

      const icon = item.querySelector("i");

      icon.className =
        index === currentTrack && !musicAudio.paused
          ? "fa-solid fa-volume-high"
          : "fa-solid fa-play";
    });
  }

  function loadTrack(index) {
    if (!playerTracks.length) return;

    currentTrack = (index + playerTracks.length) % playerTracks.length;

    const track = playerTracks[currentTrack];

    musicAudio.src = track.audio;
    playerCover.src = track.cover;
    playerTitle.textContent = track.title;
    playerArtist.textContent = track.artist;

    progressBar.value = 0;
    currentTimeDisplay.textContent = "0:00";
    durationDisplay.textContent = "0:00";

    updatePlaylist();
  }

  async function playTrack() {
    try {
      await musicAudio.play();

      musicPlayer.classList.add("is-playing");

      playButton.innerHTML = '<i class="fa-solid fa-pause"></i>';
      playButton.setAttribute("aria-label", "Pausar");

      updatePlaylist();
    } catch (error) {
      console.error("Não foi possível reproduzir a música:", error);
    }
  }

  function pauseTrack() {
    musicAudio.pause();

    musicPlayer.classList.remove("is-playing");

    playButton.innerHTML = '<i class="fa-solid fa-play"></i>';
    playButton.setAttribute("aria-label", "Reproduzir");

    updatePlaylist();
  }

  playButton.addEventListener("click", () => {
    if (musicAudio.paused) {
      playTrack();
    } else {
      pauseTrack();
    }
  });

  function nextTrack() {
    if (isShuffle && playerTracks.length > 1) {
      let nextIndex;

      do {
        nextIndex = Math.floor(Math.random() * playerTracks.length);
      } while (nextIndex === currentTrack);

      loadTrack(nextIndex);
    } else {
      loadTrack(currentTrack + 1);
    }

    playTrack();
  }

  function previousTrack() {
    if (musicAudio.currentTime > 3) {
      musicAudio.currentTime = 0;
      return;
    }

    loadTrack(currentTrack - 1);
    playTrack();
  }

  nextButton.addEventListener("click", nextTrack);
  previousButton.addEventListener("click", previousTrack);

  shuffleButton.addEventListener("click", () => {
    isShuffle = !isShuffle;
    shuffleButton.classList.toggle("active", isShuffle);
    shuffleButton.style.color = isShuffle ? "#4da5ff" : "";
  });

  repeatButton.addEventListener("click", () => {
    isRepeat = !isRepeat;
    musicAudio.loop = isRepeat;

    repeatButton.style.color = isRepeat ? "#4da5ff" : "";
  });

  musicAudio.addEventListener("timeupdate", () => {
    if (!musicAudio.duration) return;

    progressBar.value =
      (musicAudio.currentTime / musicAudio.duration) * 100;

    currentTimeDisplay.textContent =
      formatTime(musicAudio.currentTime);
  });

  musicAudio.addEventListener("loadedmetadata", () => {
    durationDisplay.textContent =
      formatTime(musicAudio.duration);
  });

  progressBar.addEventListener("input", () => {
    if (!musicAudio.duration) return;

    musicAudio.currentTime =
      (progressBar.value / 100) * musicAudio.duration;
  });

  volumeBar.addEventListener("input", () => {
    musicAudio.volume = volumeBar.value / 100;
  });

  musicAudio.volume = volumeBar.value / 100;

  musicAudio.addEventListener("ended", () => {
    if (!isRepeat) {
      nextTrack();
    }
  });

  musicAudio.addEventListener("play", () => {
    musicPlayer.classList.add("is-playing");
    playButton.innerHTML = '<i class="fa-solid fa-pause"></i>';
    updatePlaylist();
  });

  musicAudio.addEventListener("pause", () => {
    musicPlayer.classList.remove("is-playing");
    playButton.innerHTML = '<i class="fa-solid fa-play"></i>';
    updatePlaylist();
  });

  playlistToggle.addEventListener("click", () => {
    const isOpen = playlistPanel.classList.toggle("open");

    playlistToggle.setAttribute("aria-expanded", String(isOpen));
    playlistToggle.innerHTML = isOpen
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });

  renderPlaylist();
  loadTrack(0);
}
