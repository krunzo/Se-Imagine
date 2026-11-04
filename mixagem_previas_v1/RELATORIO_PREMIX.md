# Pré-mixagem de diálogos — relatório técnico

**26 cenas, 125 falas, nenhuma ausente ou duplicação de fonte detectada. Nenhuma síntese ou crédito ElevenLabs.**

Todas as vozes, palavras e pontuação conferem com o manifesto. O narrador permanece Leonardo/Multilingual v2, pitch 0; protagonista somente Will 1, pitch 0; Deus utiliza diretamente os MP3 finais Large Hall já aprovados, sem reaplicar ou modificar o efeito. Originais, finais aprovados e pitch seco de Deus foram preservados com hashes e cópias no pacote.

## Tratamento realizado

Correção suave de ganho por personagem, seguida de um único ganho global para headroom. As diferenças dentro das falas e entre momentos dramáticos foram mantidas; não houve normalização rígida por frase nem alvo de loudness final YouTube.

Ganho global de segurança: -4.803 dB. Ganhos de grupo antes desse ajuste:

| Personagem | Ganho de grupo |
|---|---:|
| Bombeiro | -3.250 dB |
| Deus | -0.490 dB |
| Empresário | +0.490 dB |
| Menina | -0.390 dB |
| Mãe | -2.440 dB |
| Narrador | +4.000 dB |
| Pedestre | -1.880 dB |
| Protagonista | +1.865 dB |

As fontes não apresentaram clipping nem DC relevante. Não havia evidência técnica que justificasse EQ corretiva, compressor, de-esser ou denoise automático; esses processamentos foram evitados para preservar timbre e interpretação. Três segmentos com maior energia relativa entre 5 e 10 kHz merecem audição antes de decidir sobre de-esser: cena_09_fala_005, cena_14_fala_002, cena_26_fala_003. Esse indicador sozinho não comprova sibilância desagradável.

## Montagem e pausas

Sessão 48 kHz. WAVs PCM 24 bits. Reticências e respirações internas não foram cortadas. Os intervalos entre arquivos são provisórios e editáveis, com marcadores das rubricas. Pausa longa: referência de 1,4 s; breve: 0,4 s; demais silêncios: referências de 0,7–1 s conforme o contexto, sem pretensão de duração visual definitiva. Quando várias rubricas antecedem uma fala, foi usado o maior intervalo, sem somá-las arbitrariamente.

A fala seguinte só entra depois do fim da fala seca anterior. Nas cenas de Deus, a cauda aprovada pode continuar sob a resposta de Will; essa é uma sobreposição acústica justificada pelo espaço celestial, sem sobrepor palavras ou cortar o reverb. Os arquivos individuais contêm as caudas completas.

## Validação

Todos os WAVs de cena são 48 kHz/24 bits. WAVs com pelo menos 7 dB de headroom no pico verdadeiro medido; MP3s conferidos abaixo de −6 dBTP. Conversão para mono avaliada digitalmente, sem cancelamento relevante (as vozes centrais permanecem). Esses testes não substituem a audição humana em fones e alto-falantes, ainda pendente de avaliação.

## Entregas

- cenas_wav_48k24/: 26 WAVs de cena.
- cenas_mp3/: 26 MP3s de audição.
- individuais_48k24/: 125 itens editáveis, mono quando a fonte era mono e estéreo para Deus.
- fontes_mp3/: originais, finais aprovados e versões secas de Deus, preservados.
- previas/: A — Cena 01; B — conversa da Cena 23, em WAV e MP3.
- projetos_reaper/: 26 projetos editáveis; os ganhos já estão incorporados aos WAVs individuais, evitando duplicação.
- manifesto_mixagem.json, timeline_editavel.csv e config_mixagem.json: parâmetros, frames e decisões.
- reconstruir_cenas.py: renderizador portátil offline; projetos e scripts não chamam a ElevenLabs.

## Limitações e próxima etapa

Sincronização visual não existe ainda. A duração dos resgates, movimentos, transformação e silêncios deve ser ajustada ao animatic. A revisão artística deve ouvir naturalidade, dicção e equilíbrio; não foi declarada uma aprovação perceptiva automática. Sound design e música constam de plano separado e das três demonstrações, que aguardam avaliação antes da finalização completa.
