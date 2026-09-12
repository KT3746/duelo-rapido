/* LUTA — campanha de 10 círculos (Nara vs rivais originais). Visual 1.4.0. */
(() => {
  "use strict";

  const VERSAO = "1.4.0";
  const CHAVE = "duelo-rapido";
  const TOTAL_CIRCULOS = 10;

  const TEXTO = {
    titulo: "LUTA",
    suaVez: "Sua vez",
    vezInimigo: "Vez do inimigo",
    turno: (n) => `Turno ${n}`,
    circulo: (n) => `Círculo ${n}/${TOTAL_CIRCULOS}`,
    voceAtacou: (dano, nome) => `Ataque: −${dano} em ${nome}.`,
    voceMagia: (dano, nome) => `Clarão: −${dano} em ${nome}.`,
    voceDefendeu: (n) => `Guarda. +${n} essência.`,
    inimigoAtacou: (nome, dano) => `${nome}: −${dano} em você.`,
    inimigoMagia: (nome, magia, dano) => `${nome} · ${magia}: −${dano} em você.`,
    inimigoDefendeu: (nome, n) => `${nome} defendeu. +${n} essência.`,
    acertoPreciso: "Acerto preciso!",
    escudoAbsorveu: "O escudo absorveu parte do golpe.",
    essenciaCurta: "Essência insuficiente para magia.",
    recuouEssencia: (n) => `+${n}`,
    vitoria: "Vitória",
    derrota: "Derrota",
    campanhaVencida: "Campanha encerrada",
    venceuEm: (nome, rival, turnos) => `${nome} derrotou ${rival} em ${turnos} turnos.`,
    venceuCampanha: (rival, turnos) => `Nara fechou os dez círculos. ${rival} caiu no turno ${turnos}. O círculo inteiro é dela.`,
    resumoCampanha: (s) => `Resumo: ${s.circulos} círculos · ${s.turnos} turnos · ${s.danoFeito} dano causado · ${s.danoTomado} dano sofrido.`,
    perdeuPara: (rival) => `${rival} venceu este círculo. Tente de novo ou recomece a campanha.`,
    fimSeloWin: "Círculo encerrado",
    fimSeloLose: "Você caiu",
    fimSeloCampanha: "Dez círculos",
    inicioRelato: (titulo, nota) => `${titulo} entra no círculo. ${nota} Escolha o primeiro golpe.`,
    suaVezCurta: "Sua vez — uma ação.",
    som: "Som",
    mudo: "Mudo",
    rival: "Rival",
    chefe: "Chefe",
    chefeFinal: "Chefe final",
    entradaChefe: "Chefe",
    entradaChefeFinal: "Chefe final",
    entradaChefeTexto: (titulo, nota) => `${titulo} toma o círculo. ${nota}`,
    descansoSelo: (n) => `Círculo ${n}/${TOTAL_CIRCULOS} concluído`,
    descansoTexto: "Nara recupera o fôlego. O próximo círculo já espera — escolha um reforço.",
    proximo: "Próximo círculo",
    proximoChefe: "Próximo chefe",
    proximoFinal: "Chefe final",
    continuar: (n) => `Continuar · Círculo ${n}/10`,
  };

  const NARA = {
    id: "nara",
    nome: "Nara",
    vidaMax: 100,
    essenciaMax: 40,
    ataque: { min: 12, max: 16 },
    magia: { min: 24, max: 30, custo: 16, nome: "Clarão", perfuracao: 0.5, dreno: 0 },
    guardaReducao: 0.6,
    essenciaDefesa: 5,
    critico: 0.12,
  };

  const RIVAIS = {
    liro: {
      id: "liro",
      nome: "Liro",
      titulo: "Liro das Dunas",
      nota: "Batedor magro, golpes rápidos e fracos.",
      vidaMax: 72,
      essenciaMax: 24,
      ataque: { min: 8, max: 11 },
      magia: { min: 15, max: 19, custo: 12, nome: "Farpa", perfuracao: 0.25, dreno: 0 },
      guardaReducao: 0.45,
      essenciaDefesa: 4,
      critico: 0.08,
      estilo: "agressivo",
      tema: "areia",
      chefe: false,
    },
    dagro: {
      id: "dagro",
      nome: "Dagro",
      titulo: "Dagro das Forjas",
      nota: "Bruto das forjas. Encara de frente.",
      vidaMax: 95,
      essenciaMax: 32,
      ataque: { min: 11, max: 15 },
      magia: { min: 20, max: 26, custo: 14, nome: "Brasa", perfuracao: 0.35, dreno: 0 },
      guardaReducao: 0.55,
      essenciaDefesa: 4,
      critico: 0.1,
      estilo: "agressivo",
      tema: "forja",
      chefe: false,
    },
    velin: {
      id: "velin",
      nome: "Velin",
      titulo: "Velin da Sombra",
      nota: "Manto violeta. Drena essência com o Dreno.",
      vidaMax: 90,
      essenciaMax: 48,
      ataque: { min: 10, max: 14 },
      magia: { min: 21, max: 27, custo: 15, nome: "Dreno", perfuracao: 0.55, dreno: 5 },
      guardaReducao: 0.5,
      essenciaDefesa: 6,
      critico: 0.12,
      estilo: "astuto",
      tema: "sombra",
      chefe: false,
    },
    bruma: {
      id: "bruma",
      nome: "Bruma",
      titulo: "Bruma do Véu",
      nota: "Dança na névoa e se guarda o tempo todo.",
      vidaMax: 108,
      essenciaMax: 36,
      ataque: { min: 10, max: 13 },
      magia: { min: 18, max: 23, custo: 14, nome: "Névoa", perfuracao: 0.4, dreno: 0 },
      guardaReducao: 0.62,
      essenciaDefesa: 6,
      critico: 0.1,
      estilo: "defensivo",
      tema: "nevoa",
      chefe: false,
    },
    korr: {
      id: "korr",
      nome: "Korr",
      titulo: "Korr da Laje",
      nota: "Primeiro chefe. Pedra viva, muito durão.",
      vidaMax: 155,
      essenciaMax: 28,
      ataque: { min: 14, max: 18 },
      magia: { min: 22, max: 28, custo: 16, nome: "Laje", perfuracao: 0.3, dreno: 0 },
      guardaReducao: 0.58,
      essenciaDefesa: 5,
      critico: 0.08,
      estilo: "tanque",
      tema: "pedra",
      chefe: "chefe",
    },
    sile: {
      id: "sile",
      nome: "Sile",
      titulo: "Sile da Geada",
      nota: "Magia gelada. Pouca vida, Clarão rival pesado.",
      vidaMax: 92,
      essenciaMax: 54,
      ataque: { min: 9, max: 12 },
      magia: { min: 26, max: 33, custo: 14, nome: "Gélido", perfuracao: 0.6, dreno: 0 },
      guardaReducao: 0.42,
      essenciaDefesa: 7,
      critico: 0.11,
      estilo: "mago",
      tema: "geada",
      chefe: false,
    },
    ravo: {
      id: "ravo",
      nome: "Ravó",
      titulo: "Ravó Ígneo",
      nota: "Berserker. Quase não defende — só avança.",
      vidaMax: 118,
      essenciaMax: 30,
      ataque: { min: 16, max: 21 },
      magia: { min: 20, max: 25, custo: 16, nome: "Ímpeto", perfuracao: 0.25, dreno: 0 },
      guardaReducao: 0.4,
      essenciaDefesa: 3,
      critico: 0.16,
      estilo: "berserker",
      tema: "fogo",
      chefe: false,
    },
    neme: {
      id: "neme",
      nome: "Neme",
      titulo: "Neme da Fresta",
      nota: "Assassina da fresta. Perfura guarda e acerta preciso.",
      vidaMax: 100,
      essenciaMax: 40,
      ataque: { min: 13, max: 17 },
      magia: { min: 23, max: 29, custo: 15, nome: "Fresta", perfuracao: 0.7, dreno: 0 },
      guardaReducao: 0.48,
      essenciaDefesa: 5,
      critico: 0.2,
      estilo: "astuto",
      tema: "fresta",
      chefe: false,
    },
    orvane: {
      id: "orvane",
      nome: "Orvane",
      titulo: "Orvane do Pacto",
      nota: "Segundo chefe. Armadura, capa e magia pesada.",
      vidaMax: 170,
      essenciaMax: 44,
      ataque: { min: 15, max: 20 },
      magia: { min: 26, max: 32, custo: 16, nome: "Pacto", perfuracao: 0.45, dreno: 4 },
      guardaReducao: 0.6,
      essenciaDefesa: 6,
      critico: 0.12,
      estilo: "tanque",
      tema: "pacto",
      chefe: "chefe",
    },
    aurenegra: {
      id: "aurenegra",
      nome: "Aurenegra",
      titulo: "Aurenegra",
      nota: "Senhora do eclipse. O último círculo.",
      vidaMax: 210,
      essenciaMax: 56,
      ataque: { min: 17, max: 23 },
      magia: { min: 30, max: 38, custo: 16, nome: "Eclipse", perfuracao: 0.55, dreno: 6 },
      guardaReducao: 0.58,
      essenciaDefesa: 6,
      critico: 0.14,
      estilo: "chefe",
      tema: "eclipse",
      chefe: "final",
    },
  };

  const CAMPANHA = ["liro", "dagro", "velin", "bruma", "korr", "sile", "ravo", "neme", "orvane", "aurenegra"];

  const ARTES = {
    liro: `<svg class="lutador__svg" viewBox="0 0 120 160" aria-hidden="true"> <defs> <linearGradient id="liro-corpo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3e6b0"/><stop offset="1" stop-color="#4a5a22"/></linearGradient> <linearGradient id="liro-cabelo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7a8a38"/><stop offset="1" stop-color="#2c3612"/></linearGradient> </defs> <ellipse cx="60" cy="150" rx="20" ry="4.5" fill="#000" opacity="0.2"/> <path d="M82 24 L90 148" stroke="#c4a35a" stroke-width="3.2" stroke-linecap="round"/> <path d="M82 22 L102 42 L86 36 Z" fill="#efe0a8"/> <path d="M82 22 L70 40 L84 34 Z" fill="#d7c48a"/> <path d="M50 70 L70 70 L74 116 L46 116 Z" fill="url(#liro-corpo)"/> <path d="M48 88 L72 88" stroke="#dfe6a4" stroke-width="1.2" opacity="0.4"/> <rect x="50" y="116" width="7" height="28" rx="2.5" fill="#2e3a18"/> <rect x="62" y="116" width="7" height="28" rx="2.5" fill="#2e3a18"/> <path d="M50 142 L57 142 L58 150 L49 150 Z" fill="#1c2410"/> <path d="M62 142 L69 142 L70 150 L61 150 Z" fill="#1c2410"/> <path d="M50 76 L34 104 L42 108 L56 82 Z" fill="#c9d48a"/> <path d="M70 74 L88 58 L94 68 L72 86 Z" fill="#dfe6a4"/> <ellipse cx="60" cy="40" rx="12.5" ry="13.5" fill="#f4e4c4"/> <path d="M46 38 C48 14 76 12 76 40 C68 30 52 30 46 38 Z" fill="url(#liro-cabelo)"/> <path d="M48 52 L72 56 L68 68 L50 64 Z" fill="#6d7c34"/> <circle cx="55" cy="41" r="1.7" fill="#2a3010"/> <circle cx="64" cy="41" r="1.7" fill="#2a3010"/> <circle cx="56" cy="40.2" r="0.55" fill="#fff"/> </svg>`,
    dagro: `<svg class="lutador__svg" viewBox="0 0 120 160" aria-hidden="true"> <defs> <linearGradient id="dagro-corpo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffc4a0"/><stop offset="1" stop-color="#6a2010"/></linearGradient> </defs> <ellipse cx="60" cy="150" rx="26" ry="5" fill="#000" opacity="0.22"/> <path d="M22 68 L98 68 L108 122 L12 122 Z" fill="url(#dagro-corpo)"/> <path d="M30 90 L90 90" stroke="#ffb16a" stroke-width="3" opacity="0.45"/> <path d="M36 78 L84 78" stroke="#3a140e" stroke-width="2" opacity="0.35"/> <rect x="30" y="122" width="18" height="24" rx="3" fill="#2a120e"/> <rect x="72" y="122" width="18" height="24" rx="3" fill="#2a120e"/> <path d="M30 144 L48 144 L50 152 L28 152 Z" fill="#1a0a08"/> <path d="M72 144 L90 144 L92 152 L70 152 Z" fill="#1a0a08"/> <path d="M32 70 L10 100 L26 108 L46 80 Z" fill="#c45a32"/> <path d="M88 70 L116 90 L104 104 L76 82 Z" fill="#e27a42"/> <ellipse cx="60" cy="42" rx="19" ry="17" fill="#2a1612"/> <path d="M42 34 L51 12 L58 36 Z" fill="#ff8a3d"/> <path d="M62 34 L70 10 L78 36 Z" fill="#ff8a3d"/> <rect x="46" y="38" width="28" height="11" rx="3" fill="#140a08"/> <circle cx="54" cy="43.5" r="2.3" fill="#ffd36a"/> <circle cx="66" cy="43.5" r="2.3" fill="#ffd36a"/> <path d="M48 56 Q60 62 72 56" fill="none" stroke="#8a3a22" stroke-width="1.4"/> </svg>`,
    velin: `<svg class="lutador__svg" viewBox="0 0 120 160" aria-hidden="true"> <defs> <linearGradient id="velin-manto" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#efe6ff"/><stop offset="1" stop-color="#2a1258"/></linearGradient> </defs> <ellipse cx="60" cy="150" rx="24" ry="5" fill="#000" opacity="0.18"/> <path d="M60 24 C14 48 12 128 34 152 C50 118 54 88 60 66 C66 88 70 118 86 152 C108 128 106 48 60 24 Z" fill="url(#velin-manto)"/> <path d="M42 70 C36 100 40 130 50 148 C56 120 58 94 60 74 Z" fill="#1b1030" opacity="0.35"/> <path d="M44 38 C48 14 74 14 78 40 C68 32 52 32 44 38 Z" fill="#120c24"/> <ellipse cx="60" cy="48" rx="12.5" ry="13.5" fill="#efe6ff"/> <path d="M48 44 L72 44 L68 60 L52 60 Z" fill="#2a1848"/> <circle cx="55" cy="50" r="1.9" fill="#c084fc"/> <circle cx="65" cy="50" r="1.9" fill="#c084fc"/> <circle cx="56.2" cy="49.2" r="0.55" fill="#fff"/> <circle class="rival-orbe" cx="22" cy="88" r="6.5" fill="#f0abfc"/> <circle class="rival-orbe" cx="22" cy="88" r="10" fill="none" stroke="#f0abfc" stroke-width="1" opacity="0.4"/> <circle class="rival-orbe" cx="98" cy="96" r="5.5" fill="#a78bfa"/> </svg>`,
    bruma: `<svg class="lutador__svg" viewBox="0 0 120 160" aria-hidden="true"> <defs> <linearGradient id="bruma-manto" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7fbff"/><stop offset="1" stop-color="#4a6478"/></linearGradient> </defs> <ellipse cx="60" cy="148" rx="36" ry="8" fill="#9bb4c8" opacity="0.4"/> <path d="M60 28 C18 50 8 112 26 150 C48 118 50 86 60 60 C70 86 72 118 94 150 C112 112 102 50 60 28 Z" fill="url(#bruma-manto)" opacity="0.94"/> <path d="M36 90 C28 120 40 142 52 150 C50 120 54 90 60 68 Z" fill="#d5e4f0" opacity="0.35"/> <ellipse cx="60" cy="46" rx="13.5" ry="14.5" fill="#f7fbff"/> <path d="M44 46 L76 46 L72 70 L48 70 Z" fill="#d5e4f0" opacity="0.9"/> <path d="M42 38 C50 24 72 24 80 40" fill="none" stroke="#c5d8e8" stroke-width="4.2" stroke-linecap="round"/> <circle cx="55" cy="48" r="1.7" fill="#3a5164"/> <circle cx="65" cy="48" r="1.7" fill="#3a5164"/> <circle cx="56" cy="47.2" r="0.5" fill="#fff"/> </svg>`,
    korr: `<svg class="lutador__svg" viewBox="0 0 120 160" aria-hidden="true"> <defs> <linearGradient id="korr-corpo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#efd09a"/><stop offset="1" stop-color="#4a3014"/></linearGradient> </defs> <ellipse cx="60" cy="150" rx="30" ry="5" fill="#000" opacity="0.24"/> <path d="M14 66 L106 66 L116 128 L4 128 Z" fill="url(#korr-corpo)"/> <rect x="38" y="82" width="44" height="9" fill="#8a6230"/> <rect x="42" y="100" width="36" height="8" fill="#8a6230"/> <path d="M28 78 L92 78" stroke="#2a1c10" stroke-width="2" opacity="0.25"/> <rect x="24" y="128" width="24" height="20" rx="2" fill="#2e2010"/> <rect x="72" y="128" width="24" height="20" rx="2" fill="#2e2010"/> <path d="M22 70 L4 110 L26 116 L42 80 Z" fill="#b8894a"/> <path d="M98 70 L118 102 L98 114 L82 80 Z" fill="#c99a58"/> <ellipse cx="60" cy="44" rx="17" ry="15" fill="#c4a06a"/> <rect x="46" y="40" width="28" height="9" rx="2" fill="#1c140c"/> <circle cx="54" cy="44.5" r="2.1" fill="#f0d48a"/> <circle cx="66" cy="44.5" r="2.1" fill="#f0d48a"/> <path d="M40 36 L48 28 L52 38" fill="#e2c48a"/> <path d="M80 36 L72 28 L68 38" fill="#e2c48a"/> </svg>`,
    sile: `<svg class="lutador__svg" viewBox="0 0 120 160" aria-hidden="true"> <defs> <linearGradient id="sile-corpo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2fdff"/><stop offset="1" stop-color="#2a6a92"/></linearGradient> </defs> <ellipse cx="60" cy="150" rx="18" ry="4.5" fill="#000" opacity="0.16"/> <path d="M88 16 L94 148" stroke="#9ad4f0" stroke-width="3.2" stroke-linecap="round"/> <polygon points="94,16 108,34 94,30 80,34" fill="#c4f0ff"/> <circle class="rival-orbe" cx="94" cy="16" r="6.5" fill="#e8ffff"/> <circle class="rival-orbe" cx="94" cy="16" r="10" fill="none" stroke="#c4f0ff" stroke-width="1" opacity="0.5"/> <path d="M48 72 L72 72 L76 120 L44 120 Z" fill="url(#sile-corpo)"/> <path d="M50 90 L74 90" stroke="#e8fbff" stroke-width="1.2" opacity="0.35"/> <rect x="48" y="120" width="8" height="26" rx="2.5" fill="#163a52"/> <rect x="64" y="120" width="8" height="26" rx="2.5" fill="#163a52"/> <path d="M48 76 L30 112 L40 116 L54 84 Z" fill="#bfe8f8"/> <path d="M72 76 L86 66 L92 76 L74 88 Z" fill="#d7f4ff"/> <ellipse cx="60" cy="42" rx="13.5" ry="14.5" fill="#f6fdff"/> <path d="M44 40 C48 6 86 6 78 44 C70 26 50 26 44 40 Z" fill="#d8f0ff"/> <circle cx="55" cy="43" r="1.7" fill="#245a78"/> <circle cx="65" cy="43" r="1.7" fill="#245a78"/> <circle cx="56" cy="42.2" r="0.5" fill="#fff"/> </svg>`,
    ravo: `<svg class="lutador__svg" viewBox="0 0 120 160" aria-hidden="true"> <defs> <linearGradient id="ravo-corpo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9a78"/><stop offset="1" stop-color="#5a0c0c"/></linearGradient> </defs> <ellipse cx="60" cy="150" rx="26" ry="5" fill="#000" opacity="0.22"/> <path d="M22 64 L98 64 L108 120 L12 120 Z" fill="url(#ravo-corpo)"/> <path d="M30 88 L90 88" stroke="#ffcc66" stroke-width="2" opacity="0.35"/> <rect x="30" y="120" width="20" height="26" rx="3" fill="#2a0808"/> <rect x="70" y="120" width="20" height="26" rx="3" fill="#2a0808"/> <path d="M26 70 L4 94 L22 110 L44 80 Z" fill="#d94a32"/> <path d="M94 70 L118 86 L108 110 L80 80 Z" fill="#ff6a40"/> <path d="M16 88 L2 78 L20 98" fill="#ffcc66"/> <path d="M110 82 L122 68 L114 98" fill="#ffcc66"/> <ellipse cx="60" cy="40" rx="18" ry="16" fill="#4a1210"/> <path d="M46 28 L52 6 L58 30 Z" fill="#ff5a3a"/> <path d="M58 26 L62 2 L68 28 Z" fill="#ffd36a"/> <path d="M68 28 L76 8 L80 30 Z" fill="#ff5a3a"/> <circle cx="54" cy="42" r="2.3" fill="#ffe08a"/> <circle cx="68" cy="42" r="2.3" fill="#ffe08a"/> <path d="M50 52 Q60 58 70 52" fill="none" stroke="#8a2018" stroke-width="1.4"/> </svg>`,
    neme: `<svg class="lutador__svg" viewBox="0 0 120 160" aria-hidden="true"> <defs> <linearGradient id="neme-corpo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a8ffe4"/><stop offset="1" stop-color="#062420"/></linearGradient> </defs> <ellipse cx="58" cy="150" rx="18" ry="4" fill="#000" opacity="0.2"/> <path d="M38 86 L80 76 L88 128 L30 134 Z" fill="url(#neme-corpo)"/> <path d="M42 104 L78 96" stroke="#7dffd4" stroke-width="1.2" opacity="0.35"/> <rect x="38" y="128" width="11" height="20" rx="2" fill="#061816"/> <rect x="62" y="124" width="11" height="24" rx="2" fill="#061816"/> <path d="M40 90 L18 120 L30 124 L50 96 Z" fill="#1a5c54"/> <path d="M78 82 L110 64 L116 74 L82 94 Z" fill="#3ae0c0"/> <path d="M110 64 L122 54 L116 78 Z" fill="#d7fff4"/> <ellipse cx="58" cy="56" rx="13.5" ry="12.5" fill="#0c2420"/> <path d="M44 54 L72 50 L70 66 L46 68 Z" fill="#163a34"/> <path d="M42 48 C50 36 70 34 76 50" fill="none" stroke="#0a2e2a" stroke-width="4"/> <circle cx="53" cy="58" r="1.8" fill="#7dffd4"/> <circle cx="64" cy="56" r="1.8" fill="#7dffd4"/> <circle cx="54.2" cy="57.2" r="0.5" fill="#fff"/> </svg>`,
    orvane: `<svg class="lutador__svg" viewBox="0 0 120 160" aria-hidden="true"> <defs> <linearGradient id="orvane-corpo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6de9a"/><stop offset="1" stop-color="#22100e"/></linearGradient> </defs> <ellipse cx="60" cy="150" rx="26" ry="5" fill="#000" opacity="0.22"/> <path d="M86 54 C110 80 114 132 88 152 L58 118 Z" fill="#3a1614" opacity="0.92"/> <path d="M24 68 L96 68 L104 124 L16 124 Z" fill="url(#orvane-corpo)"/> <path d="M32 92 L88 92" stroke="#e0c070" stroke-width="2" opacity="0.35"/> <rect x="30" y="124" width="20" height="22" rx="2" fill="#140a08"/> <rect x="70" y="124" width="20" height="22" rx="2" fill="#140a08"/> <path d="M28 72 L8 106 L26 112 L44 80 Z" fill="#c9a45a"/> <path d="M92 72 L114 96 L98 110 L76 80 Z" fill="#e0c070"/> <path d="M36 38 L60 14 L84 38 L76 70 L44 70 Z" fill="#241614"/> <path d="M50 34 L60 20 L70 34" fill="#e8c36a"/> <rect x="46" y="42" width="28" height="11" rx="2" fill="#100808"/> <circle cx="54" cy="47.5" r="2.1" fill="#e8c36a"/> <circle cx="66" cy="47.5" r="2.1" fill="#e8c36a"/> </svg>`,
    aurenegra: `<svg class="lutador__svg" viewBox="0 0 120 160" aria-hidden="true"> <defs> <linearGradient id="aure-corpo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0d48a"/><stop offset="1" stop-color="#14061c"/></linearGradient> <radialGradient id="aure-halo" cx="50%" cy="45%" r="50%"> <stop offset="0" stop-color="#e8c36a" stop-opacity="0.35"/> <stop offset="1" stop-color="#e8c36a" stop-opacity="0"/> </radialGradient> </defs> <ellipse cx="60" cy="150" rx="26" ry="5" fill="#000" opacity="0.24"/> <circle cx="60" cy="48" r="32" fill="url(#aure-halo)"/> <circle cx="60" cy="48" r="27" fill="none" stroke="#e8c36a" stroke-width="2.4" opacity="0.75"/> <path d="M60 18 C12 50 16 130 38 154 C52 118 54 86 60 62 C66 86 68 118 82 154 C104 130 108 50 60 18 Z" fill="url(#aure-corpo)"/> <path d="M34 34 L60 8 L86 34 L76 26 L60 18 L44 26 Z" fill="#e8c36a"/> <ellipse cx="60" cy="50" rx="12.5" ry="13.5" fill="#f6ead8"/> <path d="M48 46 L72 46 L68 62 L52 62 Z" fill="#100810"/> <circle cx="55" cy="51" r="1.9" fill="#b08cff"/> <circle cx="65" cy="51" r="1.9" fill="#b08cff"/> <circle cx="56.2" cy="50.2" r="0.55" fill="#fff"/> <circle class="rival-orbe" cx="20" cy="86" r="6.5" fill="#e8c36a"/> <circle class="rival-orbe" cx="100" cy="90" r="6.5" fill="#b08cff"/> </svg>`,
  };

  const MELHORIAS = [
    {
      id: "cura",
      tipo: "cura",
      selo: "Cura",
      nome: "Curar feridas",
      disponivel: (j) => j.vida < j.vidaMax,
      detalhe: (j) => {
        const ganho = curaValor(j);
        return `Vida ${j.vida}/${j.vidaMax} → ${Math.min(j.vidaMax, j.vida + ganho)}/${j.vidaMax}.`;
      },
      aplicar: (j) => {
        j.vida = Math.min(j.vidaMax, j.vida + curaValor(j));
      },
    },
    {
      id: "vidaMax",
      tipo: "poder",
      selo: "Poder",
      nome: "Corpo firme",
      detalhe: (j) => `Vida máxima ${j.vidaMax} → ${j.vidaMax + 12}. Cura 12 agora.`,
      aplicar: (j) => {
        j.vidaMax += 12;
        j.vida = Math.min(j.vidaMax, j.vida + 12);
      },
    },
    {
      id: "essMax",
      tipo: "magia",
      selo: "Magia",
      nome: "Poço de essência",
      detalhe: (j) => `Essência máxima ${j.essenciaMax} → ${j.essenciaMax + 8}. Recarrega 16.`,
      aplicar: (j) => {
        j.essenciaMax += 8;
        j.essencia = Math.min(j.essenciaMax, j.essencia + 16);
      },
    },
    {
      id: "ataque",
      tipo: "poder",
      selo: "Poder",
      nome: "Gume afiado",
      detalhe: (j) => `Ataque ${j.ataque.min}–${j.ataque.max} → ${j.ataque.min + 2}–${j.ataque.max + 2}.`,
      aplicar: (j) => {
        j.ataque.min += 2;
        j.ataque.max += 2;
      },
    },
    {
      id: "magiaDano",
      tipo: "magia",
      selo: "Magia",
      nome: "Clarão maior",
      detalhe: (j) => `Magia ${j.magia.min}–${j.magia.max} → ${j.magia.min + 4}–${j.magia.max + 4}.`,
      aplicar: (j) => {
        j.magia.min += 4;
        j.magia.max += 4;
      },
    },
    {
      id: "magiaBarata",
      tipo: "magia",
      selo: "Magia",
      nome: "Foco sereno",
      disponivel: (j) => j.magia.custo > 10,
      detalhe: (j) => `Custo da magia ${j.magia.custo} → ${Math.max(10, j.magia.custo - 3)} essência.`,
      aplicar: (j) => {
        j.magia.custo = Math.max(10, j.magia.custo - 3);
      },
    },
    {
      id: "critico",
      tipo: "poder",
      selo: "Poder",
      nome: "Olho certeiro",
      disponivel: (j) => j.critico < 0.36,
      detalhe: (j) => `Acerto preciso ${Math.round(j.critico * 100)}% → ${Math.round((j.critico + 0.08) * 100)}%.`,
      aplicar: (j) => {
        j.critico = Math.min(0.4, j.critico + 0.08);
      },
    },
    {
      id: "guarda",
      tipo: "defesa",
      selo: "Defesa",
      nome: "Guarda de aço",
      disponivel: (j) => j.guardaReducao < 0.78,
      detalhe: () => "Defender reduz ainda mais o próximo golpe.",
      aplicar: (j) => {
        j.guardaReducao = Math.min(0.82, j.guardaReducao + 0.08);
      },
    },
    {
      id: "folego",
      tipo: "cura",
      selo: "Cura",
      nome: "Segundo fôlego",
      disponivel: (j) => j.vida < j.vidaMax,
      detalhe: (j) => `Cura 30 de vida (${j.vida} → ${Math.min(j.vidaMax, j.vida + 30)}) e +12 essência.`,
      aplicar: (j) => {
        j.vida = Math.min(j.vidaMax, j.vida + 30);
        j.essencia = Math.min(j.essenciaMax, j.essencia + 12);
      },
    },
    {
      id: "essDefesa",
      tipo: "defesa",
      selo: "Defesa",
      nome: "Postura viva",
      disponivel: (j) => j.essenciaDefesa < 12,
      detalhe: (j) => `Defender recupera ${j.essenciaDefesa} → ${j.essenciaDefesa + 3} essência.`,
      aplicar: (j) => {
        j.essenciaDefesa += 3;
      },
    },
    {
      id: "perfura",
      tipo: "magia",
      selo: "Magia",
      nome: "Clarão cortante",
      disponivel: (j) => j.magia.perfuracao < 0.74,
      detalhe: () => "Sua magia ignora mais a guarda do rival.",
      aplicar: (j) => {
        j.magia.perfuracao = Math.min(0.8, j.magia.perfuracao + 0.1);
      },
    },
  ];

  function curaValor(j) {
    return Math.max(28, Math.round(j.vidaMax * 0.45));
  }

  const els = {
    app: document.getElementById("app"),
    telaTitulo: document.getElementById("tela-titulo"),
    telaLuta: document.getElementById("tela-luta"),
    telaDescanso: document.getElementById("tela-descanso"),
    btnComecar: document.getElementById("btn-comecar"),
    btnContinuar: document.getElementById("btn-continuar"),
    btnNova: document.getElementById("btn-nova"),
    btnSom: document.getElementById("btn-som"),
    btnSomTxt: document.querySelector(".btn-som__txt"),
    modalTutorial: document.getElementById("modal-tutorial"),
    btnEntendi: document.getElementById("btn-entendi"),
    modalChefe: document.getElementById("modal-chefe"),
    chefeSelo: document.getElementById("chefe-selo"),
    chefeTitulo: document.getElementById("chefe-titulo"),
    chefeTexto: document.getElementById("chefe-texto"),
    modalFim: document.getElementById("modal-fim"),
    fimSelo: document.getElementById("fim-selo"),
    fimTitulo: document.getElementById("fim-titulo"),
    fimTexto: document.getElementById("fim-texto"),
    fimResumo: document.getElementById("fim-resumo"),
    btnRetry: document.getElementById("btn-retry"),
    btnReiniciar: document.getElementById("btn-reiniciar"),
    btnInicio: document.getElementById("btn-inicio"),
    relato: document.getElementById("relato"),
    txtRodada: document.getElementById("txt-rodada"),
    txtVez: document.getElementById("txt-vez"),
    txtCirculo: document.getElementById("txt-circulo"),
    pips: document.getElementById("pips"),
    acoes: document.getElementById("acoes"),
    btnAtacar: document.getElementById("btn-atacar"),
    btnDefender: document.getElementById("btn-defender"),
    btnMagia: document.getElementById("btn-magia"),
    detalheAtacar: document.getElementById("detalhe-atacar"),
    detalheDefender: document.getElementById("detalhe-defender"),
    detalheMagia: document.getElementById("detalhe-magia"),
    nomeJogador: document.getElementById("nome-jogador"),
    nomeInimigo: document.getElementById("nome-inimigo"),
    papelInimigo: document.getElementById("papel-inimigo"),
    placaInimigo: document.getElementById("placa-inimigo"),
    lutadorJogador: document.getElementById("lutador-jogador"),
    lutadorInimigo: document.getElementById("lutador-inimigo"),
    corpoInimigo: document.getElementById("corpo-inimigo"),
    flutuantesJogador: document.getElementById("flutuantes-jogador"),
    flutuantesInimigo: document.getElementById("flutuantes-inimigo"),
    arena: document.getElementById("arena"),
    descansoSelo: document.getElementById("descanso-selo"),
    descansoTexto: document.getElementById("descanso-texto"),
    descansoStatus: document.getElementById("descanso-status"),
    proximoRival: document.getElementById("proximo-rival"),
    proximoSilhueta: document.getElementById("proximo-silhueta"),
    proximoRotulo: document.getElementById("proximo-rotulo"),
    proximoNome: document.getElementById("proximo-nome"),
    proximoNota: document.getElementById("proximo-nota"),
    melhorias: document.getElementById("melhorias"),
  };

  const estado = {
    tela: "titulo",
    ocupado: false,
    mudo: lerFlag("mudo", false),
    viuTutorial: lerFlag("tutorial", false),
    circulo: 0,
    fase: "titulo",
    rodada: 1,
    jogador: null,
    inimigo: null,
    melhorias: [],
    resultado: null,
    audio: null,
    tutorialTravado: false,
    ignorarTituloAte: 0,
    stats: { turnos: 0, danoFeito: 0, danoTomado: 0, circulos: 0 },
  };

  function resetStats() {
    estado.stats = { turnos: 0, danoFeito: 0, danoTomado: 0, circulos: 0 };
  }

  function lerFlag(nome, padrao) {
    try {
      const bruto = localStorage.getItem(`${CHAVE}:${nome}`);
      if (bruto === null) return padrao;
      return JSON.parse(bruto);
    } catch {
      return padrao;
    }
  }

  function gravarFlag(nome, valor) {
    try {
      localStorage.setItem(`${CHAVE}:${nome}`, JSON.stringify(valor));
    } catch {
      /* armazenamento opcional */
    }
  }

  function lerCampanha() {
    try {
      const bruto = localStorage.getItem(`${CHAVE}:campanha`);
      if (!bruto) return null;
      const dados = JSON.parse(bruto);
      if (!dados || dados.v !== VERSAO) return dados && dados.jogador ? dados : null;
      return dados;
    } catch {
      return null;
    }
  }

  function gravarCampanha() {
    if (!estado.jogador) return;
    const dados = {
      v: VERSAO,
      circulo: estado.circulo,
      fase: estado.fase,
      jogador: serializarJogador(estado.jogador),
      melhorias: estado.melhorias.map((m) => m.id),
      concluida: estado.fase === "concluida",
    };
    try {
      localStorage.setItem(`${CHAVE}:campanha`, JSON.stringify(dados));
    } catch {
      /* armazenamento opcional */
    }
  }

  function apagarCampanha() {
    try {
      localStorage.removeItem(`${CHAVE}:campanha`);
    } catch {
      /* ignore */
    }
  }

  function serializarJogador(j) {
    return {
      vidaMax: j.vidaMax,
      essenciaMax: j.essenciaMax,
      vida: j.vida,
      essencia: j.essencia,
      ataque: { ...j.ataque },
      magia: { ...j.magia },
      guardaReducao: j.guardaReducao,
      essenciaDefesa: j.essenciaDefesa,
      critico: j.critico,
    };
  }

  function hidratarJogador(salvo) {
    const j = clonarLutador(NARA);
    j.vidaMax = salvo.vidaMax;
    j.essenciaMax = salvo.essenciaMax;
    j.vida = salvo.vida;
    j.essencia = salvo.essencia;
    j.ataque = { ...NARA.ataque, ...salvo.ataque };
    j.magia = { ...NARA.magia, ...salvo.magia };
    j.guardaReducao = salvo.guardaReducao;
    j.essenciaDefesa = salvo.essenciaDefesa;
    j.critico = salvo.critico;
    j.guarda = false;
    return j;
  }

  function entre(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  function esperar(ms) {
    return new Promise((ok) => setTimeout(ok, ms));
  }

  function embaralhar(lista) {
    const arr = lista.slice();
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const k = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[k]] = [arr[k], arr[i]];
    }
    return arr;
  }

  function clonarLutador(modelo) {
    return {
      id: modelo.id,
      nome: modelo.nome,
      titulo: modelo.titulo || modelo.nome,
      nota: modelo.nota || "",
      vidaMax: modelo.vidaMax,
      essenciaMax: modelo.essenciaMax,
      vida: modelo.vidaMax,
      essencia: modelo.essenciaMax,
      ataque: { ...modelo.ataque },
      magia: { ...modelo.magia },
      guardaReducao: modelo.guardaReducao,
      essenciaDefesa: modelo.essenciaDefesa,
      critico: modelo.critico,
      guarda: false,
      atingidoNestaRodada: false,
      ultimaAcao: null,
      estilo: modelo.estilo || "jogador",
      tema: modelo.tema || "",
      chefe: modelo.chefe || false,
    };
  }

  function rivalAtual() {
    return RIVAIS[CAMPANHA[estado.circulo]];
  }

  function papelDe(rival) {
    if (rival.chefe === "final") return TEXTO.chefeFinal;
    if (rival.chefe) return TEXTO.chefe;
    return TEXTO.rival;
  }

  function criarAudio() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    const ctx = new Ctx();
    const master = ctx.createGain();
    master.gain.value = 0.85;
    master.connect(ctx.destination);

    function agora() {
      return ctx.currentTime;
    }

    function env(gainNode, t0, a, d, s, r, peak) {
      const g = gainNode.gain;
      g.cancelScheduledValues(t0);
      g.setValueAtTime(0.0001, t0);
      g.linearRampToValueAtTime(peak, t0 + a);
      g.linearRampToValueAtTime(peak * s, t0 + a + d);
      g.exponentialRampToValueAtTime(0.0001, t0 + a + d + r);
    }

    function osc(tipo, freq, t0, dur, peak, detune) {
      if (estado.mudo || ctx.state === "closed") return null;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = tipo;
      o.frequency.setValueAtTime(freq, t0);
      if (detune) o.detune.setValueAtTime(detune, t0);
      g.gain.setValueAtTime(0.0001, t0);
      o.connect(g);
      g.connect(master);
      o.start(t0);
      o.stop(t0 + dur + 0.05);
      env(g, t0, Math.min(0.02, dur * 0.15), dur * 0.25, 0.55, Math.max(0.04, dur * 0.55), peak);
      return o;
    }

    function noise(t0, dur, peak, filtroTipo, filtroFreq) {
      if (estado.mudo || ctx.state === "closed") return;
      const n = Math.max(1, Math.floor(ctx.sampleRate * dur));
      const buf = ctx.createBuffer(1, n, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < n; i++) data[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const filter = ctx.createBiquadFilter();
      filter.type = filtroTipo || "bandpass";
      filter.frequency.setValueAtTime(filtroFreq || 1200, t0);
      filter.Q.value = 0.8;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t0);
      src.connect(filter);
      filter.connect(g);
      g.connect(master);
      env(g, t0, 0.005, dur * 0.2, 0.35, dur * 0.7, peak);
      src.start(t0);
      src.stop(t0 + dur + 0.02);
    }

    function sweep(tipo, f0, f1, t0, dur, peak) {
      if (estado.mudo || ctx.state === "closed") return;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = tipo;
      o.frequency.setValueAtTime(f0, t0);
      o.frequency.exponentialRampToValueAtTime(Math.max(40, f1), t0 + dur);
      g.gain.setValueAtTime(0.0001, t0);
      o.connect(g);
      g.connect(master);
      env(g, t0, 0.01, dur * 0.3, 0.4, dur * 0.55, peak);
      o.start(t0);
      o.stop(t0 + dur + 0.04);
    }

    return {
      ctx,
      acordar() {
        if (ctx.state === "suspended") ctx.resume();
      },
      atacar() {
        const t = agora();
        noise(t, 0.08, 0.045, "highpass", 900);
        sweep("sawtooth", 220, 90, t, 0.11, 0.04);
        osc("triangle", 160, t + 0.02, 0.09, 0.035);
      },
      defender() {
        const t = agora();
        osc("triangle", 380, t, 0.14, 0.04);
        osc("sine", 570, t + 0.03, 0.16, 0.028);
        noise(t, 0.06, 0.02, "lowpass", 700);
      },
      magia() {
        const t = agora();
        sweep("sawtooth", 420, 980, t, 0.18, 0.032);
        osc("sine", 660, t + 0.05, 0.2, 0.03);
        osc("sine", 990, t + 0.1, 0.18, 0.022);
        noise(t + 0.04, 0.12, 0.025, "bandpass", 2200);
      },
      hit() {
        const t = agora();
        noise(t, 0.07, 0.055, "bandpass", 450);
        sweep("square", 140, 55, t, 0.09, 0.035);
        osc("triangle", 90, t + 0.01, 0.1, 0.03);
      },
      vitoria() {
        const t = agora();
        const notas = [523.25, 659.25, 783.99, 1046.5];
        notas.forEach((f, i) => {
          osc("sine", f, t + i * 0.11, 0.22, 0.04 - i * 0.004);
          osc("triangle", f * 2, t + i * 0.11, 0.16, 0.012);
        });
      },
      derrota() {
        const t = agora();
        sweep("sawtooth", 220, 90, t, 0.28, 0.035);
        osc("triangle", 164, t + 0.12, 0.32, 0.03);
        osc("sine", 110, t + 0.22, 0.36, 0.028);
        noise(t, 0.2, 0.02, "lowpass", 400);
      },
      melhorar() {
        const t = agora();
        [523.25, 659.25, 880].forEach((f, i) => {
          osc("sine", f, t + i * 0.07, 0.18, 0.032);
        });
        noise(t + 0.05, 0.1, 0.015, "highpass", 2500);
      },
      chefe() {
        const t = agora();
        noise(t, 0.18, 0.04, "lowpass", 280);
        sweep("sawtooth", 90, 180, t, 0.22, 0.04);
        osc("triangle", 110, t + 0.05, 0.28, 0.035);
        osc("sine", 220, t + 0.16, 0.24, 0.03);
        osc("sine", 330, t + 0.28, 0.3, 0.025);
      },
      ui() {
        const t = agora();
        osc("sine", 740, t, 0.05, 0.02);
      },
    };
  }

  function atualizarSomUi() {
    els.btnSom.classList.toggle("is-mudo", estado.mudo);
    els.btnSom.setAttribute("aria-pressed", estado.mudo ? "true" : "false");
    els.btnSomTxt.textContent = estado.mudo ? TEXTO.mudo : TEXTO.som;
    els.btnSom.setAttribute("aria-label", estado.mudo ? "Ativar sons" : "Silenciar sons");
  }

  function mostrarTela(nome) {
    estado.tela = nome;
    els.telaTitulo.classList.toggle("is-ativa", nome === "titulo");
    els.telaTitulo.hidden = nome !== "titulo";
    els.telaLuta.classList.toggle("is-ativa", nome === "luta");
    els.telaLuta.hidden = nome !== "luta";
    els.telaDescanso.classList.toggle("is-ativa", nome === "descanso");
    els.telaDescanso.hidden = nome !== "descanso";
  }

  function flutuantesDe(lado) {
    return lado === "jogador" ? els.flutuantesJogador : els.flutuantesInimigo;
  }

  function soltarNumero(lado, texto, classe) {
    const caixa = flutuantesDe(lado);
    const no = document.createElement("span");
    no.className = `numero-flutuante ${classe}`;
    no.textContent = texto;
    caixa.appendChild(no);
    setTimeout(() => no.remove(), 1500);
  }

  function animar(el, classe, ms) {
    el.classList.remove(classe);
    void el.offsetWidth;
    el.classList.add(classe);
    return esperar(ms).then(() => el.classList.remove(classe));
  }

  function tremerArena(forte) {
    els.arena.classList.remove("is-treme", "is-flash", "is-treme-forte");
    void els.arena.offsetWidth;
    els.arena.classList.add("is-flash", forte ? "is-treme-forte" : "is-treme");
    return esperar(forte ? 420 : 340).then(() => {
      els.arena.classList.remove("is-treme", "is-treme-forte", "is-flash");
    });
  }

  function setBarra(preenchimento, meter, atual, maximo, txt, barraPai) {
    const pct = Math.max(0, Math.min(1, atual / maximo));
    preenchimento.style.transform = `scaleX(${pct})`;
    meter.setAttribute("aria-valuemax", String(maximo));
    meter.setAttribute("aria-valuenow", String(atual));
    txt.textContent = `${atual}/${maximo}`;
    if (barraPai) barraPai.classList.toggle("is-baixa", pct <= 0.3);
  }

  function pintarPips() {
    els.txtCirculo.textContent = TEXTO.circulo(estado.circulo + 1);
    els.pips.innerHTML = CAMPANHA.map((id, i) => {
      const chefe = RIVAIS[id].chefe ? " is-chefe" : "";
      let estadoPip = "";
      if (i < estado.circulo) estadoPip = " is-feito";
      else if (i === estado.circulo) estadoPip = " is-atual";
      return `<li class="${chefe}${estadoPip}"></li>`;
    }).join("");
  }

  function pintarHud() {
    const j = estado.jogador;
    const i = estado.inimigo;
    if (!j || !i) return;
    els.nomeJogador.textContent = j.nome;
    els.nomeInimigo.textContent = i.nome;
    els.papelInimigo.textContent = papelDe(i);
    els.placaInimigo.classList.toggle("is-chefe", !!i.chefe);
    els.txtRodada.textContent = TEXTO.turno(estado.rodada);
    pintarPips();
    setBarra(
      document.getElementById("vida-jogador-bar"),
      document.getElementById("vida-jogador-meter"),
      j.vida,
      j.vidaMax,
      document.getElementById("vida-jogador-txt"),
      document.querySelector("#placa-jogador .barra[data-tipo='vida']")
    );
    setBarra(
      document.getElementById("essencia-jogador-bar"),
      document.getElementById("essencia-jogador-meter"),
      j.essencia,
      j.essenciaMax,
      document.getElementById("essencia-jogador-txt")
    );
    setBarra(
      document.getElementById("vida-inimigo-bar"),
      document.getElementById("vida-inimigo-meter"),
      i.vida,
      i.vidaMax,
      document.getElementById("vida-inimigo-txt"),
      document.querySelector("#placa-inimigo .barra[data-tipo='vida']")
    );
    setBarra(
      document.getElementById("essencia-inimigo-bar"),
      document.getElementById("essencia-inimigo-meter"),
      i.essencia,
      i.essenciaMax,
      document.getElementById("essencia-inimigo-txt")
    );
    els.lutadorJogador.classList.toggle("is-guarda", j.guarda);
    els.lutadorInimigo.classList.toggle("is-guarda", i.guarda);
    els.detalheAtacar.textContent = `${j.ataque.min}–${j.ataque.max} dano`;
    els.detalheMagia.textContent = `${j.magia.custo} essência · ${j.magia.min}–${j.magia.max}`;
    els.detalheDefender.textContent = `Guarda +${j.essenciaDefesa} essência`;
  }

  function setBotoes(ativos) {
    const magiaOk = ativos && estado.jogador && estado.jogador.essencia >= estado.jogador.magia.custo;
    els.btnAtacar.disabled = !ativos;
    els.btnDefender.disabled = !ativos;
    els.btnMagia.disabled = !magiaOk;
    els.acoes.setAttribute("aria-disabled", ativos ? "false" : "true");
  }

  function setVezInimigo(aguardando) {
    els.telaLuta.classList.toggle("is-vez-inimigo", aguardando);
  }

  function relatar(msg) {
    els.relato.textContent = msg;
  }

  function vibrar(ms) {
    if (estado.mudo) return;
    if (navigator.vibrate) navigator.vibrate(ms);
  }

  function prepararRivalVisual(rival) {
    els.corpoInimigo.innerHTML = ARTES[rival.id];
    els.lutadorInimigo.classList.toggle("is-chefe", !!rival.chefe);
    els.lutadorJogador.classList.remove("is-cair", "is-hit", "is-ataque", "is-magia");
    els.lutadorInimigo.classList.remove("is-cair", "is-hit", "is-ataque", "is-magia");
    els.arena.dataset.tema = rival.tema;
    els.arena.classList.toggle("is-chefe", !!rival.chefe);
    els.placaInimigo.classList.toggle("is-chefe", !!rival.chefe);
  }

  async function mostrarEntradaChefe(rival) {
    if (!els.modalChefe) return;
    const final = rival.chefe === "final";
    els.chefeSelo.textContent = final ? TEXTO.entradaChefeFinal : TEXTO.entradaChefe;
    els.chefeTitulo.textContent = rival.titulo || rival.nome;
    els.chefeTexto.textContent = TEXTO.entradaChefeTexto(rival.titulo || rival.nome, rival.nota || "");
    els.modalChefe.hidden = false;
    els.telaLuta.classList.add("is-entrada-chefe");
    if (estado.audio) estado.audio.chefe();
    vibrar(final ? 36 : 24);
    await esperar(final ? 1600 : 1300);
    els.modalChefe.hidden = true;
    els.telaLuta.classList.remove("is-entrada-chefe");
  }

  async function iniciarCirculo(opcoes) {
    const opts = opcoes || {};
    const rival = rivalAtual();
    if (opts.curarJogador || estado.jogador.vida <= 0) {
      estado.jogador.vida = estado.jogador.vidaMax;
      estado.jogador.essencia = estado.jogador.essenciaMax;
    }
    estado.jogador.guarda = false;
    estado.jogador.ultimaAcao = null;
    estado.jogador.atingidoNestaRodada = false;
    estado.inimigo = clonarLutador(rival);
    estado.rodada = 1;
    estado.ocupado = true;
    estado.fase = "luta";
    estado.resultado = null;
    els.app.classList.remove("is-vitoria", "is-derrota");
    els.modalFim.hidden = true;
    if (els.modalChefe) els.modalChefe.hidden = true;
    prepararRivalVisual(rival);
    mostrarTela("luta");
    pintarHud();
    els.txtVez.textContent = TEXTO.suaVez;
    setVezInimigo(false);
    relatar(TEXTO.inicioRelato(rival.titulo, rival.nota));
    setBotoes(false);
    gravarCampanha();
    if (rival.chefe) {
      await mostrarEntradaChefe(rival);
    }
    estado.ocupado = false;
    setBotoes(true);
    els.btnAtacar.focus();
  }

  function danoBruto(ator, tipo) {
    const faixa = tipo === "magia" ? ator.magia : ator.ataque;
    let valor = entre(faixa.min, faixa.max);
    let critico = false;
    if (tipo === "atacar" && Math.random() < ator.critico) {
      valor = Math.round(valor * 1.5);
      critico = true;
    }
    return { valor, critico };
  }

  function aplicarDano(alvo, bruto, perfuracao) {
    alvo.atingidoNestaRodada = true;
    if (!alvo.guarda) {
      const dano = Math.max(1, bruto);
      alvo.vida = Math.max(0, alvo.vida - dano);
      return { dano, bloqueado: false };
    }
    const reducao = alvo.guardaReducao * (1 - perfuracao);
    const dano = Math.max(1, Math.round(bruto * (1 - reducao)));
    alvo.vida = Math.max(0, alvo.vida - dano);
    alvo.guarda = false;
    return { dano, bloqueado: true };
  }

  function estimarDano(ator, alvo, tipo) {
    const base = tipo === "magia"
      ? Math.round((ator.magia.min + ator.magia.max) / 2)
      : Math.round((ator.ataque.min + ator.ataque.max) / 2);
    if (!alvo.guarda) return base;
    const perf = tipo === "magia" ? ator.magia.perfuracao : 0;
    const reducao = alvo.guardaReducao * (1 - perf);
    return Math.max(1, Math.round(base * (1 - reducao)));
  }

  function escolherAcaoIA() {
    const eu = estado.inimigo;
    const alvo = estado.jogador;
    const podeMagia = eu.essencia >= eu.magia.custo;
    const estAtk = estimarDano(eu, alvo, "atacar");
    const estMag = podeMagia ? estimarDano(eu, alvo, "magia") : 0;
    const vidaBaixa = eu.vida / eu.vidaMax;
    const estilo = eu.estilo;

    if (alvo.vida <= estAtk) return "atacar";
    if (alvo.vida <= estMag) return "magia";

    if (estilo === "berserker") {
      if (vidaBaixa <= 0.14 && eu.ultimaAcao !== "defender") return "defender";
      if (podeMagia && Math.random() < 0.32) return "magia";
      return "atacar";
    }

    if (estilo === "mago") {
      if (podeMagia) return "magia";
      if (vidaBaixa <= 0.4 && eu.ultimaAcao !== "defender") return "defender";
      return "atacar";
    }

    if (estilo === "defensivo") {
      if (vidaBaixa <= 0.55 && eu.ultimaAcao !== "defender") return "defender";
      if (alvo.guarda && podeMagia) return "magia";
      if (podeMagia && Math.random() < 0.34) return "magia";
      if (eu.ultimaAcao !== "defender" && Math.random() < 0.38) return "defender";
      return "atacar";
    }

    if (estilo === "tanque") {
      if (vidaBaixa <= 0.5 && eu.ultimaAcao !== "defender") return "defender";
      if (alvo.guarda && podeMagia) return "magia";
      if (podeMagia && Math.random() < 0.3) return "magia";
      return "atacar";
    }

    if (estilo === "chefe") {
      if (vidaBaixa <= 0.35) {
        if (podeMagia) return "magia";
        return "atacar";
      }
      if (alvo.guarda && podeMagia) return "magia";
      if (vidaBaixa <= 0.42 && eu.ultimaAcao !== "defender") return "defender";
      if (podeMagia && Math.random() < 0.48) return "magia";
      return "atacar";
    }

    if (vidaBaixa <= 0.28 && eu.ultimaAcao !== "defender") return "defender";
    if (alvo.guarda && podeMagia) return "magia";
    if (estilo === "astuto" && podeMagia && alvo.essencia >= alvo.magia.custo && Math.random() < 0.4) {
      return "magia";
    }
    if (podeMagia && vidaBaixa > 0.32) {
      const chance = estilo === "astuto" ? 0.5 : 0.38;
      if (Math.random() < chance) return "magia";
    }
    if (vidaBaixa <= 0.45 && eu.ultimaAcao !== "defender" && Math.random() < 0.34) {
      return "defender";
    }
    return "atacar";
  }

  async function resolverAcao(atorChave, acao) {
    const ator = estado[atorChave];
    const alvoChave = atorChave === "jogador" ? "inimigo" : "jogador";
    const alvo = estado[alvoChave];
    const elAtor = atorChave === "jogador" ? els.lutadorJogador : els.lutadorInimigo;
    const elAlvo = alvoChave === "jogador" ? els.lutadorJogador : els.lutadorInimigo;
    const ladoAlvo = alvoChave;

    ator.ultimaAcao = acao;

    if (acao === "defender") {
      ator.guarda = true;
      const ganho = ator.essenciaDefesa;
      ator.essencia = Math.min(ator.essenciaMax, ator.essencia + ganho);
      elAtor.classList.add("is-guarda");
      if (estado.audio) estado.audio.defender();
      relatar(atorChave === "jogador" ? TEXTO.voceDefendeu(ganho) : TEXTO.inimigoDefendeu(ator.nome, ganho));
      soltarNumero(atorChave, TEXTO.recuouEssencia(ganho), "numero-flutuante--cura");
      pintarHud();
      await esperar(520);
      return;
    }

    if (acao === "magia") {
      if (ator.essencia < ator.magia.custo) {
        if (atorChave === "jogador") relatar(TEXTO.essenciaCurta);
        return;
      }
      ator.essencia -= ator.magia.custo;
      const { valor } = danoBruto(ator, "magia");
      const resultado = aplicarDano(alvo, valor, ator.magia.perfuracao);
      if (ator.magia.dreno) {
        const roubo = Math.min(ator.magia.dreno, alvo.essencia);
        alvo.essencia -= roubo;
        ator.essencia = Math.min(ator.essenciaMax, ator.essencia + roubo);
        if (roubo) soltarNumero(atorChave, `+${roubo}`, "numero-flutuante--cura");
      }
      if (estado.audio) estado.audio.magia();
      await animar(elAtor, "is-magia", 420);
      if (estado.audio) estado.audio.hit();
      vibrar(ator.chefe ? 28 : 18);
      if (atorChave === "jogador") estado.stats.danoFeito += resultado.dano;
      else estado.stats.danoTomado += resultado.dano;
      soltarNumero(
        ladoAlvo,
        `−${resultado.dano}`,
        resultado.bloqueado ? "numero-flutuante--guarda" : "numero-flutuante--magia"
      );
      const extra = resultado.bloqueado ? ` ${TEXTO.escudoAbsorveu}` : "";
      if (atorChave === "jogador") {
        relatar(`${TEXTO.voceMagia(resultado.dano, alvo.nome)}${extra}`);
      } else {
        relatar(`${TEXTO.inimigoMagia(ator.nome, ator.magia.nome, resultado.dano)}${extra}`);
      }
      pintarHud();
      const hit = animar(elAlvo, "is-hit", ator.chefe ? 520 : 420);
      const treme = tremerArena(!!ator.chefe);
      await Promise.all([hit, treme]);
      return;
    }

    const { valor, critico } = danoBruto(ator, "atacar");
    const resultado = aplicarDano(alvo, valor, 0);
    if (estado.audio) estado.audio.atacar();
    await animar(elAtor, "is-ataque", 380);
    if (estado.audio) estado.audio.hit();
    vibrar(ator.chefe ? 22 : 12);
    const classeNum = critico
      ? "numero-flutuante--critico"
      : resultado.bloqueado
        ? "numero-flutuante--guarda"
        : "numero-flutuante--dano";
    if (atorChave === "jogador") estado.stats.danoFeito += resultado.dano;
    else estado.stats.danoTomado += resultado.dano;
    soltarNumero(ladoAlvo, `−${resultado.dano}`, classeNum);
    const partes = [];
    if (atorChave === "jogador") partes.push(TEXTO.voceAtacou(resultado.dano, alvo.nome));
    else partes.push(TEXTO.inimigoAtacou(ator.nome, resultado.dano));
    if (critico) partes.push(TEXTO.acertoPreciso);
    if (resultado.bloqueado) partes.push(TEXTO.escudoAbsorveu);
    relatar(partes.join(" "));
    pintarHud();
    const hit = animar(elAlvo, "is-hit", critico || ator.chefe ? 500 : 400);
    const treme = tremerArena(!!(critico || ator.chefe));
    await Promise.all([hit, treme]);
  }

  function algumMorreu() {
    return estado.jogador.vida <= 0 || estado.inimigo.vida <= 0;
  }

  function mostrarFim(tipo) {
    estado.ocupado = true;
    setVezInimigo(false);
    setBotoes(false);
    if (els.fimResumo && tipo !== "campanha") {
      els.fimResumo.hidden = true;
      els.fimResumo.textContent = "";
    }
    els.app.classList.toggle("is-vitoria", tipo !== "derrota");
    els.app.classList.toggle("is-derrota", tipo === "derrota");
    els.btnRetry.hidden = tipo !== "derrota";
    els.btnReiniciar.hidden = tipo === "campanha";
    if (tipo === "derrota") {
      els.btnReiniciar.hidden = false;
      els.btnRetry.textContent = "Tentar de novo";
      els.btnReiniciar.textContent = "Reiniciar campanha";
    } else if (tipo === "campanha") {
      els.btnRetry.hidden = false;
      els.btnRetry.textContent = "Nova campanha";
      els.btnReiniciar.hidden = true;
    }
    els.modalFim.hidden = false;
    const foco = tipo === "derrota" ? els.btnRetry : (tipo === "campanha" ? els.btnRetry : els.btnInicio);
    foco.focus();
  }

  function encerrar(vitoria) {
    if (vitoria) {
      els.lutadorInimigo.classList.add("is-cair");
      if (estado.audio) estado.audio.vitoria();
      if (estado.circulo >= TOTAL_CIRCULOS - 1) {
        estado.stats.circulos = TOTAL_CIRCULOS;
        estado.fase = "concluida";
        gravarCampanha();
        els.fimSelo.textContent = TEXTO.fimSeloCampanha;
        els.fimTitulo.textContent = TEXTO.campanhaVencida;
        els.fimTexto.textContent = TEXTO.venceuCampanha(estado.inimigo.titulo, estado.rodada);
        if (els.fimResumo) {
          els.fimResumo.hidden = false;
          els.fimResumo.textContent = TEXTO.resumoCampanha(estado.stats);
        }
        mostrarFim("campanha");
        return;
      }
      irAoDescanso();
      return;
    }
    els.lutadorJogador.classList.add("is-cair");
    if (estado.audio) estado.audio.derrota();
    estado.fase = "luta";
    gravarCampanha();
    els.fimSelo.textContent = TEXTO.fimSeloLose;
    els.fimTitulo.textContent = TEXTO.derrota;
    els.fimTexto.textContent = TEXTO.perdeuPara(estado.inimigo.titulo);
    mostrarFim("derrota");
  }

  function descansoCuraLeve() {
    const j = estado.jogador;
    const ganho = Math.ceil(j.vidaMax * 0.12);
    j.vida = Math.min(j.vidaMax, j.vida + ganho);
    j.essencia = j.essenciaMax;
    j.guarda = false;
  }

  function melhoriaPorId(id) {
    return MELHORIAS.find((m) => m.id === id);
  }

  function sortearMelhorias(jogador) {
    const pool = MELHORIAS.filter((m) => !m.disponivel || m.disponivel(jogador));
    const escolhidas = [];
    const vidaBaixa = jogador.vida / jogador.vidaMax <= 0.5;
    if (vidaBaixa) {
      const cura = pool.find((m) => m.id === "cura") || pool.find((m) => m.id === "folego");
      if (cura) escolhidas.push(cura);
    }
    const resto = embaralhar(pool.filter((m) => !escolhidas.includes(m)));
    while (escolhidas.length < 3 && resto.length) escolhidas.push(resto.shift());
    if (escolhidas.length < 3) {
      const extra = embaralhar(MELHORIAS.filter((m) => !escolhidas.includes(m)));
      while (escolhidas.length < 3 && extra.length) escolhidas.push(extra.shift());
    }
    return escolhidas.slice(0, 3);
  }

  function placaStatus(titulo, valor) {
    return `<span class="descanso-chip"><span class="descanso-chip__k">${titulo}</span><span class="descanso-chip__v">${valor}</span></span>`;
  }

  function pintarDescanso() {
    const j = estado.jogador;
    const proximo = rivalAtual();
    els.descansoSelo.textContent = TEXTO.descansoSelo(estado.circulo);
    els.descansoTexto.textContent = TEXTO.descansoTexto;
    els.descansoStatus.innerHTML =
      placaStatus("Vida", `${j.vida}/${j.vidaMax}`) +
      placaStatus("Essência", `${j.essencia}/${j.essenciaMax}`) +
      placaStatus("Ataque", `${j.ataque.min}–${j.ataque.max}`) +
      placaStatus("Magia", `${j.magia.min}–${j.magia.max} · custo ${j.magia.custo}`);
    els.proximoRival.classList.toggle("is-chefe", !!proximo.chefe);
    els.proximoSilhueta.innerHTML = ARTES[proximo.id];
    els.proximoRotulo.textContent = proximo.chefe === "final"
      ? TEXTO.proximoFinal
      : proximo.chefe
        ? TEXTO.proximoChefe
        : TEXTO.proximo;
    els.proximoNome.textContent = proximo.titulo;
    els.proximoNota.textContent = proximo.nota;
    els.melhorias.innerHTML = "";
    estado.melhorias.forEach((m) => {
      const btn = document.createElement("button");
      btn.type = "button";
      const tipo = m.tipo || "poder";
      btn.className = `melhoria melhoria--${tipo}`;
      btn.dataset.melhoria = m.id;
      btn.dataset.tipo = tipo;
      const detalhe = m.detalhe(j);
      const selo = m.selo || "Reforço";
      btn.setAttribute("aria-label", `${selo}. ${m.nome}. ${detalhe}`);
      btn.innerHTML = `<span class="melhoria__selo">${selo}</span><span class="melhoria__nome">${m.nome}</span><span class="melhoria__desc">${detalhe}</span>`;
      btn.addEventListener("click", () => escolherMelhoria(m.id));
      els.melhorias.appendChild(btn);
    });
  }

  function irAoDescanso() {
    descansoCuraLeve();
    estado.stats.circulos += 1;
    estado.circulo += 1;
    estado.fase = "descanso";
    estado.melhorias = sortearMelhorias(estado.jogador);
    estado.ocupado = false;
    els.modalFim.hidden = true;
    mostrarTela("descanso");
    pintarDescanso();
    gravarCampanha();
    const primeiro = els.melhorias.querySelector(".melhoria");
    if (primeiro) primeiro.focus();
  }

  async function escolherMelhoria(id) {
    if (estado.tela !== "descanso" || estado.ocupado) return;
    const m = estado.melhorias.find((x) => x.id === id) || melhoriaPorId(id);
    if (!m) return;
    estado.ocupado = true;
    m.aplicar(estado.jogador);
    if (estado.audio) estado.audio.melhorar();
    [...els.melhorias.querySelectorAll(".melhoria")].forEach((btn) => {
      btn.disabled = true;
      btn.classList.toggle("is-escolhida", btn.dataset.melhoria === id);
    });
    const j = estado.jogador;
    els.descansoStatus.innerHTML =
      placaStatus("Vida", `${j.vida}/${j.vidaMax}`) +
      placaStatus("Essência", `${j.essencia}/${j.essenciaMax}`) +
      placaStatus("Ataque", `${j.ataque.min}–${j.ataque.max}`) +
      placaStatus("Magia", `${j.magia.min}–${j.magia.max} · custo ${j.magia.custo}`);
    await esperar(640);
    estado.melhorias = [];
    iniciarCirculo({ curarJogador: false });
  }

  async function turnoJogador(acao) {
    if (estado.ocupado || estado.tela !== "luta" || !els.modalFim.hidden) return;
    if (acao === "magia" && estado.jogador.essencia < estado.jogador.magia.custo) {
      relatar(TEXTO.essenciaCurta);
      return;
    }
    estado.ocupado = true;
    setBotoes(false);
    estado.jogador.atingidoNestaRodada = false;
    estado.inimigo.atingidoNestaRodada = false;
    await resolverAcao("jogador", acao);
    const recapJogador = els.relato.textContent;
    if (algumMorreu()) {
      estado.stats.turnos += 1;
      encerrar(estado.inimigo.vida <= 0);
      return;
    }

    els.txtVez.textContent = TEXTO.vezInimigo;
    setVezInimigo(true);
    pintarHud();
    // Tempo suficiente pra ler no celular: destaque + texto antes da ação do rival.
    await esperar(1000);
    const acaoIA = escolherAcaoIA();
    await resolverAcao("inimigo", acaoIA);
    const recapInimigo = els.relato.textContent;
    if (algumMorreu()) {
      estado.stats.turnos += 1;
      encerrar(estado.inimigo.vida <= 0);
      return;
    }

    for (const lutador of [estado.jogador, estado.inimigo]) {
      if (lutador.guarda && !lutador.atingidoNestaRodada) {
        lutador.guarda = false;
      }
    }
    estado.rodada += 1;
    estado.stats.turnos += 1;
    els.txtVez.textContent = TEXTO.suaVez;
    setVezInimigo(false);
    pintarHud();
    relatar(`${recapJogador} · ${recapInimigo}`);
    estado.ocupado = false;
    setBotoes(true);
    gravarCampanha();
  }

  function novaCampanha() {
    estado.circulo = 0;
    estado.fase = "luta";
    estado.jogador = clonarLutador(NARA);
    estado.melhorias = [];
    resetStats();
    iniciarCirculo({ curarJogador: true });
  }

  function continuarCampanha() {
    const save = lerCampanha();
    if (!save || !save.jogador || save.concluida) {
      novaCampanha();
      return;
    }
    if (!estado.stats || !estado.stats.turnos) resetStats();
    estado.circulo = Math.max(0, Math.min(TOTAL_CIRCULOS - 1, save.circulo | 0));
    estado.jogador = hidratarJogador(save.jogador);
    if (save.fase === "descanso") {
      estado.fase = "descanso";
      const ids = Array.isArray(save.melhorias) && save.melhorias.length
        ? save.melhorias
        : sortearMelhorias(estado.jogador).map((m) => m.id);
      estado.melhorias = ids.map(melhoriaPorId).filter(Boolean);
      if (!estado.melhorias.length) estado.melhorias = sortearMelhorias(estado.jogador);
      mostrarTela("descanso");
      pintarDescanso();
      return;
    }
    iniciarCirculo({ curarJogador: false });
  }

  function atualizarTituloBotoes() {
    const save = lerCampanha();
    const ativa = save && save.jogador && !save.concluida;
    els.btnContinuar.hidden = !ativa;
    if (ativa) {
      const n = Math.max(1, Math.min(TOTAL_CIRCULOS, (save.circulo | 0) + 1));
      els.btnContinuar.textContent = TEXTO.continuar(n);
    }
    els.btnComecar.hidden = ativa;
    els.btnNova.hidden = !ativa;
    if (!ativa) {
      els.btnComecar.textContent = save && save.concluida ? "Jogar de novo" : "Começar campanha";
    }
  }

  function mostrarTutorial(depois) {
    els.modalFim.hidden = true;
    estado.aposTutorial = depois || novaCampanha;
    estado.tutorialTravado = true;
    els.app.classList.add("is-tutorial");
    els.modalTutorial.hidden = false;
    els.btnEntendi.disabled = true;
    /* Evita o toque em Começar/Nova cair no Entendi (mesmo lugar da tela). */
    window.setTimeout(() => {
      if (els.modalTutorial.hidden) return;
      estado.tutorialTravado = false;
      els.btnEntendi.disabled = false;
      els.btnEntendi.focus();
    }, 550);
  }

  function fecharTutorial() {
    if (els.btnEntendi.disabled || estado.tutorialTravado) return;
    if (els.modalTutorial.hidden) return;
    estado.tutorialTravado = true;
    estado.viuTutorial = true;
    gravarFlag("tutorial", true);
    estado.ignorarTituloAte = Date.now() + 900;
    const cb = estado.aposTutorial || novaCampanha;
    estado.aposTutorial = null;
    cb();
    els.modalTutorial.hidden = true;
    els.app.classList.remove("is-tutorial");
    window.setTimeout(() => {
      estado.tutorialTravado = false;
    }, 900);
  }

  function garantirAudio() {
    if (!estado.audio) estado.audio = criarAudio();
    if (estado.audio) estado.audio.acordar();
  }

  function combatePodeReceberAtalho() {
    return estado.tela === "luta"
      && !estado.ocupado
      && els.modalFim.hidden
      && els.modalTutorial.hidden
      && els.telaDescanso.hidden;
  }

  function ligarEventos() {
    els.btnComecar.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      if (!els.modalTutorial.hidden) return;
      garantirAudio();
      if (estado.audio) estado.audio.ui();
      mostrarTutorial(novaCampanha);
    });
    els.btnContinuar.addEventListener("click", () => {
      if (!els.modalTutorial.hidden) return;
      garantirAudio();
      if (estado.audio) estado.audio.ui();
      continuarCampanha();
    });
    els.btnNova.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      if (!els.modalTutorial.hidden) return;
      garantirAudio();
      if (estado.audio) estado.audio.ui();
      mostrarTutorial(novaCampanha);
    });
    els.btnEntendi.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      garantirAudio();
      if (estado.audio) estado.audio.ui();
      fecharTutorial();
    });
    els.btnSom.addEventListener("click", () => {
      estado.mudo = !estado.mudo;
      gravarFlag("mudo", estado.mudo);
      atualizarSomUi();
      if (!estado.mudo) garantirAudio();
    });
    els.acoes.addEventListener("click", (ev) => {
      const btn = ev.target.closest("[data-acao]");
      if (!btn || btn.disabled) return;
      garantirAudio();
      turnoJogador(btn.dataset.acao);
    });
    els.btnRetry.addEventListener("click", () => {
      garantirAudio();
      if (estado.fase === "concluida") {
        mostrarTutorial(novaCampanha);
        return;
      }
      iniciarCirculo({ curarJogador: true });
    });
    els.btnReiniciar.addEventListener("click", () => {
      garantirAudio();
      mostrarTutorial(novaCampanha);
    });
    els.btnInicio.addEventListener("click", () => {
      els.modalFim.hidden = true;
      atualizarTituloBotoes();
      mostrarTela("titulo");
      const foco = els.btnContinuar.hidden ? els.btnComecar : els.btnContinuar;
      foco.focus();
    });
    document.addEventListener("keydown", (ev) => {
      if (ev.key === "s" || ev.key === "S") {
        if (ev.target && (ev.target.tagName === "INPUT" || ev.target.tagName === "TEXTAREA")) return;
        els.btnSom.click();
        return;
      }
      if (!els.modalTutorial.hidden && (ev.key === "Enter" || ev.key === " ")) {
        ev.preventDefault();
        if (!els.btnEntendi.disabled) els.btnEntendi.click();
        return;
      }
      if (estado.tela === "titulo" && (ev.key === "Enter" || ev.key === " ")) {
        if (!els.modalTutorial.hidden || Date.now() < estado.ignorarTituloAte) {
          ev.preventDefault();
          return;
        }
        ev.preventDefault();
        if (!els.btnContinuar.hidden) els.btnContinuar.click();
        else els.btnComecar.click();
        return;
      }
      const mapaLuta = { "1": "atacar", a: "atacar", A: "atacar", "2": "defender", d: "defender", D: "defender", "3": "magia", m: "magia", M: "magia" };
      if (mapaLuta[ev.key]) {
        if (!combatePodeReceberAtalho()) {
          ev.preventDefault();
          return;
        }
        ev.preventDefault();
        turnoJogador(mapaLuta[ev.key]);
      }
    });
  }

  function iniciar() {
    atualizarSomUi();
    atualizarTituloBotoes();
    mostrarTela("titulo");
    ligarEventos();
    document.title = TEXTO.titulo;
    els.app.dataset.versao = VERSAO;
  }

  iniciar();
})();
