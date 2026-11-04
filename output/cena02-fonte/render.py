"""Render determinístico, Chromium/Canvas -> PNG sem perdas -> FFmpeg/H.264.

Uso: python render.py --output ../cena02-o-impossivel.mp4
Prévia de quadros: python render.py --stills ../../work/cena02/frames
Não faz requisições HTTP, não gera som, não chama APIs.
"""
from pathlib import Path
import argparse
import base64
import json
import shutil
import subprocess
import time
from playwright.sync_api import sync_playwright
from generate_assets import generate

HERE = Path(__file__).resolve().parent

def standalone_html():
    """Prévia portátil e autossuficiente, inclusive texturas e JavaScript."""
    html = (HERE / 'index.html').read_text(encoding='utf-8')
    config = (HERE / 'config.js').read_text(encoding='utf-8')
    scene = (HERE / 'scene.js').read_text(encoding='utf-8')
    for asset in ['grain.png', 'glow.png']:
        data = base64.b64encode((HERE / 'assets' / asset).read_bytes()).decode()
        scene = scene.replace(f"'assets/{asset}'", f"'data:image/png;base64,{data}'")
    return html.replace('<script src="config.js"></script>', '<script>'+config+'</script>').replace('<script src="scene.js"></script>', '<script>'+scene+'</script>')

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', type=Path, default=HERE.parent / 'cena02-o-impossivel.mp4')
    parser.add_argument('--stills', type=Path)
    args = parser.parse_args()
    if not (HERE / 'assets/grain.png').exists():
        generate()
    browser_path = shutil.which('chromium') or shutil.which('chromium-browser') or shutil.which('google-chrome')
    if not browser_path:
        raise SystemExit('Instale Chromium ou Google Chrome localmente.')
    started = time.perf_counter()
    errors = []
    with sync_playwright() as pw:
        browser = pw.chromium.launch(executable_path=browser_path, headless=True, args=['--no-sandbox', '--disable-dev-shm-usage', '--allow-file-access-from-files', '--font-render-hinting=none'])
        page = browser.new_page(viewport={'width':1920, 'height':1080}, device_scale_factor=1)
        page.on('pageerror', lambda error: errors.append(str(error)))
        # Somente arquivos locais; impede qualquer conexão externa na renderização.
        page.route('http://**/*', lambda route: route.abort())
        page.route('https://**/*', lambda route: route.abort())
        page.set_content(standalone_html(), wait_until='load')
        page.evaluate('document.body.classList.add("render")')
        page.evaluate('window.ready')
        if args.stills:
            args.stills.mkdir(parents=True, exist_ok=True)
            for frame in [45, 135, 195, 255, 315, 375, 420]:
                png = page.evaluate('(frame) => {renderFrame(frame);return document.getElementById("film").toDataURL("image/png").split(",")[1]}', frame)
                (args.stills / f'frame-{frame:03d}.png').write_bytes(base64.b64decode(png))
            print(json.dumps({'stills': str(args.stills), 'errors': errors, 'seconds': round(time.perf_counter()-started, 1)}))
        else:
            args.output.parent.mkdir(parents=True, exist_ok=True)
            ffmpeg = subprocess.Popen(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-f', 'image2pipe', '-vcodec', 'png', '-framerate', '30', '-i', 'pipe:0', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-r', '30', '-frames:v', '450', '-movflags', '+faststart', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', str(args.output)], stdin=subprocess.PIPE)
            try:
                for frame in range(450):
                    png = page.evaluate('(frame) => {renderFrame(frame);return document.getElementById("film").toDataURL("image/png").split(",")[1]}', frame)
                    ffmpeg.stdin.write(base64.b64decode(png))
                    if frame % 30 == 0:
                        print(f'{frame}/450 quadros | {time.perf_counter()-started:.1f}s', flush=True)
                ffmpeg.stdin.close()
                if ffmpeg.wait() != 0:
                    raise RuntimeError('FFmpeg não concluiu a exportação.')
            except BaseException:
                ffmpeg.kill()
                raise
            probe = subprocess.check_output(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(args.output)])
            states = {str(f): page.evaluate('(f)=>getSceneState(f)', f) for f in [0, 149, 150, 195, 240, 270, 300, 360, 420, 449]}
            report = {'media': json.loads(probe), 'javascript_errors': errors, 'states': states, 'render_seconds': round(time.perf_counter()-started,1), 'external_requests': 'blocked', 'audio': 'none'}
            args.output.with_suffix('.validation.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
            print(f'Concluído: {args.output} | {report["render_seconds"]}s', flush=True)
        browser.close()
        if errors:
            raise SystemExit('\n'.join(errors))

if __name__ == '__main__':
    main()
