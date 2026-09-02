/* Duelo Rápido — campanha de 10 círculos (Nara vs rivais originais). */
(() => {
  "use strict";

  const VERSAO = "1.1.0";
  const CHAVE = "duelo-rapido";
  const TOTAL_CIRCULOS = 10;

  const TEXTO = {
    titulo: "Duelo Rápido",
    suaVez: "Sua vez",
    vezInimigo: "Vez do inimigo",
    turno: (n) => `Turno ${n}`,
    circulo: (n) => `Círculo ${n}/${TOTAL_CIRCULOS}`,
    voceAtacou: (dano, nome) => `Você atacou e causou ${dano} de dano em ${nome}.`,
    voceMagia: (dano, nome) => `Você lançou Clarão e causou ${dano} de dano em ${nome}.`,
    voceDefendeu: (n) => `Você se defendeu e recuperou ${n} de essência.`,
    inimigoAtacou: (nome, dano) => `${nome} atacou! Você perdeu ${dano} de vida.`,
    inimigoMagia: (nome, magia, dano) => `${nome} lançou ${magia}! Você perdeu ${dano} de vida.`,
    inimigoDefendeu: (nome, n) => `${nome} se defendeu e recuperou ${n} de essência.`,
    acertoPreciso: "Acerto preciso!",
    escudoAbsorveu: "O escudo absorveu parte do golpe.",
    essenciaCurta: "Essência insuficiente para magia.",
    recuouEssencia: (n) => `+${n} essência`,
    vitoria: "Vitória",
    derrota: "Derrota",
    campanhaVencida: "Campanha encerrada",
    venceuEm: (nome, rival, turnos) => `${nome} derrotou ${rival} em ${turnos} turnos.`,
    venceuCampanha: (rival, turnos) => `Nara fechou os dez círculos. ${rival} caiu no turno ${turnos}. O círculo inteiro é dela.`,
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
    liro: `<svg class="lutador__svg" viewBox="0 0 120 160" aria-hidden="true">
      <defs><linearGradient id="liro-corpo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8d59a"/><stop offset="1" stop-color="#6b7a32"/></linearGradient></defs>
      <path d="M78 28 L84 148" stroke="#c4a35a" stroke-width="3"/>
      <path d="M78 28 L92 40 L80 36 Z" fill="#d7c48a"/>
      <rect x="52" y="70" width="16" height="48" rx="4" fill="url(#liro-corpo)"/>
      <rect x="52" y="118" width="6" height="28" rx="2" fill="#3d4a22"/>
      <rect x="62" y="118" width="6" height="28" rx="2" fill="#3d4a22"/>
      <path d="M52 74 L38 96 L44 100 L56 80 Z" fill="#c9d48a"/>
      <path d="M68 74 L86 64 L90 72 L70 84 Z" fill="#dfe6a4"/>
      <ellipse cx="60" cy="40" rx="12" ry="13" fill="#f0e2c0"/>
      <path d="M48 38 C50 18 74 16 74 40 C66 32 54 32 48 38 Z" fill="#5c6b2a"/>
      <path d="M46 52 L74 56 L70 68 L50 64 Z" fill="#8a9a44"/>
      <circle cx="56" cy="41" r="1.6" fill="#2a3010"/>
      <circle cx="64" cy="41" r="1.6" fill="#2a3010"/>
    </svg>`,
    dagro: `<svg class="lutador__svg" viewBox="0 0 120 160" aria-hidden="true">
      <defs><linearGradient id="dagro-corpo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb089"/><stop offset="1" stop-color="#7a2b16"/></linearGradient></defs>
      <path d="M28 70 L92 70 L100 122 L20 122 Z" fill="url(#dagro-corpo)"/>
      <rect x="34" y="122" width="16" height="24" rx="3" fill="#3b1b14"/>
      <rect x="70" y="122" width="16" height="24" rx="3" fill="#3b1b14"/>
      <path d="M36 70 L18 96 L30 102 L46 78 Z" fill="#c45a32"/>
      <path d="M84 70 L110 88 L100 98 L76 80 Z" fill="#e27a42"/>
      <ellipse cx="60" cy="42" rx="20" ry="18" fill="#2a1612"/>
      <path d="M42 36 L50 18 L58 36 Z" fill="#ff8a3d"/>
      <path d="M62 36 L70 16 L78 36 Z" fill="#ff8a3d"/>
      <rect x="48" y="38" width="24" height="10" rx="3" fill="#1a0d0a"/>
      <circle cx="54" cy="43" r="2.2" fill="#ffd36a"/>
      <circle cx="66" cy="43" r="2.2" fill="#ffd36a"/>
      <path d="M40 92 L80 92" stroke="#ffb16a" stroke-width="3" opacity="0.6"/>
    </svg>`,
    velin: `<svg class="lutador__svg" viewBox="0 0 120 160" aria-hidden="true">
      <defs><linearGradient id="velin-manto" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d7c4ff"/><stop offset="1" stop-color="#3b1f6e"/></linearGradient></defs>
      <path d="M60 28 C18 48 16 130 36 150 C50 120 54 90 60 70 C66 90 70 120 84 150 C104 130 102 48 60 28 Z" fill="url(#velin-manto)"/>
      <path d="M44 40 C48 18 72 18 76 42 C66 36 54 36 44 40 Z" fill="#1b1030"/>
      <ellipse cx="60" cy="48" rx="12" ry="13" fill="#e8dffc"/>
      <path d="M48 44 L72 44 L68 58 L52 58 Z" fill="#2a1848"/>
      <circle cx="56" cy="50" r="1.8" fill="#c084fc"/>
      <circle cx="64" cy="50" r="1.8" fill="#c084fc"/>
      <circle class="rival-orbe" cx="24" cy="88" r="6" fill="#f0abfc"/>
      <circle class="rival-orbe" cx="96" cy="96" r="5" fill="#a78bfa"/>
    </svg>`,
    bruma: `<svg class="lutador__svg" viewBox="0 0 120 160" aria-hidden="true">
      <defs><linearGradient id="bruma-manto" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef6ff"/><stop offset="1" stop-color="#5a7388"/></linearGradient></defs>
      <ellipse cx="60" cy="142" rx="38" ry="10" fill="#9bb4c8" opacity="0.45"/>
      <path d="M60 32 C22 50 10 110 28 148 C48 120 50 88 60 64 C70 88 72 120 92 148 C110 110 98 50 60 32 Z" fill="url(#bruma-manto)" opacity="0.92"/>
      <ellipse cx="60" cy="46" rx="13" ry="14" fill="#f4fbff"/>
      <path d="M44 48 L76 48 L72 70 L48 70 Z" fill="#d5e4f0" opacity="0.85"/>
      <path d="M42 40 C50 28 70 28 78 42" fill="none" stroke="#c5d8e8" stroke-width="4"/>
      <circle cx="55" cy="48" r="1.7" fill="#3a5164"/>
      <circle cx="65" cy="48" r="1.7" fill="#3a5164"/>
    </svg>`,
    korr: `<svg class="lutador__svg" viewBox="0 0 120 160" aria-hidden="true">
      <defs><linearGradient id="korr-corpo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2c48a"/><stop offset="1" stop-color="#5a3a1c"/></linearGradient></defs>
      <path d="M18 68 L102 68 L112 128 L8 128 Z" fill="url(#korr-corpo)"/>
      <rect x="28" y="128" width="22" height="20" rx="2" fill="#3a2814"/>
      <rect x="70" y="128" width="22" height="20" rx="2" fill="#3a2814"/>
      <path d="M24 72 L8 108 L28 112 L40 80 Z" fill="#b8894a"/>
      <path d="M96 72 L116 100 L98 112 L84 80 Z" fill="#c99a58"/>
      <rect x="40" y="84" width="40" height="10" fill="#8a6230"/>
      <rect x="44" y="102" width="32" height="8" fill="#8a6230"/>
      <ellipse cx="60" cy="46" rx="16" ry="14" fill="#c4a06a"/>
      <rect x="48" y="42" width="24" height="8" rx="2" fill="#2a1c10"/>
      <circle cx="54" cy="46" r="2" fill="#f0d48a"/>
      <circle cx="66" cy="46" r="2" fill="#f0d48a"/>
    </svg>`,
    sile: `<svg class="lutador__svg" viewBox="0 0 120 160" aria-hidden="true">
      <defs><linearGradient id="sile-corpo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8fbff"/><stop offset="1" stop-color="#3a7ca8"/></linearGradient></defs>
      <path d="M86 18 L90 148" stroke="#9ad4f0" stroke-width="3"/>
      <polygon points="90,18 102,34 90,30 78,34" fill="#c4f0ff"/>
      <circle class="rival-orbe" cx="90" cy="18" r="6" fill="#e8ffff"/>
      <path d="M50 74 L70 74 L74 122 L46 122 Z" fill="url(#sile-corpo)"/>
      <rect x="50" y="122" width="7" height="26" rx="2" fill="#1e4a66"/>
      <rect x="63" y="122" width="7" height="26" rx="2" fill="#1e4a66"/>
      <path d="M50 78 L34 110 L42 114 L54 86 Z" fill="#bfe8f8"/>
      <path d="M70 78 L82 70 L86 78 L72 88 Z" fill="#d7f4ff"/>
      <ellipse cx="60" cy="42" rx="13" ry="14" fill="#f3fbff"/>
      <path d="M44 40 C48 8 84 8 78 44 C70 28 50 28 44 40 Z" fill="#d8f0ff"/>
      <circle cx="55" cy="43" r="1.7" fill="#245a78"/>
      <circle cx="65" cy="43" r="1.7" fill="#245a78"/>
    </svg>`,
    ravo: `<svg class="lutador__svg" viewBox="0 0 120 160" aria-hidden="true">
      <defs><linearGradient id="ravo-corpo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8a6a"/><stop offset="1" stop-color="#6a1010"/></linearGradient></defs>
      <path d="M24 66 L96 66 L104 120 L16 120 Z" fill="url(#ravo-corpo)"/>
      <rect x="32" y="120" width="18" height="26" rx="3" fill="#3a0c0c"/>
      <rect x="70" y="120" width="18" height="26" rx="3" fill="#3a0c0c"/>
      <path d="M28 70 L6 92 L22 108 L44 80 Z" fill="#d94a32"/>
      <path d="M92 70 L118 86 L108 108 L80 80 Z" fill="#ff6a40"/>
      <path d="M18 88 L4 80 L20 96" fill="#ffcc66"/>
      <path d="M110 82 L120 70 L112 96" fill="#ffcc66"/>
      <ellipse cx="60" cy="40" rx="18" ry="16" fill="#4a1210"/>
      <path d="M48 28 L52 10 L58 30 Z" fill="#ff5a3a"/>
      <path d="M58 26 L62 6 L68 28 Z" fill="#ffd36a"/>
      <path d="M68 28 L74 12 L78 30 Z" fill="#ff5a3a"/>
      <circle cx="54" cy="42" r="2.2" fill="#ffe08a"/>
      <circle cx="68" cy="42" r="2.2" fill="#ffe08a"/>
    </svg>`,
    neme: `<svg class="lutador__svg" viewBox="0 0 120 160" aria-hidden="true">
      <defs><linearGradient id="neme-corpo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7dffd4"/><stop offset="1" stop-color="#0a2e2a"/></linearGradient></defs>
      <path d="M40 88 L78 80 L86 128 L32 132 Z" fill="url(#neme-corpo)"/>
      <rect x="40" y="128" width="10" height="20" rx="2" fill="#08221e"/>
      <rect x="62" y="124" width="10" height="24" rx="2" fill="#08221e"/>
      <path d="M42 92 L22 118 L32 122 L50 98 Z" fill="#1a5c54"/>
      <path d="M76 84 L108 70 L112 78 L80 94 Z" fill="#3ae0c0"/>
      <path d="M108 70 L118 62 L114 80 Z" fill="#d7fff4"/>
      <ellipse cx="58" cy="58" rx="13" ry="12" fill="#0e2a26"/>
      <path d="M46 56 L70 54 L68 66 L48 68 Z" fill="#163a34"/>
      <circle cx="54" cy="60" r="1.8" fill="#7dffd4"/>
      <circle cx="64" cy="58" r="1.8" fill="#7dffd4"/>
    </svg>`,
    orvane: `<svg class="lutador__svg" viewBox="0 0 120 160" aria-hidden="true">
      <defs><linearGradient id="orvane-corpo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0d48a"/><stop offset="1" stop-color="#2a1210"/></linearGradient></defs>
      <path d="M88 56 C108 80 110 130 86 150 L60 120 Z" fill="#4a1c18" opacity="0.9"/>
      <path d="M26 70 L94 70 L100 124 L20 124 Z" fill="url(#orvane-corpo)"/>
      <rect x="32" y="124" width="18" height="22" rx="2" fill="#1a0e0c"/>
      <rect x="70" y="124" width="18" height="22" rx="2" fill="#1a0e0c"/>
      <path d="M30 74 L12 104 L28 108 L44 80 Z" fill="#c9a45a"/>
      <path d="M90 74 L112 96 L98 108 L78 80 Z" fill="#e0c070"/>
      <path d="M38 40 L60 18 L82 40 L74 70 L46 70 Z" fill="#2a1814"/>
      <path d="M50 36 L60 24 L70 36" fill="#e8c36a"/>
      <rect x="48" y="44" width="24" height="10" rx="2" fill="#120a08"/>
      <circle cx="54" cy="49" r="2" fill="#e8c36a"/>
      <circle cx="66" cy="49" r="2" fill="#e8c36a"/>
    </svg>`,
    aurenegra: `<svg class="lutador__svg" viewBox="0 0 120 160" aria-hidden="true">
      <defs><linearGradient id="aure-corpo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8c36a"/><stop offset="1" stop-color="#1a0820"/></linearGradient></defs>
      <circle cx="60" cy="48" r="28" fill="none" stroke="#e8c36a" stroke-width="3" opacity="0.7"/>
      <path d="M60 20 C16 50 18 130 40 152 C52 120 54 88 60 66 C66 88 68 120 80 152 C102 130 104 50 60 20 Z" fill="url(#aure-corpo)"/>
      <path d="M36 36 L60 12 L84 36 L76 28 L60 22 L44 28 Z" fill="#e8c36a"/>
      <ellipse cx="60" cy="50" rx="12" ry="13" fill="#f3ead8"/>
      <path d="M48 46 L72 46 L68 60 L52 60 Z" fill="#120814"/>
      <circle cx="55" cy="51" r="1.8" fill="#b08cff"/>
      <circle cx="65" cy="51" r="1.8" fill="#b08cff"/>
      <circle class="rival-orbe" cx="22" cy="86" r="6" fill="#e8c36a"/>
      <circle class="rival-orbe" cx="98" cy="90" r="6" fill="#b08cff"/>
    </svg>`,
  };

  const MELHORIAS = [
    {
      id: "cura",
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
      nome: "Corpo firme",
      detalhe: (j) => `Vida máxima ${j.vidaMax} → ${j.vidaMax + 12}. Cura 12 agora.`,
      aplicar: (j) => {
        j.vidaMax += 12;
        j.vida = Math.min(j.vidaMax, j.vida + 12);
      },
    },
    {
      id: "essMax",
      nome: "Poço de essência",
      detalhe: (j) => `Essência máxima ${j.essenciaMax} → ${j.essenciaMax + 8}. Recarrega 16.`,
      aplicar: (j) => {
        j.essenciaMax += 8;
        j.essencia = Math.min(j.essenciaMax, j.essencia + 16);
      },
    },
    {
      id: "ataque",
      nome: "Gume afiado",
      detalhe: (j) => `Ataque ${j.ataque.min}–${j.ataque.max} → ${j.ataque.min + 2}–${j.ataque.max + 2}.`,
      aplicar: (j) => {
        j.ataque.min += 2;
        j.ataque.max += 2;
      },
    },
    {
      id: "magiaDano",
      nome: "Clarão maior",
      detalhe: (j) => `Magia ${j.magia.min}–${j.magia.max} → ${j.magia.min + 4}–${j.magia.max + 4}.`,
      aplicar: (j) => {
        j.magia.min += 4;
        j.magia.max += 4;
      },
    },
    {
      id: "magiaBarata",
      nome: "Foco sereno",
      disponivel: (j) => j.magia.custo > 10,
      detalhe: (j) => `Custo da magia ${j.magia.custo} → ${Math.max(10, j.magia.custo - 3)} essência.`,
      aplicar: (j) => {
        j.magia.custo = Math.max(10, j.magia.custo - 3);
      },
    },
    {
      id: "critico",
      nome: "Olho certeiro",
      disponivel: (j) => j.critico < 0.36,
      detalhe: (j) => `Acerto preciso ${Math.round(j.critico * 100)}% → ${Math.round((j.critico + 0.08) * 100)}%.`,
      aplicar: (j) => {
        j.critico = Math.min(0.4, j.critico + 0.08);
      },
    },
    {
      id: "guarda",
      nome: "Guarda de aço",
      disponivel: (j) => j.guardaReducao < 0.78,
      detalhe: () => "Defender reduz ainda mais o próximo golpe.",
      aplicar: (j) => {
        j.guardaReducao = Math.min(0.82, j.guardaReducao + 0.08);
      },
    },
    {
      id: "folego",
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
      nome: "Postura viva",
      disponivel: (j) => j.essenciaDefesa < 12,
      detalhe: (j) => `Defender recupera ${j.essenciaDefesa} → ${j.essenciaDefesa + 3} essência.`,
      aplicar: (j) => {
        j.essenciaDefesa += 3;
      },
    },
    {
      id: "perfura",
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
    modalFim: document.getElementById("modal-fim"),
    fimSelo: document.getElementById("fim-selo"),
    fimTitulo: document.getElementById("fim-titulo"),
    fimTexto: document.getElementById("fim-texto"),
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
  };

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

    function tom(freq, dur, tipo, ganho) {
      if (estado.mudo || ctx.state === "closed") return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = tipo;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(ganho, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    }

    return {
      ctx,
      acordar() {
        if (ctx.state === "suspended") ctx.resume();
      },
      atacar() { tom(180, 0.12, "square", 0.05); },
      defender() { tom(320, 0.16, "triangle", 0.04); },
      magia() { tom(520, 0.22, "sawtooth", 0.035); setTimeout(() => tom(780, 0.18, "sine", 0.03), 80); },
      hit() { tom(110, 0.1, "square", 0.05); },
      vitoria() { tom(523, 0.16, "sine", 0.04); setTimeout(() => tom(659, 0.16, "sine", 0.04), 120); setTimeout(() => tom(784, 0.22, "sine", 0.04), 240); },
      derrota() { tom(196, 0.28, "triangle", 0.04); setTimeout(() => tom(147, 0.32, "sine", 0.035), 160); },
      melhorar() { tom(440, 0.12, "sine", 0.04); setTimeout(() => tom(660, 0.16, "sine", 0.04), 90); },
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
    setTimeout(() => no.remove(), 980);
  }

  function animar(el, classe, ms) {
    el.classList.remove(classe);
    void el.offsetWidth;
    el.classList.add(classe);
    return esperar(ms).then(() => el.classList.remove(classe));
  }

  function tremerArena() {
    els.arena.classList.remove("is-treme", "is-flash");
    void els.arena.offsetWidth;
    els.arena.classList.add("is-treme", "is-flash");
    return esperar(340).then(() => els.arena.classList.remove("is-treme", "is-flash"));
  }

  function setBarra(preenchimento, meter, atual, maximo, txt, barraPai) {
    const pct = Math.max(0, Math.min(1, atual / maximo));
    preenchimento.style.transform = `scaleX(${pct})`;
    meter.setAttribute("aria-valuemax", String(maximo));
    meter.setAttribute("aria-valuenow", String(atual));
    txt.textContent = String(atual);
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

  function iniciarCirculo(opcoes) {
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
    estado.ocupado = false;
    estado.fase = "luta";
    estado.resultado = null;
    els.app.classList.remove("is-vitoria", "is-derrota");
    els.modalFim.hidden = true;
    prepararRivalVisual(rival);
    mostrarTela("luta");
    pintarHud();
    els.txtVez.textContent = TEXTO.suaVez;
    relatar(TEXTO.inicioRelato(rival.titulo, rival.nota));
    setBotoes(true);
    gravarCampanha();
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
        if (roubo) soltarNumero(atorChave, `+${roubo} essência`, "numero-flutuante--cura");
      }
      if (estado.audio) estado.audio.magia();
      await animar(elAtor, "is-magia", 420);
      if (estado.audio) estado.audio.hit();
      vibrar(ator.chefe ? 28 : 18);
      const hit = animar(elAlvo, "is-hit", 360);
      const treme = tremerArena();
      await Promise.all([hit, treme]);
      const extra = resultado.bloqueado ? ` ${TEXTO.escudoAbsorveu}` : "";
      if (atorChave === "jogador") {
        relatar(`${TEXTO.voceMagia(resultado.dano, alvo.nome)}${extra}`);
      } else {
        relatar(`${TEXTO.inimigoMagia(ator.nome, ator.magia.nome, resultado.dano)}${extra}`);
      }
      soltarNumero(
        ladoAlvo,
        `−${resultado.dano}`,
        resultado.bloqueado ? "numero-flutuante--guarda" : "numero-flutuante--magia"
      );
      pintarHud();
      return;
    }

    const { valor, critico } = danoBruto(ator, "atacar");
    const resultado = aplicarDano(alvo, valor, 0);
    if (estado.audio) estado.audio.atacar();
    await animar(elAtor, "is-ataque", 380);
    if (estado.audio) estado.audio.hit();
    vibrar(ator.chefe ? 22 : 12);
    const hit = animar(elAlvo, "is-hit", 340);
    const treme = tremerArena();
    await Promise.all([hit, treme]);
    const partes = [];
    if (atorChave === "jogador") partes.push(TEXTO.voceAtacou(resultado.dano, alvo.nome));
    else partes.push(TEXTO.inimigoAtacou(ator.nome, resultado.dano));
    if (critico) partes.push(TEXTO.acertoPreciso);
    if (resultado.bloqueado) partes.push(TEXTO.escudoAbsorveu);
    relatar(partes.join(" "));
    const classeNum = critico
      ? "numero-flutuante--critico"
      : resultado.bloqueado
        ? "numero-flutuante--guarda"
        : "numero-flutuante--dano";
    soltarNumero(ladoAlvo, `−${resultado.dano}`, classeNum);
    pintarHud();
  }

  function algumMorreu() {
    return estado.jogador.vida <= 0 || estado.inimigo.vida <= 0;
  }

  function mostrarFim(tipo) {
    estado.ocupado = true;
    setBotoes(false);
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
        estado.fase = "concluida";
        gravarCampanha();
        els.fimSelo.textContent = TEXTO.fimSeloCampanha;
        els.fimTitulo.textContent = TEXTO.campanhaVencida;
        els.fimTexto.textContent = TEXTO.venceuCampanha(estado.inimigo.titulo, estado.rodada);
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
    return `<article class="placa"><div class="placa__topo"><h3 class="placa__nome">${titulo}</h3></div><p style="margin:0">${valor}</p></article>`;
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
    estado.melhorias.forEach((m, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "melhoria";
      btn.dataset.melhoria = m.id;
      btn.innerHTML = `<span class="melhoria__nome">${idx + 1}. ${m.nome}</span><span class="melhoria__desc">${m.detalhe(j)}</span>`;
      btn.addEventListener("click", () => escolherMelhoria(m.id));
      els.melhorias.appendChild(btn);
    });
  }

  function irAoDescanso() {
    descansoCuraLeve();
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
    if (algumMorreu()) {
      encerrar(estado.inimigo.vida <= 0);
      return;
    }

    els.txtVez.textContent = TEXTO.vezInimigo;
    await esperar(380);
    const acaoIA = escolherAcaoIA();
    await resolverAcao("inimigo", acaoIA);
    if (algumMorreu()) {
      encerrar(estado.inimigo.vida <= 0);
      return;
    }

    for (const lutador of [estado.jogador, estado.inimigo]) {
      if (lutador.guarda && !lutador.atingidoNestaRodada) {
        lutador.guarda = false;
      }
    }
    estado.rodada += 1;
    els.txtVez.textContent = TEXTO.suaVez;
    pintarHud();
    relatar(TEXTO.suaVezCurta);
    estado.ocupado = false;
    setBotoes(true);
    gravarCampanha();
  }

  function novaCampanha() {
    estado.circulo = 0;
    estado.fase = "luta";
    estado.jogador = clonarLutador(NARA);
    estado.melhorias = [];
    iniciarCirculo({ curarJogador: true });
  }

  function continuarCampanha() {
    const save = lerCampanha();
    if (!save || !save.jogador || save.concluida) {
      novaCampanha();
      return;
    }
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

  function abrirTutorialOu(cb) {
    if (!estado.viuTutorial) {
      estado.aposTutorial = cb;
      els.modalTutorial.hidden = false;
      els.btnEntendi.focus();
      return;
    }
    cb();
  }

  function fecharTutorial() {
    estado.viuTutorial = true;
    gravarFlag("tutorial", true);
    els.modalTutorial.hidden = true;
    const cb = estado.aposTutorial || novaCampanha;
    estado.aposTutorial = null;
    cb();
  }

  function garantirAudio() {
    if (!estado.audio) estado.audio = criarAudio();
    if (estado.audio) estado.audio.acordar();
  }

  function ligarEventos() {
    els.btnComecar.addEventListener("click", () => {
      garantirAudio();
      abrirTutorialOu(novaCampanha);
    });
    els.btnContinuar.addEventListener("click", () => {
      garantirAudio();
      abrirTutorialOu(continuarCampanha);
    });
    els.btnNova.addEventListener("click", () => {
      garantirAudio();
      abrirTutorialOu(novaCampanha);
    });
    els.btnEntendi.addEventListener("click", () => {
      garantirAudio();
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
        novaCampanha();
        return;
      }
      iniciarCirculo({ curarJogador: true });
    });
    els.btnReiniciar.addEventListener("click", () => {
      garantirAudio();
      novaCampanha();
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
        els.btnEntendi.click();
        return;
      }
      if (estado.tela === "titulo" && (ev.key === "Enter" || ev.key === " ")) {
        ev.preventDefault();
        if (!els.btnContinuar.hidden) els.btnContinuar.click();
        else els.btnComecar.click();
        return;
      }
      if (!els.modalFim.hidden && ev.key === "Enter") {
        ev.preventDefault();
        if (!els.btnRetry.hidden) els.btnRetry.click();
        return;
      }
      if (estado.tela === "descanso" && !estado.ocupado) {
        const mapaDescanso = { "1": 0, "2": 1, "3": 2 };
        if (mapaDescanso[ev.key] !== undefined) {
          ev.preventDefault();
          const m = estado.melhorias[mapaDescanso[ev.key]];
          if (m) escolherMelhoria(m.id);
        }
        return;
      }
      if (estado.tela !== "luta" || estado.ocupado || !els.modalFim.hidden) return;
      const mapa = { "1": "atacar", a: "atacar", A: "atacar", "2": "defender", d: "defender", D: "defender", "3": "magia", m: "magia", M: "magia" };
      if (mapa[ev.key]) {
        ev.preventDefault();
        turnoJogador(mapa[ev.key]);
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
