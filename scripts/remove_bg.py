"""Remove the black background from the BISSTECH logo JPEG and save as a transparent PNG.

Usage:
    python scripts/remove_bg.py <input.jpg> <output.png>
"""
import sys

from PIL import Image


def make_transparent(input_path: str, output_path: str) -> None:
    img = Image.open(input_path).convert("RGBA")
    pixels = img.load()
    w, h = img.size

    # Tune these if edges look off. BISSTECH logo sits on a pure black (0,0,0) bg.
    BLACK_THRESHOLD = 24  # max value a pixel can have and still be considered "background"
    FADE_RANGE = 40  # how far past the threshold alpha fades from 0 -> fully opaque

    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue
            max_c = max(r, g, b)
            if max_c <= BLACK_THRESHOLD:
                # Solid background -> fully transparent
                pixels[x, y] = (r, g, b, 0)
            else:
                # Near-black antialiased edge -> semi-transparent to avoid a dark halo
                edge = max_c - BLACK_THRESHOLD
                alpha = min(1.0, edge / FADE_RANGE) * a
                pixels[x, y] = (r, g, b, int(round(alpha)))

    # Trim the empty border so the wordmark sits tight in the image bounds.
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)

    img.save(output_path, "PNG")
    print(f"Saved transparent logo -> {output_path} ({img.size[0]}x{img.size[1]})")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)
    make_transparent(sys.argv[1], sys.argv[2])