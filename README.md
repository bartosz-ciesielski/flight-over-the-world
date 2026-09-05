# Lot nad światem

Gra w przeglądarce: lot nad fotorealistyczną Ziemią (Google 3D Tiles), zgadywanie regionu, dolot do domu i multiplayer.

**Gotowa wersja:** https://bartosz-ciesielski.github.io/lot-nad-swiatem/

## Uruchomienie u siebie

Potrzebujesz [Node.js](https://nodejs.org/) 18+ i darmowego tokenu [Cesium ion](https://ion.cesium.com/).

```bash
git clone https://github.com/bartosz-ciesielski/lot-nad-swiatem.git
cd lot-nad-swiatem
npm install
cp .env.example .env
```

1. Załóż konto na [ion.cesium.com](https://ion.cesium.com/).
2. Utwórz token (Access tokens).
3. W My Assets dodaj **Google Photorealistic 3D Tiles** (asset `2275207`).
4. Wklej token do `.env`:

```
VITE_CESIUM_ION_KEY=twój_token
```

Potem:

```bash
npm run dev
```

Otwórz adres, który poda Vite (zwykle `http://localhost:5173`). Multiplayer: jeden gracz klika Multiplayer, drugi wchodzi w skopiowany link.

## Sterowanie

`W` `A` `S` `D` — lot · `Shift` — nitro · `Ctrl` — hamulec · `T` — rozmowa (przytrzymaj) · `Esc` — pauza

## Uwagi

- Kluczy nie commituj — `.env` jest w `.gitignore`.
- Cesium ion ma miesięczny limit darmowych zapytań o kafelki. W menu mapa się nie ładuje, dopiero po starcie lotu.
- `npm run build` buduje wersję statyczną do `dist/`.
