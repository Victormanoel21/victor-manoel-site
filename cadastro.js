
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
const db = firebase.firestore();

// Elementos do perfil
const profileMenu = document.getElementById("profileMenu");
const profileTrigger = document.getElementById("profileTrigger");
const profileDropdown = document.getElementById("profileDropdown");

const profileName = document.getElementById("profileName");
const dropdownName = document.getElementById("dropdownName");
const profileEmail = document.getElementById("profileEmail");
const logoutButton = document.getElementById("logoutButton");

// Verificar usuário conectado
auth.onAuthStateChanged(async (user) => {
    if (user) {
        profileMenu.hidden = false;

        try {
            // Buscar dados do usuário no Firestore
            const userDoc = await db
                .collection("usuarios")
                .doc(user.uid)
                .get();

            let nome = user.displayName || "Minha conta";
            let email = user.email || "";

            if (userDoc.exists) {
                const dados = userDoc.data();

                nome = dados.nome || nome;
                email = dados.email || email;
            }

            // Mostrar nome e e-mail
            profileName.textContent = nome;
            dropdownName.textContent = nome;
            profileEmail.textContent = email;

        } catch (error) {
            console.error("Erro ao carregar perfil:", error);

            profileName.textContent = user.displayName || "Minha conta";
            dropdownName.textContent = user.displayName || "Minha conta";
            profileEmail.textContent = user.email || "";
        }

    } else {
        profileMenu.hidden = true;
        profileDropdown.hidden = true;
    }
});

// Abrir e fechar o menu
profileTrigger.addEventListener("click", () => {
    profileDropdown.hidden = !profileDropdown.hidden;
});

// Fechar ao clicar fora do perfil
document.addEventListener("click", (event) => {
    if (!profileMenu.contains(event.target)) {
        profileDropdown.hidden = true;
    }
});

// Fechar com a tecla ESC
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        profileDropdown.hidden = true;
    }
});

// Sair da conta
logoutButton.addEventListener("click", async () => {
    try {
        await auth.signOut();
        window.location.href = "login.html";

    } catch (error) {
        alert("Não foi possível sair da conta. Tente novamente.");
        console.error("Erro ao sair:", error);
    }
});
