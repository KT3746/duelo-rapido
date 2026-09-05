# Instruções para agentes (Cursor e Grok Bot)

## FAST SEMPRE DESLIGADO

Em hipótese nenhuma use modelos de IA com **Fast ligado**.

- Nunca escolha slugs com `-fast` (ex.: proibido `cursor-grok-4.6-high-fast`; use `cursor-grok-4.6-high`).
- Nunca ative o toggle **Fast** no picker de modelos.
- Subagentes e Cloud Agents devem usar `[fast=false]` no frontmatter quando aplicável.
- Se só existir variante Fast, pare e avise — não use Fast como exceção.

Esta regra tem prioridade sobre conveniência, velocidade ou economia de tokens.
