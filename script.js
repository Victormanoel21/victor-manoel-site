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
        <img
          src="${escapeHTML(track.cover)}"
          alt="Capa de ${escapeHTML(track.title)}"
          loading="lazy"
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

// CONTROLES DO VIDEOCLIP - VICTOR MANOEL

let youtubePlayer;

const videoStatus = document.getElementById("videoStatus");
const playPauseButton = document.getElementById("playPauseButton");
const stopButton = document.getElementById("stopButton");
const backButton = document.getElementById("backButton");
const forwardButton = document.getElementById("forwardButton");
const muteButton = document.getElementById("muteButton");
const volumeSlider = document.getElementById("volumeSlider");
const volumeValue = document.getElementById("volumeValue");

// Carrega a API oficial do YouTube
const youtubeScript = document.createElement("script");
youtubeScript.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(youtubeScript);

// O YouTube chama esta função quando a API estiver pronta
window.onYouTubeIframeAPIReady = function () {

  youtubePlayer = new YT.Player("youtubePlayer", {
    width: "100%",
    height: "100%",
    videoId: "qa1r3WlA-FM",

    playerVars: {
      playsinline: 1,
      rel: 0
    },

    events: {
      onReady: function () {
        videoStatus.textContent = "Illusion Night está pronto para reprodução.";
        youtubePlayer.setVolume(100);
      },

      onStateChange: function (event) {

        if (event.data === YT.PlayerState.PLAYING) {
          playPauseButton.textContent = "⏸";
          videoStatus.textContent = "Reproduzindo Illusion Night";
        }

        else if (event.data === YT.PlayerState.PAUSED) {
          playPauseButton.textContent = "▶";
          videoStatus.textContent = "Vídeo pausado";
        }

        else if (event.data === YT.PlayerState.ENDED) {
          playPauseButton.textContent = "▶";
          videoStatus.textContent = "Videoclipe finalizado";
        }

        else if (event.data === YT.PlayerState.BUFFERING) {
          videoStatus.textContent = "Carregando vídeo...";
        }
      },

      onError: function () {
        videoStatus.textContent = "Não foi possível carregar o vídeo.";
      }
    }
  });
};

// Reproduzir e pausar
playPauseButton.addEventListener("click", function () {

  if (!youtubePlayer || !youtubePlayer.getPlayerState) return;

  const state = youtubePlayer.getPlayerState();

  if (state === YT.PlayerState.PLAYING) {
    youtubePlayer.pauseVideo();
  } else {
    youtubePlayer.playVideo();
  }
});

// Parar vídeo
stopButton.addEventListener("click", function () {
  if (youtubePlayer) {
    youtubePlayer.stopVideo();
    playPauseButton.textContent = "▶";
    videoStatus.textContent = "Vídeo parado";
  }
});

// Voltar 10 segundos
backButton.addEventListener("click", function () {
  if (youtubePlayer && youtubePlayer.getCurrentTime) {
    const time = Math.max(0, youtubePlayer.getCurrentTime() - 10);
    youtubePlayer.seekTo(time, true);
  }
});

// Avançar 10 segundos
forwardButton.addEventListener("click", function () {
  if (youtubePlayer && youtubePlayer.getCurrentTime) {
    const time = youtubePlayer.getCurrentTime() + 10;
    youtubePlayer.seekTo(time, true);
  }
});

// Ativar ou desativar áudio
muteButton.addEventListener("click", function () {

  if (!youtubePlayer) return;

  if (youtubePlayer.isMuted()) {
    youtubePlayer.unMute();
    muteButton.textContent = "🔊";
  } else {
    youtubePlayer.mute();
    muteButton.textContent = "🔇";
  }
});

// Controle de volume
volumeSlider.addEventListener("input", function () {

  const volume = Number(volumeSlider.value);

  if (youtubePlayer) {
    youtubePlayer.setVolume(volume);

    if (volume === 0) {
      youtubePlayer.mute();
      muteButton.textContent = "🔇";
    } else {
      youtubePlayer.unMute();
      muteButton.textContent = "🔊";
    }
  }

  volumeValue.textContent = volume + "%";
});


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
