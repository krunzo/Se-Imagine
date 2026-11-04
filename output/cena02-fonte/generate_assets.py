"""Texturas inteiramente procedurais; não chama modelos ou serviços externos."""
from pathlib import Path
import json
import numpy as np
from PIL import Image

HERE = Path(__file__).resolve().parent

def generate():
    assets = HERE / 'assets'
    assets.mkdir(exist_ok=True)
    rng = np.random.default_rng(22026)
    gray = rng.integers(110, 145, (256, 256), dtype=np.uint8)
    Image.fromarray(gray).convert('RGB').save(assets / 'grain.png')
    yy, xx = np.mgrid[-1:1:256j, -1:1:256j]
    radius = np.sqrt(xx ** 2 + yy ** 2)
    alpha = np.clip(np.exp(-radius * radius * 13) * (1-radius), 0, 1)
    glow = np.zeros((256, 256, 4), dtype=np.uint8)
    glow[:, :, :3] = [248, 213, 149]
    glow[:, :, 3] = (alpha * 255).astype('uint8')
    Image.fromarray(glow).save(assets / 'glow.png')
    manifest = {
        'status': 'PROVISORIO — não é arte ou identidade visual aprovada',
        'origin': 'Criação programática local, sem serviços pagos, sem imagem generativa.',
        'assets': [
            {'file': 'grain.png', 'role': 'Grão óptico procedural', 'seed': 22026},
            {'file': 'glow.png', 'role': 'Luz difusa localizada nas mãos'},
            {'file': '../scene.js', 'role': 'Malhas do manequim, arquitetura, chuva, partículas e lajes geradas por código'},
            {'file': '../config.js', 'role': 'Paleta, enquadramento, duração, semente e tempos de animação'},
        ],
        'audio': 'Ausente. Nenhum arquivo ElevenLabs encontrado, lido, alterado ou regenerado.',
        'character': 'Manequim sem rosto, cabelo, figurino, identidade ou semelhança pretendida com o protagonista.',
    }
    (assets / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')

if __name__ == '__main__':
    generate()
