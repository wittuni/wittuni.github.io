# Pillow | To .png

```python
from PIL import Image

# Open the WebP image
with Image.open("image.webp") as img:
    # Save it as PNG
    img.save("image.png", "PNG")
```