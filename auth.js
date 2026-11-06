
// ========================================
// CONFIGURAÇÃO DO FIREBASE
// ========================================

const firebaseConfig = {
    apiKey: "AIzaSyCDBcbxZHA7IVqofLLQSciYTisCzygyFnI",
    authDomain: "victor-manoel.firebaseapp.com",
    projectId: "victor-manoel",
    storageBucket: "victor-manoel.firebasestorage.app",
    messagingSenderId: "393152158053",
    appId: "1:393152158053:web:0766aba4b948ef2702298c",
    measurementId: "G-EB2R0XXD5V"
};

// Inicializar Firebase sem duplicar a instância
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();


// ========================================
// ELEMENTOS DO PERFIL
// ========================================

const profileMenu = document.getElementById("profileMenu");
const profileTrigger = document.getElementById("profileTrigger");
const profileDropdown = document.getElementById("profileDropdown");

const profileName = document.getElementById("profileName");
const dropdownName = document.getElementById("dropdownName");
const profileEmail = document.getElementById("profileEmail");

const logoutButton = document.getElementById("logoutButton");


// ========================================
// VERIFICAR AUTENTICAÇÃO
// ========================================

auth.onAuthStateChanged(async (user) => {

    if (!user) {
        profileMenu.hidden = true;
        profileDropdown.hidden = true;

        console.log("Nenhum usuário autenticado.");

        return;
    }

    console.log("Usuário autenticado:", user.email);

    // Mostrar o menu de perfil
    profileMenu.hidden = false;

    // Mostrar informações provisórias
    profileName.textContent = user.displayName || "Minha conta";
    dropdownName.textContent = user.displayName || "Minha conta";
    profileEmail.textContent = user.email || "";

    try {

        // Buscar informações no Firestore
        const userDoc = await db
            .collection("usuarios")
            .doc(user.uid)
            .get();

        if (userDoc.exists) {

            const dados = userDoc.data();

            const nome = dados.nome || user.displayName || "Minha conta";
            const email = dados.email || user.email || "";

            profileName.textContent = nome;
            dropdownName.textContent = nome;
            profileEmail.textContent = email;

            console.log("Perfil carregado:", dados);

        } else {

            console.warn("Documento do usuário não encontrado.");

        }

    } catch (error) {

        console.error("Erro ao carregar perfil:", error);

    }

});


// ========================================
// ABRIR E FECHAR MENU
// ========================================

profileTrigger.addEventListener("click", (event) => {

    event.stopPropagation();

    profileDropdown.hidden = !profileDropdown.hidden;

});


// Fechar ao clicar fora do menu
document.addEventListener("click", (event) => {

    if (!profileMenu.contains(event.target)) {
        profileDropdown.hidden = true;
    }

});


// Fechar ao pressionar ESC
document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {
        profileDropdown.hidden = true;
    }

});


// ========================================
// SAIR DA CONTA
// ========================================

logoutButton.addEventListener("click", async () => {

    try {

        await auth.signOut();

        window.location.href = "login.html";

    } catch (error) {

        console.error("Erro ao sair da conta:", error);

        alert("Não foi possível sair da conta. Tente novamente.");

    }

});
