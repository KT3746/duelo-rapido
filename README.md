# Duelo Rápido

Jogo de luta em turnos, original e curto, feito para o navegador. Você controla **Nara** contra um rival: escolha exatamente uma ação por turno — **Atacar**, **Defender** ou **Magia** — e feche o duelo em poucos rounds.

Jogue online: [https://kt3746.github.io/duelo-rapido/](https://kt3746.github.io/duelo-rapido/)

## Como jogar

1. Toque em **Começar duelo**.
2. No seu turno, escolha **uma** ação:
   - **Atacar** — dano firme, sem custo.
   - **Defender** — reduz o próximo golpe e recupera um pouco de essência.
   - **Magia (Clarão)** — dano alto, gasta essência e perfura parte da guarda.
3. O rival responde com a mesma lógica.
4. Quem zerar a vida do outro vence. Duelos costumam durar de 5 a 12 turnos.

Depois da primeira vitória contra **Dagro**, você pode desafiar **Velin**, uma rival que drena essência.

Atalhos no teclado: `1` / `A` atacar, `2` / `D` defender, `3` / `M` magia, `S` som.

## Abrir no computador

Não precisa instalar nada nem de servidor.

1. Baixe ou clone este repositório.
2. Abra o arquivo `index.html` no navegador.

Se preferir um servidor local:

```bash
python3 -m http.server 8080
```

Depois acesse `http://localhost:8080/`.

O jogo é estático (HTML, CSS e JavaScript). Depois de carregado, funciona sem rede. Os sons são gerados no próprio navegador e podem ser silenciados.

## Personagens

- **Nara** — duelista do véu-ciano. Você.
- **Dagro** — bruto das forjas. Primeiro desafio.
- **Velin** — sombra do fosso. Desafio extra após vencer Dagro.

IP original. Sem nomes, artes ou imitações de franquias alheias.

## Tecnologias

Página estática. Sem backend. Layout pensado para celular e desktop, com botões grandes e contraste alto.
