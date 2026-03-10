
import { GoogleGenAI } from "@google/genai";

// Fix: Declare global interface for Window to include custom properties
declare global {
    interface Window {
        toggleCart: () => void;
        addToCart: (id: number) => void;
        checkout: () => void;
        toggleAssistant: () => void;
        sendChatMessage: () => Promise<void>;
    }
}

// --- Configuração e Dados ---
const SHOP_INFO = {
    name: "Ótica Roland",
    whatsapp: "5511998793053",
    address: "Av. Domingos de Morais, 138, Vila Mariana, SP",
    hours: "Seg-Sex: 10h-17h | Sáb: 10h-14h",
    collection: "Coleção 2026"
};

const WHATS_URL = `https://wa.me/${SHOP_INFO.whatsapp}?text=${encodeURIComponent("Olá Sr. Walter, vim pelo site e gostaria de uma consultoria técnica.")}`;

const PRODUCTS = [
    { id: 1, 
        name: "Aviador Sky Edition", 
        price: 280, 
        cat: "SOL", 
        img: "assets/aviador-solar.png", 
        desc: "Leveza e proteção com lentes polarizadas de alta definição." },
    { id: 2, 
        name: "Zeiss VR ONE Plus", 
        price: 750, 
        cat: "SOL", 
        img: "assets/vrone.png", 
        desc: "Atualmente compatível com smartphones, além de muitos aplicativos disponíveis nas lojas feitos para dispositivos VR móveis" },
    { id: 3, 
        name: "ACUVUE® OASYS com HYDRACLEAR® PLUS", 
        price: 260, 
        cat: "LENTES", 
        img: "assets/oasis.png", 
        desc: "Hidratação contínua para o máximo conforto diário." },
    { id: 4, 
        name: "Zeiss Lens Wipes", 
        price: 99, 
        cat: "LENTES", 
        img: "assets/lens-wipes.png", 
        desc: "Sofisticação vintage para olhares exigentes." },
    { id: 5, 
        name: "Acuvue Moist 1-Day", 
        price: 265, 
        cat: "LENTES", 
        img: "https://images.unsplash.com/photo-1505022610485-0249ba5b3675?auto=format&fit=crop&q=80&w=800", 
        desc: "Praticidade e saúde ocular em descarte diário." },
    { id: 6, 
        name: "Solução Care+", 
        price: 85, 
        cat: "LENTES", 
        img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800", 
        desc: "Limpeza profunda e conservação prolongada." }
];

// --- Estado Global ---
let cart: any[] = [];

// Ícone de WhatsApp Corrigido e Centralizado (Path melhorado)
const WHATSAPP_SVG = `
<svg viewBox="0 0 448 512" class="w-6 h-6 fill-current">
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.1 0-65.6-8.9-93.9-25.7l-6.7-4-69.8 18.3 18.7-68.1-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.4 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.1-16.4-14.6-27.4-32.6-30.6-38.2-3.2-5.6-.3-8.6 2.4-11.4 2.5-2.5 5.5-6.5 8.3-9.7 2.8-3.2 3.7-5.5 5.5-9.2 1.9-3.7.9-6.9-.5-9.7-1.4-2.8-12.4-29.9-17-41.1-4.5-10.9-9.1-9.4-12.4-9.6l-10.6-.2c-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.6 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
</svg>`;

const askGemini = async (prompt: string) => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                systemInstruction: `Você é o Walter Fugiwara, mestre óptico da Ótica Roland na Vila Mariana. Seu tom é técnico, elegante e acolhedor. REGRAS: 1. Respostas curtas (máx 2 frases). 2. Não fazemos exames na loja. 3. Se o usuário quiser comprar ou marcar visita, sugira falar no WhatsApp com você.`,
            }
        });
        return response.text || "Olá! Tive um soluço técnico.";
    } catch (e) {
        return "Olá! Tive um soluço técnico. Que tal conversarmos diretamente pelo WhatsApp?";
    }
};

const renderApp = () => {
    const appEl = document.getElementById("app");
    if (!appEl) return;

    try {
        appEl.innerHTML = `
            <!-- NAVBAR -->
            <nav class="fixed top-0 left-0 right-0 z-50 glass-nav h-20 flex items-center">
                <div class="container mx-auto px-6 flex justify-between items-center">
                    <a href="#" class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">R</div>
                        <div class="hidden sm:flex flex-col">
                            <span class="text-slate-900 font-extrabold tracking-widest text-sm leading-none">ÓTICA ROLAND</span>
                            <span class="text-sky-500 text-[9px] uppercase tracking-[0.3em] font-bold">Vila Mariana • Est. 2000</span>
                        </div>
                    </a>
                    
                    <div class="flex items-center gap-8">
                        <div class="hidden md:flex gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            <a href="#inicio" class="hover:text-sky-500 transition-colors">Início</a>
                            <a href="#produtos" class="hover:text-sky-500 transition-colors">Produtos</a>
                            <a href="#sobre" class="hover:text-sky-500 transition-colors">História</a>
                            <a href="#contato" class="hover:text-sky-500 transition-colors">Contato</a>
                        </div>
                        <button onclick="window.toggleCart()" class="relative p-3 bg-sky-50 border border-sky-100 rounded-full text-sky-600 hover:bg-sky-500 hover:text-white transition-all cart-glow">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                            <span id="cart-counter" class="absolute -top-1 -right-1 bg-amber-400 text-sky-950 font-black text-[9px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">0</span>
                        </button>
                    </div>
                </div>
            </nav>

            <!-- HERO -->
            <header id="inicio" class="relative h-[90vh] flex items-center overflow-hidden bg-slate-900">
                <div class="absolute inset-0 z-0">
                    <img src="assets/aviador.png" class="w-full h-full object-cover opacity-50 animate-kenburns" />
                    <div class="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent"></div>
                </div>
                <div class="container mx-auto px-6 relative z-10 text-white">
                    <div class="max-w-3xl">
                        <span class="text-sky-400 font-bold tracking-[0.4em] uppercase text-xs mb-6 block reveal active">Consultoria Especializada</span>
                        <h1 class="text-6xl md:text-8xl font-bold mb-8 leading-tight reveal active">
                            A visão do <br /><span class="text-sky-400 italic font-serif">amanhã.</span>
                        </h1>
                        <p class="text-xl text-slate-200 mb-10 leading-relaxed reveal active">
                            Curadoria 2026: Lentes de alta tecnologia e armações exclusivas no coração da Vila Mariana.
                        </p>
                        <div class="flex flex-wrap gap-4 reveal active">
                            <a href="#produtos" class="bg-sky-500 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-sky-600 transition-all shadow-xl shadow-sky-500/20">Coleção 2026</a>
                            <a href="${WHATS_URL}" target="_blank" class="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white/20 transition-all">WhatsApp Direto</a>
                        </div>
                    </div>
                </div>
            </header>

            <!-- PRODUCTS -->
            <section id="produtos" class="py-32 bg-white">
                <div class="container mx-auto px-6">
                    <div class="text-center max-w-2xl mx-auto mb-20">
                        <h2 class="text-4xl font-bold text-slate-900 mb-4">Destaques da Temporada</h2>
                        <div class="h-1 w-20 bg-sky-500 mx-auto"></div>
                    </div>
                    <div id="product-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        ${PRODUCTS.map(p => `
                            <div class="group reveal bg-slate-50 p-4 rounded-[2rem] hover:bg-white hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-sky-100 flex flex-col">
                                <div class="relative aspect-square rounded-[1.5rem] overflow-hidden mb-6">
                                    <img src="${p.img}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                </div>
                                <div class="px-2 flex flex-col flex-1">
                                    <div class="flex justify-between items-center mb-2">
                                        <span class="text-[9px] font-black tracking-widest text-sky-500 uppercase">${p.cat}</span>
                                        <span class="font-bold text-slate-900">R$ ${p.price}</span>
                                    </div>
                                    <h3 class="text-xl font-bold text-slate-900 mb-3">${p.name}</h3>
                                    <p class="text-slate-500 text-sm mb-6 flex-1">${p.desc}</p>
                                    <button onclick="window.addToCart(${p.id})" class="w-full bg-white border border-sky-200 text-sky-600 py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-sky-500 hover:text-white transition-all active:scale-95">
                                        Adicionar
                                    </button>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                </div>
            </section>

            <!-- MAPA -->
            <section id="contato" class="py-32 bg-sky-50">
                <div class="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 class="text-4xl font-bold text-slate-900 mb-8">Nossa Localização</h2>
                        <p class="text-lg text-slate-600 mb-10 leading-relaxed">
                            Visite-nos para uma conferência técnica exata do seu grau.
                        </p>
                        <div class="space-y-6 text-slate-700 font-medium">
                            <p class="flex items-center gap-4">📍 ${SHOP_INFO.address}</p>
                            <p class="flex items-center gap-4">⏰ ${SHOP_INFO.hours}</p>
                        </div>
                    </div>
                    <div class="h-[450px] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white reveal">
                        <iframe 
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.621535456897!2d-46.6385311!3d-23.582046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5a176e737197%3A0xc665780a6b98e727!2sAv.%20Domingos%20de%20Morais%2C%20138%20-%20Vila%20Mariana%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2004010-000!5e0!3m2!1spt-BR!2sbr!4v1710000000000!5m2!1spt-BR!2sbr" 
                          width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
                    </div>
                </div>
            </section>

            <!-- FOOTER -->
            <footer class="bg-slate-900 text-white py-20">
                <div class="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div class="text-center md:text-left">
                        <h3 class="text-2xl font-bold tracking-widest mb-2">ÓTICA ROLAND</h3>
                        <p class="text-slate-400 text-sm italic">Walter Fugiwara • Mestre Óptico</p>
                    </div>
                    <div class="flex gap-6">
                        <a href="https://facebook.com/opticaroland" target="_blank" class="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-sky-500 transition-all">
                            <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                        </a>
                        <a href="${WHATS_URL}" target="_blank" class="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-sky-500 transition-all text-white">
                            ${WHATSAPP_SVG}
                        </a>
                    </div>
                </div>
            </footer>

            <!-- CHAT ASSISTANT -->
            <div class="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-4">
                <div id="chat-box" class="hidden w-[90vw] md:w-80 h-[450px] bg-white rounded-[2rem] shadow-3xl border border-sky-100 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5">
                    <div class="bg-sky-500 p-5 text-white flex justify-between items-center">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 bg-white text-sky-500 rounded-lg flex items-center justify-center font-bold text-xs">R</div>
                            <span class="font-bold text-sm tracking-tight">Walter Virtual</span>
                        </div>
                        <button onclick="window.toggleAssistant()" class="text-2xl font-light">&times;</button>
                    </div>
                    <div id="chat-content" class="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
                        <div class="flex justify-start">
                            <div class="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none text-xs text-slate-700 shadow-sm">
                                Olá! Sou o Walter Virtual. Como posso orientar sua visão hoje?
                            </div>
                        </div>
                    </div>
                    <!-- Typing Indicator -->
                    <div id="chat-loading" class="hidden px-5 py-2">
                        <div class="flex gap-1 items-center bg-white p-2 rounded-lg w-fit shadow-sm border border-slate-100 ml-2">
                            <span class="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></span>
                            <span class="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                            <span class="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                    </div>
                    <div class="p-4 bg-white border-t flex gap-2">
                        <input id="chat-input" type="text" placeholder="Dúvida técnica..." class="flex-1 bg-slate-100 px-4 py-3 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-sky-200" onkeydown="if(event.key === 'Enter') window.sendChatMessage()" />
                        <button onclick="window.sendChatMessage()" class="bg-sky-500 text-white p-3 rounded-xl hover:bg-sky-600 transition-colors">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                        </button>
                    </div>
                </div>
                <button onclick="window.toggleAssistant()" class="assistant-btn-icon w-16 h-16 bg-sky-500 text-white rounded-full shadow-2xl hover:scale-110 transition-all cart-glow active:scale-95 flex items-center justify-center">
                    <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                </button>
            </div>

            <!-- CART DRAWER -->
            <div id="cart-overlay" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] hidden" onclick="window.toggleCart()"></div>
            <div id="cart-drawer" class="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-[110] shadow-3xl transform translate-x-full transition-transform duration-500 flex flex-col">
                <div class="p-8 border-b flex justify-between items-center">
                    <h3 class="font-bold text-slate-900 uppercase tracking-widest">Carrinho</h3>
                    <button onclick="window.toggleCart()" class="text-3xl font-light">&times;</button>
                </div>
                <div id="cart-items" class="flex-1 overflow-y-auto p-8 space-y-6 text-center text-slate-400">
                    Seu carrinho está vazio.
                </div>
                <div class="p-8 border-t bg-slate-50">
                    <button onclick="window.checkout()" class="w-full bg-sky-500 text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-sky-500/20 active:scale-95 transition-all">
                        Finalizar no WhatsApp
                    </button>
                </div>
            </div>
        `;
    } catch (e) {
        console.error("Render Error:", e);
    }

    setupScrollReveal();
};

const setupScrollReveal = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add("active");
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
};

// --- Logica de Carrinho ---
window.toggleCart = () => {
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-overlay");
    if (!drawer || !overlay) return;
    drawer.classList.toggle("translate-x-full");
    overlay.classList.toggle("hidden");
};

window.addToCart = (id: number) => {
    const p = PRODUCTS.find(p => p.id === id);
    if (p) {
        cart.push(p);
        updateCartUI();
        window.toggleCart();
    }
};

const updateCartUI = () => {
    const counter = document.getElementById("cart-counter");
    const container = document.getElementById("cart-items");
    if (counter) counter.innerText = cart.length.toString();
    if (container) {
        if (cart.length === 0) {
            container.innerHTML = "Seu carrinho está vazio.";
            return;
        }
        container.innerHTML = cart.map(item => `
            <div class="flex items-center gap-4 text-left bg-sky-50/50 p-4 rounded-xl border border-sky-100">
                <img src="${item.img}" class="w-12 h-12 rounded-lg object-cover" />
                <div class="flex-1">
                    <p class="text-sm font-bold text-slate-900 leading-tight">${item.name}</p>
                    <p class="text-xs text-sky-600 font-bold">R$ ${item.price}</p>
                </div>
            </div>
        `).join("");
    }
};

window.checkout = () => {
    if (cart.length === 0) return alert("Adicione produtos primeiro!");
    const list = cart.map(i => `- ${i.name} (R$ ${i.price})`).join("%0A");
    window.open(`https://wa.me/${SHOP_INFO.whatsapp}?text=${encodeURIComponent("Gostaria de fechar esse pedido:")}%0A${list}`, '_blank');
};

// --- Logica de Chat ---
window.toggleAssistant = () => {
    const box = document.getElementById("chat-box");
    if (box) box.classList.toggle("hidden");
};

window.sendChatMessage = async () => {
    const input = document.getElementById("chat-input") as HTMLInputElement;
    const chat = document.getElementById("chat-content");
    const loading = document.getElementById("chat-loading");
    if (!input || !chat || !input.value.trim() || !loading) return;

    const userText = input.value;
    input.value = "";

    // User message
    chat.innerHTML += `<div class="flex justify-end"><div class="bg-sky-500 text-white p-3 rounded-2xl rounded-tr-none text-xs max-w-[85%] shadow-md">${userText}</div></div>`;
    chat.scrollTop = chat.scrollHeight;

    // Show loading
    loading.classList.remove("hidden");
    chat.scrollTop = chat.scrollHeight;

    const aiRes = await askGemini(userText);

    // Hide loading
    loading.classList.add("hidden");

    // Check if we should add a WhatsApp button based on response
    const triggerWords = ["whatsapp", "walter", "contato", "falar", "visita", "marcar"];
    const shouldAddButton = triggerWords.some(word => aiRes.toLowerCase().includes(word));

    chat.innerHTML += `
        <div class="flex flex-col items-start gap-2">
            <div class="bg-white border border-slate-100 text-slate-700 p-3 rounded-2xl rounded-tl-none text-xs max-w-[85%] shadow-sm leading-relaxed">
                ${aiRes}
            </div>
            ${shouldAddButton ? `
                <button onclick="window.open('${WHATS_URL}', '_blank')" class="bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-lg border border-emerald-100 hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-2">
                   ${WHATSAPP_SVG} Falar com Walter
                </button>
            ` : ""}
        </div>
    `;
    chat.scrollTop = chat.scrollHeight;
};

// --- Inicialização Robusta ---
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderApp);
} else {
    renderApp();
}
