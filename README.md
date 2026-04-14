# Spotify Music Visualizer

A web application that visualizes Spotify music playback with animated equalizer bars based on the track's audio analysis.

## Features

- **Spotify Integration** - Seamless playback control through Spotify Web Playback SDK
- **Real-time Animated Visualization** - Synchronized bars with smooth transitions based on audio analysis
- **Dynamic Color Gradient** - Spectrum-shifting colors across visualization bars
- **Visual Effects** - Glow effects and trail animation for enhanced depth perception
- **Volume Control** - Interactive slider for precise audio level adjustment
- **Track Progress** - Progress bar with seek functionality and real-time duration display
- **Track Information** - Live display of song name and artist metadata
- **Responsive Design** - Adaptive web interface for various screen sizes

## Setup

1. Create a Spotify app at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Set the redirect URI to `http://localhost:8000`.
3. Copy the Client ID and replace `'YOUR_SPOTIFY_CLIENT_ID'` in `app.js`.
4. Run a local server: `python3 -m http.server 8000`
5. Open `http://localhost:8000` in your browser and log in to Spotify.

## Requirements

- Spotify Premium account
- Modern web browser with JavaScript enabled

## Tech Stack

- **Frontend Framework**: Vanilla JavaScript (ES6+)
- **API Integration**: Spotify Web API and Web Playback SDK
- **Visualization**: HTML5 Canvas
- **Styling**: CSS3 (gradients, animations, responsive design)
- **Authentication**: OAuth 2.0
- **Server**: Python HTTP server (for local development)

## Completed Features

- [x] Project structure (HTML, CSS, JS)
- [x] Spotify authentication and player integration
- [x] Audio analysis fetching from Spotify API
- [x] Canvas-based bar visualization
- [x] Improved bar animation with smoothing and colors (gradient, glow effects, trail animation)
- [x] Volume control slider
- [x] Track progress bar with seek functionality
- [x] Live track information display (song name and artist)

**Project Status**: Version 1.0.0 - Production Ready

## Future Enhancements (Maybe later lol)

- [ ] Add equalizer presets (e.g., rock, pop, jazz)
- [ ] Add support for multiple devices
- [ ] Enhanced error handling and user feedback
- [ ] Mobile responsiveness optimization
- [ ] Code comments and detailed documentation

---

**Version:** 1.0.0  
**Last Updated:** April 2026
