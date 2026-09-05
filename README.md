# Flight Over the World

Fly over photorealistic Earth – guess the region, find your way home, or just explore. Single player and multiplayer.

![Flight over Paris](docs/screens/00-paryz.png)

![Flight over the fields](docs/screens/04-lot.png)

## Screens

<table>
  <tr>
    <td width="50%"><img src="docs/screens/01-start.png" alt="Start screen" /></td>
    <td width="50%"><img src="docs/screens/02-menu.png" alt="Plane and mode select" /></td>
  </tr>
  <tr>
    <td align="center">Start – single or multiplayer</td>
    <td align="center">Pick a plane, mode, and map range</td>
  </tr>
  <tr>
    <td><img src="docs/screens/06-ny.png" alt="Flight over New York" /></td>
    <td><img src="docs/screens/05-crash.png" alt="Crash" /></td>
  </tr>
  <tr>
    <td align="center">Fly anywhere</td>
    <td align="center">Stay careful :)</td>
  </tr>
</table>

## Modes

- **Guess the region** – one minute of flight, then mark on the map where you are (Poland / Europe / World).
- **Fly home** – start ~30 km from the address you enter, 10 minutes to get back.
- **Free flight** – pick a city and fly.

## Controls

| Key | Action |
| --- | --- |
| `W` `A` `S` `D` | Fly |
| `Shift` | Boost |
| `Ctrl` | Brake |
| `T` | Talk (hold) |
| `Esc` | Pause |

## Run it locally

Node.js 18+ and a free [Cesium ion](https://ion.cesium.com/) token.

```bash
git clone https://github.com/bartosz-ciesielski/flight-over-the-world.git
cd flight-over-the-world
npm install
cp .env.example .env
```

1. Create an account at [ion.cesium.com](https://ion.cesium.com/).
2. Create a token (Access tokens).
3. In My Assets add **Google Photorealistic 3D Tiles** (asset `2275207`).
4. Put the token in `.env` as `VITE_CESIUM_ION_KEY=…`

```bash
npm run dev
```

Open the address from the terminal (usually `http://localhost:5173`). In multiplayer one player clicks Multiplayer, the other opens the copied link.

Do not commit the key – `.env` is in `.gitignore`. Tiles do not load in the menu, only after you start a flight.
