# AC Service Parquet — sito one-page

Sito vetrina di **AC Service Parquet SAS** — posa, restauro e finitura di pavimenti in legno.
Titolare: Antonio Citriniti. Una sola pagina, in italiano, pensata per mostrare il lavoro e
generare contatti (telefono / WhatsApp — nessun form).

Sito statico: **HTML + CSS + JavaScript vanilla**, senza framework né build step.

## Struttura

```
.
├── index.html          # tutta la pagina (semantica, lang="it", SEO + JSON-LD)
├── css/styles.css       # design system "Warm Editorial" (variabili CSS)
├── js/main.js           # nav scroll-spy, menu mobile, FAQ, lightbox galleria
├── assets/
│   ├── ascparquet-hero.webp     # immagine hero
│   ├── LOGO_ZERO_CONCEPT.png    # logo certificazione (footer + sostenibilità)
│   ├── gallery/                 # 18 foto ottimizzate (.webp) usate in galleria
│   ├── wa-img/ , fb-img/        # foto originali (sorgenti — vedi .gitignore)
├── llms.txt             # riepilogo per crawler / assistenti AI
├── robots.txt
├── sitemap.xml
├── _headers             # header HTTP per Cloudflare Pages (cache + sicurezza)
└── .gitignore
```

## Sviluppo locale

Essendo un sito statico, è sufficiente un server statico qualsiasi:

```bash
python3 -m http.server 8000
# poi apri http://localhost:8000/
```

(Si può anche aprire `index.html` direttamente con `file://`, ma il server riflette meglio
il comportamento in produzione: MIME corretti e percorsi root-relative.)

## Deploy — Cloudflare Pages

DNS e dominio (`acsparquet.com`) sono già su Cloudflare. Il deploy è automatico da GitHub:

- **Build command:** _(nessuno)_
- **Build output directory:** `/` (root del repository)

Ogni push sul branch di produzione pubblica il sito. Il file `_headers` viene applicato
automaticamente da Pages per cache e header di sicurezza.

## Modificare i contenuti

- **Testo, sezioni, contatti, dati aziendali:** `index.html`.
- **Dati strutturati (Google):** due blocchi `application/ld+json` in `<head>` — uno
  `LocalBusiness`, uno `FAQPage`. Se cambi una FAQ nel corpo pagina, aggiorna anche il blocco
  `FAQPage` per coerenza.
- **Colori, font, spaziature:** variabili CSS in cima a `css/styles.css` (`:root`).

### Galleria — aggiungere o sostituire foto

Le foto in `assets/gallery/` sono versioni ottimizzate (lato lungo ≤ 1200px, WebP q82) generate
dalle originali. Per rigenerarle serve ImageMagick (`convert`):

```bash
# esempio: ottimizza una nuova foto come prossima della galleria
convert "originale.jpg" -resize '1200x1200>' -strip -quality 82 \
        -define webp:method=6 assets/gallery/g19.webp
```

Poi aggiungi in `index.html`, dentro `.masonry`, un nuovo elemento (impostando `width`/`height`
reali per evitare layout shift, e un `alt` descrittivo in italiano):

```html
<button class="masonry__item" data-full="assets/gallery/g19.webp">
  <img src="assets/gallery/g19.webp" width="900" height="1200" loading="lazy"
       alt="Descrizione della foto">
</button>
```

> Nota: `assets/wa-img/` e `assets/fb-img/` (le foto originali) sono escluse da Git tramite
> `.gitignore` — in produzione viaggia solo `assets/gallery/`. Per versionarle, rimuovi le righe
> relative dal `.gitignore`.

## Dati aziendali

| | |
|---|---|
| Ragione sociale | AC Service Parquet SAS |
| Titolare | Antonio Citriniti |
| P.IVA / C.F. | 09359060960 |
| Sede operativa | Via Corbizi 2/A, 62012 Civitanova Marche (MC), Italia |
| Sede legale | Via Vasari 17, 20851 Lissone (MB), Italia |
| Telefono / WhatsApp | +39 347 256 0943 |
| Email | info@acsparquet.com |
| Facebook | [pagina](https://www.facebook.com/people/A-C-Service-Parquet-sas/100063479745041/) |

## Note tecniche

- **Accessibilità:** palette e testi pensati per il contrasto WCAG; navigazione sempre visibile,
  link "skip to content", `aria-label` sui controlli, rispetto di `prefers-reduced-motion`.
- **Performance:** immagini WebP, `loading="lazy"` sulla galleria, `width`/`height` impostati,
  font Google con `preconnect`.
- **Logo:** logotipo (Revue Std Bold) e monogramma del favicon sono vettoriali (SVG con tracciati
  `currentColor`); il font NON è incluso nel sito, solo le lettere del marchio in forma vettoriale.
- **Favicon:** `favicon.svg` (principale), `favicon.ico` (16/32/48 px, fallback legacy),
  `apple-touch-icon.png` (180 px) — monogramma "AC" su verde brand.
- **Da valutare prima del go-live:** eventuale immagine social dedicata (attualmente l'Open Graph
  usa l'immagine hero).
