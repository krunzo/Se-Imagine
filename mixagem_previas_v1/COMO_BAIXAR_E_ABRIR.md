# Como abrir o pacote de WAVs, stems e projetos Reaper

Baixe as quatro partes do GitHub para a mesma pasta. Depois junte-as antes de extrair o ZIP. O pacote contém somente WAVs e projetos Reaper, sem scripts, relatórios ou MIDI.

No Windows, abra o Prompt de Comando nessa pasta e execute:

```bat
copy /b "WAVs_Stems_Projetos_Reaper.zip.001"+"WAVs_Stems_Projetos_Reaper.zip.002"+"WAVs_Stems_Projetos_Reaper.zip.003"+"WAVs_Stems_Projetos_Reaper.zip.004" "WAVs_Stems_Projetos_Reaper.zip"
```

No macOS/Linux:

```sh
cat 'WAVs_Stems_Projetos_Reaper.zip.001' 'WAVs_Stems_Projetos_Reaper.zip.002' 'WAVs_Stems_Projetos_Reaper.zip.003' 'WAVs_Stems_Projetos_Reaper.zip.004' > 'WAVs_Stems_Projetos_Reaper.zip'
```

Extraia WAVs_Stems_Projetos_Reaper.zip. Mantenha as pastas como estão e abra os arquivos .rpp em projetos_reaper/ ou projetos/. Não aplique os ganhos ou efeitos novamente: os WAVs individuais já têm a pré-mixagem e o reverb aprovado de Deus.

SHA-256 do ZIP reconstruído: `e0977179c3596da26a9d85c2012a4a168e522aa67a93677ef52c2c0bb11fe239`.

## Completar os projetos com parâmetros, guias e scripts

Baixe também Planos_Relatorios_Projetos_Editaveis.zip da pasta mixagem_previas_v1 e extraia no mesmo diretório do pacote de WAVs/stems. Mescle as pastas premix_dialogos_v1 e sound_design_v1. Isso acrescenta os arquivos de configuração, linhas do tempo, MIDI, relatórios e scripts sem substituir os WAVs.

Para edição no Reaper, abra os projetos .rpp. Para reconstruir a partir dos WAVs já tratados, use reconstruir_cenas.py e reconstruir_previas.py. Os scripts requerem Python, NumPy, SciPy e FFmpeg, disponíveis no ambiente original, e não chamam a ElevenLabs. Saídas de teste vão para revisoes/, preservando as prévias. Os arquivos script_producao_referencia.py são registros da produção original, não o ponto de entrada portátil.

A música continua sendo composição-guia. A aprovação artística e a sincronização à animação permanecem pendentes.
