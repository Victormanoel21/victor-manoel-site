
const firebaseConfig = {
    apiKey: "AIzaSyCDBcbxZHA7IVqofLLQSciYTisCzygyFnI",
    authDomain: "victor-manoel.firebaseapp.com",
    projectId: "victor-manoel",
    storageBucket: "victor-manoel.firebasestorage.app",
    messagingSenderId: "393152158053",
    appId: "1:393152158053:web:0766aba4b948ef2702298c",
    measurementId: "G-EB2R0XXD5V"
};

// Inicialização do Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

// Manter a sessão do usuário
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .catch(error => {
        console.error("Erro ao configurar sessão:", error);
    });

// Elementos
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const message = document.getElementById("message");
const togglePassword = document.getElementById("togglePassword");
const forgotPassword = document.getElementById("forgotPassword");

// Destino após autenticação
const SITE_URL = "index.html";

// Mostrar ou esconder senha
togglePassword.addEventListener("click", () => {
    const hidden = passwordInput.type === "password";

    passwordInput.type = hidden ? "text" : "password";
    togglePassword.textContent = hidden ? "Ocultar" : "Mostrar";
});

// Login
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const button = loginForm.querySelector(".login-button");

    message.textContent = "";
    button.disabled = true;
    button.textContent = "Autenticando...";

    try {
        // Garantir que a persistência esteja configurada
        await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

        // Autenticar usuário
        await auth.signInWithEmailAndPassword(email, password);

        message.style.color = "#a8ffbd";
        message.textContent = "Acesso autorizado!";

        window.location.href = SITE_URL;

    } catch (error) {
        message.style.color = "#ff8b9b";

        const errors = {
            "auth/invalid-email": "Digite um e-mail válido.",
            "auth/user-not-found": "Conta não encontrada.",
            "auth/wrong-password": "Senha incorreta.",
            "auth/invalid-credential": "E-mail ou senha incorretos.",
            "auth/too-many-requests": "Muitas tentativas. Aguarde um pouco.",
            "auth/network-request-failed": "Verifique sua conexão com a internet."
        };

        message.textContent =
            errors[error.code] || "Não foi possível entrar. Verifique seus dados.";

        button.disabled = false;
        button.textContent = "Entrar na conta";
    }
});

// Recuperação de senha
forgotPassword.addEventListener("click", async () => {
    const email = emailInput.value.trim();

    if (!email) {
        message.textContent = "Digite seu e-mail primeiro.";
        emailInput.focus();
        return;
    }

    try {
        await auth.sendPasswordResetEmail(email);

        message.style.color = "#a8ffbd";
        message.textContent = "Enviamos um link para redefinir sua senha.";

    } catch (error) {
        message.style.color = "#ff8b9b";
        message.textContent = "Não foi possível enviar o e-mail de recuperação.";

        console.error("Erro na recuperação:", error);
    }
});

// Efeito de chuva digital
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

let width;
let height;
let drops;

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

    drops = Array(Math.floor(width / 18)).fill(1);
}

const characters = "01アイウエオカキクケコ";

function drawMatrix() {
    ctx.fillStyle = "rgba(9, 5, 17, 0.09)";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#a34bff";
    ctx.font = "14px monospace";

    drops.forEach((drop, index) => {
        const character = characters[
            Math.floor(Math.random() * characters.length)
        ];

        ctx.fillText(character, index * 18, drop * 18);

        if (drop * 18 > height && Math.random() > 0.975) {
            drops[index] = 0;
        }

        drops[index]++;
    });
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

setInterval(drawMatrix, 55);
