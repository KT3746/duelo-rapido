/* LUTA — campanha de 10 círculos (Nara vs rivais originais). Visual 1.4.0. */
(() => {
  "use strict";

  const VERSAO = "1.5.1";
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
    liro: `<img class="lutador__sprite" src="img/liro.webp?v=1.5.0" alt="">`,
    dagro: `<img class="lutador__sprite" src="img/dagro.webp?v=1.5.0" alt="">`,
    velin: `<img class="lutador__sprite" src="img/velin.webp?v=1.5.0" alt="">`,
    bruma: `<img class="lutador__sprite" src="img/bruma.webp?v=1.5.0" alt="">`,
    korr: `<img class="lutador__sprite" src="img/korr.webp?v=1.5.0" alt="">`,
    sile: `<img class="lutador__sprite" src="img/sile.webp?v=1.5.0" alt="">`,
    ravo: `<img class="lutador__sprite" src="img/ravo.webp?v=1.5.0" alt="">`,
    neme: `<img class="lutador__sprite" src="img/neme.webp?v=1.5.0" alt="">`,
    orvane: `<img class="lutador__sprite" src="img/orvane.webp?v=1.5.0" alt="">`,
    aurenegra: `<img class="lutador__sprite" src="img/aurenegra.webp?v=1.5.0" alt="">`,
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
    els.txtVez.textContent = TEXTO.vezInimigo;
    void els.txtVez.offsetWidth;
    await esperar(1100);
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
    apagarCampanha();
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
      apagarCampanha();
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
