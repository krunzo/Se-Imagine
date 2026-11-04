# Três demonstrações sonoras — avaliação de direção

**Material de avaliação. Música-guia original; não trilha definitiva. Nenhuma voz regenerada, nenhum crédito ElevenLabs, nenhum recurso externo baixado.**

| Prévia | Cenas | Duração | Pico MP3 | Perda em mono |
|---|---|---:|---:|---:|
| A_Tempestade_Descoberta | 1, 2 | 39.39 s | -7.09 dBTP | -0.266 dB |
| B_Incendio_Resgate | 8, 9, 10 | 58.96 s | -7.86 dBTP | -0.083 dB |
| C_Conversa_Deus_PRIORITARIA | 19, 20, 21, 22, 23, 24 | 189.24 s | -9.19 dBTP | -0.063 dB |

## Prioridade — conversa com Deus

A Prévia C percorre as cenas 19–24 para incluir encontro, perguntas, revelações, medo, sacrifício, silêncio e consequência. Os pontos de entrada e retirada da música estão ancorados em falas reais, registrados com o texto exato em manifesto_previas.json e marcadores no projeto Reaper. Não se adicionaram falas.

- “Eu morri?”: quase-silêncio e ar celestial muito discreto.
- “Então... você está destruindo o mundo?”: inquietação mínima e notas espaçadas.
- Revelações de Deus: automação musical recua 18 dB durante a voz e a cauda; não há novo efeito em Adriano.
- “Eu só queria ajudar...”: entrada delicada do Tema do Sacrifício.
- “Então... eu vou morrer?” / “Eu tenho medo...”: música recua ainda mais; a vulnerabilidade nasce da atuação.
- “Eu queria ter mais tempo...” e pausa longa: silêncio musical respeitado.
- “Mas eles ainda têm muito a viver.”: crescendo pequeno em densidade e intensidade MIDI, sem heroísmo exagerado.
- “Eu entrego tudo.”: palavras dominam; silêncio posterior não é preenchido.
- Cena 24: abertura sutil da tristeza para a esperança; no silêncio final a música se retira.

## O que foi produzido

Ambientes procedurais de chuva, correnteza, fogo e ar celestial; efeitos suaves de trovão, respingo e assinatura dos milagres; temas-guia originais com piano/cordas/baixo sintetizados localmente. Todas as camadas têm stems separados e projetos editáveis. A soma desses recursos não foi rotulada como sound design final realista.

## Recursos ainda necessários para a versão definitiva

- Instrumentos acústicos/orquestrais de qualidade: renderização ou gravação dos MIDI/partituras-guia. A síntese local não substitui piano e cordas finais.
- Foley e gravações licenciadas de movimentos, multidão não verbal, cães, respiração de resgate, sirenes e estruturas. Não foram improvisadas falas ou gritos para completar a camada.
- Montagem final/animatic para sincronização física e duração real de ações e silêncios.
- Audição e aprovação das três prévias, com prioridade para C, em fones e alto-falantes. A checagem técnica estéreo/mono foi feita; não se afirma um teste físico que não ocorreu.

## Organização

audio/stems/ contém DX, AMB, FX e MX por prévia. audio/musicas/guias/ traz MIDI e partitura JSON originais. audio/ambientes/ e audio/efeitos/ contêm os assets procedurais. audio/previews/ contém os MP3s. audio/premixes/ contém os WAVs estéreo e mono de conferência. audio/final/ está deliberadamente sem master definitivo.

As automações de ducking já estão nos stems, também documentadas em automacoes/ducking_e_falas.csv. O diálogo do stem DX veio diretamente da pré-mixagem, sem nova EQ, compressão, pitch ou reverb. Os scripts portáteis permitem refazer a soma e ajustar os stems sem tocar na dublagem.

**A finalização da trilha e da mixagem de todo o filme está interrompida para sua avaliação, conforme solicitado.**
