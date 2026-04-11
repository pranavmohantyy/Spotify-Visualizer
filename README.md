# Spotify Music Visualizer

A web application that visualizes Spotify music playback with animated equalizer bars based on the track's audio analysis.

## Features

- Spotify integration for playback control
- Real-time animated bars synced with music with smooth transitions
- Dynamic gradient colors that shift across the spectrum
- Glow effects and trail animation for visual depth
- Volume control slider for easy audio adjustment
- Responsive web interface

## Setup

1. Create a Spotify app at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Set the redirect URI to `http://localhost:8000`.
3. Copy the Client ID and replace `'YOUR_SPOTIFY_CLIENT_ID'` in `app.js`.
4. Run a local server: `python3 -m http.server 8000`
5. Open `http://localhost:8000` in your browser and log in to Spotify.

## Requirements

- Spotify Premium account
- Modern web browser with JavaScript enabled

## Completed

- [x] Project structure (HTML, CSS, JS)
- [x] Spotify authentication and player integration
- [x] Audio analysis fetching from Spotify API
- [x] Canvas-based bar visualization
- [x] Improved bar animation with smoothing and colors (gradient, glow effects, trail animation)
- [x] Volume control slider

## Todo

- [ ] Add equalizer presets (e.g., rock, pop, jazz)
- [ ] Implement track progress bar
- [ ] Add support for multiple devices
- [ ] Error handling and user feedback
- [ ] Mobile responsiveness
- [ ] Documentation and code comments

AI Used for documentation
