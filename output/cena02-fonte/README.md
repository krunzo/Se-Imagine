# SE IMAGINE — Cena 02: O impossível

Pré-visualização técnica de 15 segundos. Personagem, cenário, cor e tipografia **provisórios**. O manequim sem rosto não propõe nem substitui a aparência do protagonista.

## Assistir e editar

- O arquivo `../cena02-o-impossivel.mp4` é a referência de reprodução: 1920 × 1080, 30 FPS, 450 quadros, H.264, sem áudio.
- Abra `../cena02-previa.html` no navegador para reproduzir ou percorrer os quadros sem instalar dependências. A prévia contém código e texturas; funciona sem internet. Computadores lentos podem saltar quadros durante a reprodução interativa; o MP4 contém todos os quadros.
- Abra `index.html` para executar os arquivos separados deste projeto.
- Edite `config.js` para alterar duração, paleta, quantidade de chuva e tempos de transição. A exportação está configurada para 450 quadros a 30 FPS em `render.py`; altere também esses valores se mudar a duração.
- Edite `pose()`, `hand()` e `actor()` em `scene.js` para poses e movimentos. `setShot()` contém as duas trajetórias de câmera. `rainTime()` contém a desaceleração integrada; `supernatural()` contém o efeito de cura.

## Reproduzir a exportação

Requer Python 3.10+, Chromium ou Google Chrome e FFmpeg/FFprobe disponíveis no PATH. O JavaScript é nativo do navegador: não há npm, React, Remotion, CDN ou API de geração.

```bash
python -m pip install -r requirements.txt
python generate_assets.py
python render.py --output ../cena02-o-impossivel.mp4
```

A instalação das dependências é um passo local opcional para outro computador; a entrega já contém o MP4 pronto. A renderização usa apenas arquivos locais e bloqueia requisições HTTP/HTTPS. Se um ambiente restrito bloquear a inicialização do Chromium, será necessário permitir sua execução local; nenhuma API externa é usada.

```bash
# Exportar quadros de inspeção, sem gerar outro vídeo:
python render.py --stills ./quadros
```

## Arquivos e recursos

| Arquivo | Uso |
| --- | --- |
| `scene.js` | Projeção 3D, geometrias, rig, câmera, chuva, iluminação, composição e reprodutor |
| `config.js` | Parâmetros editáveis e identificação de arte provisória |
| `index.html` | Prévia com reprodução e barra de tempo |
| `render.py` | Exportação quadro a quadro sem perdas intermediárias e codificação H.264 |
| `generate_assets.py` | Geração local das texturas procedurais |
| `assets/grain.png` | Textura de grão óptico |
| `assets/glow.png` | Sprite de luz difusa usado nas mãos |
| `assets/manifest.json` | Origem e condição provisória dos recursos |

As malhas do manequim e do cenário, as gotas e as partículas são recursos definidos por código em `scene.js`; não há imagens de personagem omitidas do pacote. Os PNGs estão incluídos. As fontes são as fontes sans-serif e monoespaçadas do sistema, sem pretensão de corresponder à marca. Nenhum áudio foi fornecido ou gerado.

## Organização temporal

| Tempo | Acontecimento |
| --- | --- |
| 0–5 s | Chuva intensa, respiração, lento movimento lateral com aproximação, luz azul fria |
| 5–8 s | Desaceleração progressiva das gotas e redução dos respingos |
| 8–10 s | Gotas fixas em coordenadas de mundo; câmera continua; manequim ergue as mãos e inclina a cabeça |
| 9,75–10,15 s | Dissolução para um plano próximo, mantendo a continuidade das poses |
| 10,15–13,1 s | Luz dourada localizada, dedos abertos, reação corporal e redução da marca no antebraço |
| 13,1–15 s | Sustentação da descoberta e saída gradual para escuro |

O master é 16:9. Barras internas de 138 px dão ao estudo uma janela de imagem de 1920 × 804; a marca de arte provisória e o timecode ficam nas barras. Para preencher todo o master com imagem, remova os caches em `renderFrame()` e reenquadre as câmeras; não basta mudar a resolução.

Leia `../RELATORIO.md` para as limitações, recursos necessários e avaliação das 26 cenas.
