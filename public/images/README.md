# Product images

Files here are served at `/images/<file>` and referenced from
`src/data/catalog.json`. Two kinds of image are used:

- **Product photo** — the large image on the card and the review-panel
  thumbnail (`image` on a product).
- **Variant swatch** — the small color-label thumbnail shown inside a variant
  chip and review row, e.g. the camera next to "White" / "Black"
  (`thumbnail` on a variant).

If a referenced file is missing, the UI falls back to a neutral placeholder, so
the app still runs.

## Product photos

| File | Product |
| --- | --- |
| `cam-v4.png` | Wyze Cam v4 |
| `cam-v3.png` | Wyze Cam Pan v3 |
| `cam-v2.png` | Wyze Cam Floodlight v2 |
| `doorbell.png` | Wyze Duo Cam Doorbell |
| `battery-cam.png` | Wyze Battery Cam Pro |
| `motion-sensor.png` | Wyze Sense Motion Sensor |
| `sense-hub.png` | Wyze Sense Hub |
| `microSD.png` | Wyze MicroSD Card (256GB) |
| `cam-unlimited-icon.svg` | Cam Unlimited plan |
| `cam-plus-icon.svg` | Cam Plus plan |
| `Satisfaction Badge.svg` | Satisfaction guarantee |

## Variant swatch thumbnails

| File | Product · Variant |
| --- | --- |
| `white-cam-v4.png` / `grey-cam-v4.png` / `black-cam-v4.png` | Wyze Cam v4 · White / Grey / Black |
| `white-cam-v3.png` / `black-cam-v3.png` | Wyze Cam Pan v3 · White / Black |
| `white-cam-v2.png` / `black-cam-v2.png` | Wyze Cam Floodlight v2 · White / Black |
| `white-cam-v1.png` / `black-cam-v1.png` | Wyze Battery Cam Pro · White / Black |

Full-size variant artwork can optionally be assigned through a variant's
`image` field. Until supplied, the card keeps the product's primary image while
the variant thumbnail and label still update in the review.
