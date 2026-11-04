# Cena 02 — O impossível: técnicas, alcance e próximos recursos

## Resultado e condição artística

Foi criado um protótipo animado de 15 segundos, com chuva em movimento, desaceleração até suspensão, câmera com paralaxe, manequim articulado com respiração e reação corporal, e início de cura por luz localizada e fechamento de uma marca abstrata no antebraço. É uma demonstração de movimento, composição e efeitos, com arte provisória; não é um plano final do filme.

**Não foi possível verificar nem reproduzir a identidade visual aprovada do canal:** nenhum manual, frame aprovado, desenho de personagem ou cenário estava disponível. A tipografia e a paleta deste estudo também são provisórias. Não se estabeleceu uma nova aparência para o protagonista. O substituto sem rosto não tem cabelo, figurino, identidade ou semelhança pretendida com o personagem definitivo.

O vídeo é silencioso. Nenhum áudio da ElevenLabs estava disponível no projeto. Nenhum áudio foi criado, alterado ou regenerado. Não foram feitas chamadas pagas, nem chamadas a serviços de imagem, vídeo, voz ou música. A animação completa do filme não foi iniciada.

## Inspeção do projeto

O projeto acessível foi `/workspace/Se-Imagine`. O único arquivo versionado de conteúdo era `Video1`, com 1 byte e uma quebra de linha. Não havia roteiro de 26 cenas, storyboard, arquivos de áudio, imagens, modelos, logotipo, guia de marca ou referências de protagonista. As pastas compartilhadas e de arquivos de biblioteca também não continham recursos de produção. Não havia `AGENTS.md` aplicável nas pastas examinadas.

O arquivo `Video1` foi preservado. Os resultados ficam em `output/` e os quadros intermediários em `work/cena02/`. A inspeção se limita ao projeto e às pastas disponibilizadas; não pressupõe acesso a outros discos, contas ou bibliotecas do usuário.

## Por que Canvas + FFmpeg

A alternativa escolhida usa Canvas com câmera de perspectiva e geometria 3D leve, organizada em camadas. Ela permite demonstrar a paralisação real das trajetórias de chuva e a articulação independente do manequim sem baixar bibliotecas ou depender de uma plataforma externa. Cada quadro é calculado diretamente a partir de seu número. Isso torna a exportação repetível e permite saltar para qualquer instante no editor.

O Remotion seria útil como orquestrador de uma produção maior, com componentes de cenas, revisão editorial e montagem de áudios. Para este estudo sem recursos de arte, ele não acrescentaria por si só atuação ou qualidade de iluminação. A demonstração privilegia o sistema de animação e uma prévia local sem dependências JavaScript. A função `renderFrame(frame)` pode ser adaptada para uma composição Remotion; essa integração não faz parte desta entrega.

## Técnicas implementadas

| Técnica | Implementação e efeito visível |
| --- | --- |
| Projeção e profundidade | Câmera com posição, alvo, distância focal e pequena rotação; arquitetura, ator e gotas são reprojetados por quadro |
| Câmera | Trajetória lateral com aproximação; segundo plano mais próximo; curvas suaves com velocidade reduzida no início e no fim |
| Chuva | 3.400 partículas e 64 gotas destacadas, com posições e velocidades determinadas por semente fixa |
| Paralisação | A velocidade cai por smoothstep de 5 a 8 s; a posição usa a integral dessa curva, com continuidade de posição e velocidade; de 8 s em diante as gotas não mudam suas coordenadas de mundo |
| Leitura da suspensão | Os rastros se encurtam, os brilhos das gotas se tornam legíveis e a câmera se desloca em relação a elas; as gotas não são substituídas por outra imagem |
| Respiração | Expansão sutil do tórax e deslocamento de ombros e cabeça; não se escala o quadro inteiro |
| Atuação provisória | Dois braços, punhos, dedos e cabeça mudam de pose; as mãos se aproximam do antebraço e os dedos se abrem |
| Cura | Uma marca abstrata diminui entre 11,35 e 13,1 s; luz dourada localizada altera o sombreamento próximo e recebe partículas discretas |
| Superfícies | Malhas de elipsoides e segmentos articulados com iluminação difusa, luz de contorno e contribuição pontual da cura |
| Atmosfera | Gradientes de luz, feixe suave, névoa em camadas, vinheta e grão procedural |
| Chão molhado | Lajes, juntas, poças elípticas, reflexos estilizados e anéis de respingos; estes cessam com a chuva |
| Exportação | Quadros PNG sem perdas intermediárias enviados ao FFmpeg; H.264, CRF 17, yuv420p, 30 FPS e faststart |

O master tem **1920 × 1080, proporção 16:9, 30 FPS e 450 quadros**. A janela de imagem usa barras internas cinematográficas, com identificação persistente da arte provisória e timecode. O MP4 é a referência de velocidade; a prévia HTML pode saltar quadros em máquinas lentas.

## O que pode ser automatizado nas 26 cenas

Sem o roteiro e a lista de planos, não é responsável atribuir uma porcentagem de automação ao filme inteiro. O que este protótipo permite avaliar é a divisão do trabalho:

| Trabalho | Potencial de automação | O que precisa ser definido por pessoas |
| --- | --- | --- |
| Duração, resolução, FPS, nomes e renderização em lote | Alto | Lista de cenas e entregáveis |
| Chuva, partículas, névoa, luzes e efeitos recorrentes | Alto após aprovação dos parâmetros | Aparência, intensidade e limites narrativos dos poderes |
| Câmeras e paralaxe em cenários já preparados | Alto com trajetórias aprovadas | Enquadramento, continuidade espacial e intenção de cada plano |
| Respiração e movimentos de repouso | Alto em rig existente | Personalidade corporal, amplitude e ritmo |
| Gestos, contato entre mãos e objetos, descobertas e reações | Parcial | Poses, atuação e revisão de interseções |
| Substituição de arte em camadas | Parcial | Recortes, separação de membros, pintura de áreas ocultas e rig |
| Expressões faciais, olhar, fala e emoção | Não demonstrado aqui | Rosto aprovado, rig facial, direção de atuação e sincronização |
| Montagem com os áudios ElevenLabs já aprovados | Alto após organização | Arquivos originais, mapa de trechos e tempos; preservar os originais e verificar sincronização |
| Identidade visual e continuidade do protagonista | Exige aprovação artística | Modelo/folha de personagem, figurino, cor, proporções e referências |
| Validação técnica das exportações | Alto | Critérios de aceitação artística e revisão humana |

Uma produção das 26 cenas poderia usar um manifesto de cenas com referências aos recursos aprovados, duração e áudio original, uma biblioteca comum de efeitos e rigs, e renderização por plano. Primeiro seria necessário aprovar uma cena com arte real. Este estudo não cria nem anima as outras 25 cenas e não presume que todas possam reutilizar o mesmo enquadramento ou efeito.

## Limitações observadas

- A qualidade artística é de pré-visualização geométrica. As superfícies são facetadas; não há pele, cabelo, roupas, água com refração ou materiais de longa-metragem.
- O manequim não possui olhos ou músculos faciais. A reação é corporal e não comprova ainda a capacidade de atuar com o protagonista definitivo.
- As gotas são sprites com posição 3D e brilhos desenhados. O desfoque é aproximado; não há simulação óptica completa de lentes ou refração.
- A separação da chuva à frente e atrás do ator usa profundidade aproximada. Pode haver sobreposição inadequada em contatos próximos; uma produção final precisaria de buffer de profundidade ou máscaras por objeto.
- Névoa, reflexos e sombras são aproximações em camadas. Não há traçado de raios nem simulação volumétrica física.
- A coreografia das mãos é um rig simplificado. Contato, anatomia e interseções precisam de revisão com o personagem real.
- A marca no antebraço é uma convenção provisória para tornar a cura visível, não um evento de roteiro aprovado.
- O primeiro plano e a aproximação demonstram duas composições. Não demonstram a variedade de cenários, multidões, diálogos ou movimentos complexos das 26 cenas.
- Não há avaliação de sincronismo com narração, música ou desenho de som porque nenhum áudio foi disponibilizado.

## Recursos necessários para um plano com arte aprovada

1. Roteiro da Cena 02, storyboard e trechos exatos dos áudios originais, com timecodes desejados.
2. Folha do protagonista aprovada: frente, perfil, três quartos, proporções, paleta, figurino, mãos e expressões.
3. Para 2.5D: arquivos com fundo transparente e camadas separadas para cabeça, tórax, braços, antebraços, mãos e dedos; áreas ocultas também pintadas. Para maior liberdade de câmera: modelo 3D aprovado com rig e materiais.
4. Cenário aprovado com planos separados de primeiro plano, plano médio e fundo, ou geometria 3D; referências de chão molhado e iluminação.
5. Guia visual do canal: logotipo, fontes, cor, referências de composição e alguns frames aprovados.
6. Definição narrativa e visual da cura: onde acontece, o que muda, qual intensidade e quanto o personagem entende naquele momento.

Esses recursos permitiriam substituir os elementos provisórios mantendo o trabalho reutilizável de chuva, curva temporal, câmera e renderização. A preparação da arte e a direção de atuação ainda exigiriam revisão plano a plano.

## Conferência da entrega

`cena02-o-impossivel.validation.json` registra as características de mídia fornecidas pelo FFprobe, erros JavaScript, tempo de renderização e estados temporais da animação. `VERIFICACAO.json` registra os testes de reprodução determinística e de parada da chuva, além da integridade do MP4. O arquivo `CONTATO.jpg` reúne quadros dos três estágios para inspeção rápida, sem substituir o vídeo.
