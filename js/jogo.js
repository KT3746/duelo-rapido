/* Duelo Rápido — motor do duelo em turnos (Nara vs Dagro/Velin). */
(() => {
  "use strict";

  const VERSAO = "1.0.1";
  const CHAVE = "duelo-rapido";

  const TEXTO = {
    titulo: "Duelo Rápido",
    suaVez: "Sua vez",
    vezInimigo: "Vez do inimigo",
    turno: (n) => `Turno ${n}`,
    voceAtacou: "Você atacou!",
    voceDefendeu: "Você se defendeu!",
    voceMagia: "Você lançou Clarão!",
    inimigoAtacou: (nome) => `${nome} atacou!`,
    inimigoDefendeu: (nome) => `${nome} se defendeu!`,
    inimigoMagia: (nome, magia) => `${nome} lançou ${magia}!`,
    acertoPreciso: "Acerto preciso!",
    escudoAbsorveu: "O escudo absorveu parte do golpe!",
    essenciaCurta: "Essência insuficiente para magia.",
    recuouEssencia: (n) => `+${n} essência`,
    vitoria: "Vitória",
    derrota: "Derrota",
    venceuEm: (nome, rival, turnos) => `${nome} derrotou ${rival} em ${turnos} turnos.`,
    perdeuPara: (rival) => `${rival} venceu o círculo. Levante e tente de novo.`,
    fimSeloWin: "Círculo encerrado",
    fimSeloLose: "Você caiu",
    inicioRelato: "O círculo se fecha. Escolha o primeiro golpe.",
    som: "Som",
    mudo: "Mudo",
  };

  const NARA = {
    id: "nara",
    nome: "Nara",
    vidaMax: 100,
    essenciaMax: 40,
    ataque: { min: 12, max: 16 },
    magia: { min: 24, max: 30, custo: 16, nome: "Clarão", perfuracao: 0.5 },
    guardaReducao: 0.6,
    essenciaDefesa: 5,
    critico: 0.12,
  };

  const RIVAIS = {
    dagro: {
      id: "dagro",
      nome: "Dagro",
      vidaMax: 95,
      essenciaMax: 32,
      ataque: { min: 11, max: 15 },
      magia: { min: 20, max: 26, custo: 14, nome: "Brasa", perfuracao: 0.35, dreno: 0 },
      guardaReducao: 0.55,
      essenciaDefesa: 4,
      critico: 0.1,
      estilo: "agressivo",
    },
    velin: {
      id: "velin",
      nome: "Velin",
      vidaMax: 88,
      essenciaMax: 48,
      ataque: { min: 10, max: 14 },
      magia: { min: 21, max: 27, custo: 15, nome: "Dreno", perfuracao: 0.55, dreno: 5 },
      guardaReducao: 0.5,
      essenciaDefesa: 6,
      critico: 0.12,
      estilo: "astuto",
    },
  };

  const els = {
    app: document.getElementById("app"),
    telaTitulo: document.getElementById("tela-titulo"),
    telaLuta: document.getElementById("tela-luta"),
    btnComecar: document.getElementById("btn-comecar"),
    btnSom: document.getElementById("btn-som"),
    btnSomTxt: document.querySelector(".btn-som__txt"),
    modalTutorial: document.getElementById("modal-tutorial"),
    btnEntendi: document.getElementById("btn-entendi"),
    modalFim: document.getElementById("modal-fim"),
    fimSelo: document.getElementById("fim-selo"),
    fimTitulo: document.getElementById("fim-titulo"),
    fimTexto: document.getElementById("fim-texto"),
    btnRevancha: document.getElementById("btn-revancha"),
    btnOutro: document.getElementById("btn-outro"),
    btnInicio: document.getElementById("btn-inicio"),
    relato: document.getElementById("relato"),
    txtRodada: document.getElementById("txt-rodada"),
    txtVez: document.getElementById("txt-vez"),
    acoes: document.getElementById("acoes"),
    btnAtacar: document.getElementById("btn-atacar"),
    btnDefender: document.getElementById("btn-defender"),
    btnMagia: document.getElementById("btn-magia"),
    detalheAtacar: document.getElementById("detalhe-atacar"),
    detalheMagia: document.getElementById("detalhe-magia"),
    nomeJogador: document.getElementById("nome-jogador"),
    nomeInimigo: document.getElementById("nome-inimigo"),
    lutadorJogador: document.getElementById("lutador-jogador"),
    lutadorDagro: document.getElementById("lutador-dagro"),
    lutadorVelin: document.getElementById("lutador-velin"),
    flutuantesJogador: document.getElementById("flutuantes-jogador"),
    flutuantesDagro: document.getElementById("flutuantes-dagro"),
    flutuantesVelin: document.getElementById("flutuantes-velin"),
  };

  const estado = {
    tela: "titulo",
    ocupado: false,
    mudo: lerFlag("mudo", false),
    viuTutorial: lerFlag("tutorial", false),
    venceuDagro: lerFlag("venceu-dagro", false),
    rivalId: "dagro",
    rodada: 1,
    jogador: null,
    inimigo: null,
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

  function entre(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  function esperar(ms) {
    return new Promise((ok) => setTimeout(ok, ms));
  }

  function clonarLutador(modelo) {
    return {
      id: modelo.id,
      nome: modelo.nome,
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
    };
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
  }

  function lutadorInimigoEl() {
    return estado.rivalId === "velin" ? els.lutadorVelin : els.lutadorDagro;
  }

  function flutuantesDe(lado) {
    if (lado === "jogador") return els.flutuantesJogador;
    return estado.rivalId === "velin" ? els.flutuantesVelin : els.flutuantesDagro;
  }

  function soltarNumero(lado, texto, classe) {
    const caixa = flutuantesDe(lado);
    const no = document.createElement("span");
    no.className = `numero-flutuante ${classe}`;
    no.textContent = texto;
    caixa.appendChild(no);
    setTimeout(() => no.remove(), 900);
  }

  function animar(el, classe, ms) {
    el.classList.remove(classe);
    void el.offsetWidth;
    el.classList.add(classe);
    return esperar(ms).then(() => el.classList.remove(classe));
  }

  function setBarra(preenchimento, meter, atual, maximo, txt, barraPai) {
    const pct = Math.max(0, Math.min(1, atual / maximo));
    preenchimento.style.transform = `scaleX(${pct})`;
    meter.setAttribute("aria-valuemax", String(maximo));
    meter.setAttribute("aria-valuenow", String(atual));
    txt.textContent = String(atual);
    if (barraPai) barraPai.classList.toggle("is-baixa", pct <= 0.3);
  }

  function pintarHud() {
    const j = estado.jogador;
    const i = estado.inimigo;
    els.nomeJogador.textContent = j.nome;
    els.nomeInimigo.textContent = i.nome;
    els.txtRodada.textContent = TEXTO.turno(estado.rodada);
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
    lutadorInimigoEl().classList.toggle("is-guarda", i.guarda);
    els.detalheAtacar.textContent = `${NARA.ataque.min}–${NARA.ataque.max} dano`;
    els.detalheMagia.textContent = `${NARA.magia.custo} essência · ${NARA.magia.min}–${NARA.magia.max}`;
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

  function prepararRivalVisual(id) {
    const velin = id === "velin";
    els.lutadorDagro.hidden = velin;
    els.lutadorVelin.hidden = !velin;
    els.lutadorDagro.classList.toggle("is-visivel", !velin);
    els.lutadorJogador.classList.remove("is-cair", "is-hit", "is-ataque", "is-magia");
    els.lutadorDagro.classList.remove("is-cair", "is-hit", "is-ataque", "is-magia");
    els.lutadorVelin.classList.remove("is-cair", "is-hit", "is-ataque", "is-magia");
  }

  function iniciarDuelo(rivalId) {
    estado.rivalId = rivalId;
    estado.rodada = 1;
    estado.jogador = clonarLutador(NARA);
    estado.inimigo = clonarLutador(RIVAIS[rivalId]);
    estado.ocupado = false;
    els.app.classList.remove("is-vitoria", "is-derrota");
    els.modalFim.hidden = true;
    prepararRivalVisual(rivalId);
    mostrarTela("luta");
    pintarHud();
    els.txtVez.textContent = TEXTO.suaVez;
    relatar(TEXTO.inicioRelato);
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
    const base = tipo === "magia" ? Math.round((ator.magia.min + ator.magia.max) / 2) : Math.round((ator.ataque.min + ator.ataque.max) / 2);
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

    if (alvo.vida <= estAtk) return "atacar";
    if (alvo.vida <= estMag) return "magia";

    const vidaBaixa = eu.vida / eu.vidaMax;
    if (vidaBaixa <= 0.28 && eu.ultimaAcao !== "defender") return "defender";

    if (alvo.guarda && podeMagia) return "magia";

    if (eu.estilo === "astuto" && podeMagia && alvo.essencia >= alvo.magia.custo && Math.random() < 0.4) {
      return "magia";
    }

    if (podeMagia && vidaBaixa > 0.32) {
      const chance = eu.estilo === "astuto" ? 0.5 : 0.38;
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
    const elAtor = atorChave === "jogador" ? els.lutadorJogador : lutadorInimigoEl();
    const elAlvo = alvoChave === "jogador" ? els.lutadorJogador : lutadorInimigoEl();
    const ladoAlvo = alvoChave;

    ator.ultimaAcao = acao;

    if (acao === "defender") {
      ator.guarda = true;
      const ganho = ator.essenciaDefesa;
      ator.essencia = Math.min(ator.essenciaMax, ator.essencia + ganho);
      elAtor.classList.add("is-guarda");
      if (estado.audio) estado.audio.defender();
      relatar(atorChave === "jogador" ? TEXTO.voceDefendeu : TEXTO.inimigoDefendeu(ator.nome));
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
      }
      if (estado.audio) estado.audio.magia();
      await animar(elAtor, "is-magia", 420);
      if (estado.audio) estado.audio.hit();
      await animar(elAlvo, "is-hit", 360);
      vibrar(18);
      const baseMagia = atorChave === "jogador" ? TEXTO.voceMagia : TEXTO.inimigoMagia(ator.nome, ator.magia.nome);
      if (resultado.bloqueado) {
        relatar(`${baseMagia} ${TEXTO.escudoAbsorveu}`);
        soltarNumero(ladoAlvo, `−${resultado.dano}`, "numero-flutuante--guarda");
      } else {
        relatar(baseMagia);
        soltarNumero(ladoAlvo, `−${resultado.dano}`, "numero-flutuante--dano");
      }
      pintarHud();
      return;
    }

    const { valor, critico } = danoBruto(ator, "atacar");
    const resultado = aplicarDano(alvo, valor, 0);
    if (estado.audio) estado.audio.atacar();
    await animar(elAtor, "is-ataque", 380);
    if (estado.audio) estado.audio.hit();
    await animar(elAlvo, "is-hit", 340);
    vibrar(12);
    const baseAtaque = atorChave === "jogador" ? TEXTO.voceAtacou : TEXTO.inimigoAtacou(ator.nome);
    if (critico) {
      relatar(`${baseAtaque} ${TEXTO.acertoPreciso}`);
      soltarNumero(ladoAlvo, `−${resultado.dano}`, "numero-flutuante--critico");
    } else if (resultado.bloqueado) {
      relatar(`${baseAtaque} ${TEXTO.escudoAbsorveu}`);
      soltarNumero(ladoAlvo, `−${resultado.dano}`, "numero-flutuante--guarda");
    } else {
      relatar(baseAtaque);
      soltarNumero(ladoAlvo, `−${resultado.dano}`, "numero-flutuante--dano");
    }
    pintarHud();
  }

  function algumMorreu() {
    return estado.jogador.vida <= 0 || estado.inimigo.vida <= 0;
  }

  function encerrar(vitoria) {
    estado.ocupado = true;
    setBotoes(false);
    els.app.classList.toggle("is-vitoria", vitoria);
    els.app.classList.toggle("is-derrota", !vitoria);
    if (vitoria) {
      lutadorInimigoEl().classList.add("is-cair");
      if (estado.audio) estado.audio.vitoria();
      els.fimSelo.textContent = TEXTO.fimSeloWin;
      els.fimTitulo.textContent = TEXTO.vitoria;
      els.fimTexto.textContent = TEXTO.venceuEm(estado.jogador.nome, estado.inimigo.nome, estado.rodada);
      if (estado.rivalId === "dagro") {
        estado.venceuDagro = true;
        gravarFlag("venceu-dagro", true);
        els.btnOutro.hidden = false;
        els.btnOutro.textContent = "Desafiar Velin";
      } else {
        els.btnOutro.hidden = false;
        els.btnOutro.textContent = "Enfrentar Dagro";
      }
    } else {
      els.lutadorJogador.classList.add("is-cair");
      if (estado.audio) estado.audio.derrota();
      els.fimSelo.textContent = TEXTO.fimSeloLose;
      els.fimTitulo.textContent = TEXTO.derrota;
      els.fimTexto.textContent = TEXTO.perdeuPara(estado.inimigo.nome);
      els.btnOutro.hidden = !estado.venceuDagro;
      if (estado.venceuDagro) {
        els.btnOutro.textContent = estado.rivalId === "dagro" ? "Desafiar Velin" : "Enfrentar Dagro";
      }
    }
    els.modalFim.hidden = false;
    els.btnRevancha.focus();
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
    relatar("Sua vez — uma ação.");
    estado.ocupado = false;
    setBotoes(true);
  }

  function abrirTutorialOuJogar() {
    if (!estado.viuTutorial) {
      els.modalTutorial.hidden = false;
      els.btnEntendi.focus();
      return;
    }
    iniciarDuelo("dagro");
  }

  function fecharTutorial() {
    estado.viuTutorial = true;
    gravarFlag("tutorial", true);
    els.modalTutorial.hidden = true;
    iniciarDuelo("dagro");
  }

  function garantirAudio() {
    if (!estado.audio) estado.audio = criarAudio();
    if (estado.audio) estado.audio.acordar();
  }

  function ligarEventos() {
    els.btnComecar.addEventListener("click", () => {
      garantirAudio();
      abrirTutorialOuJogar();
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
    els.btnRevancha.addEventListener("click", () => iniciarDuelo(estado.rivalId));
    els.btnOutro.addEventListener("click", () => {
      const proximo = estado.rivalId === "dagro" ? "velin" : "dagro";
      iniciarDuelo(proximo);
    });
    els.btnInicio.addEventListener("click", () => {
      els.modalFim.hidden = true;
      mostrarTela("titulo");
      els.btnComecar.focus();
    });
    document.addEventListener("keydown", (ev) => {
      if (ev.key === "s" || ev.key === "S") {
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
        els.btnComecar.click();
        return;
      }
      if (!els.modalFim.hidden && ev.key === "Enter") {
        ev.preventDefault();
        els.btnRevancha.click();
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
    mostrarTela("titulo");
    ligarEventos();
    document.title = `${TEXTO.titulo}`;
    els.app.dataset.versao = VERSAO;
  }

  iniciar();
})();
