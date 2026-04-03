// Spotify Visualizer App
const clientId = 'YOUR_SPOTIFY_CLIENT_ID'; // Replace with your Spotify app client ID
const redirectUri = 'http://localhost:8000'; // Adjust if using different port

let player;
let analysis = null;
let currentTrackId = null;
let animationId;

// Login function
function login() {
    const scopes = 'streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state';
    window.location = 'https://accounts.spotify.com/authorize' +
        '?response_type=token' +
        '&client_id=' + clientId +
        '&scope=' + encodeURIComponent(scopes) +
        '&redirect_uri=' + encodeURIComponent(redirectUri);
}

// Get access token from URL hash
const hash = window.location.hash.substring(1);
const params = new URLSearchParams(hash);
const accessToken = params.get('access_token');

if (accessToken) {
    document.getElementById('login').style.display = 'none';
    document.getElementById('player').style.display = 'block';
    initPlayer(accessToken);
} else {
    document.getElementById('login-btn').addEventListener('click', login);
}

// Initialize Spotify Player
function initPlayer(token) {
    window.onSpotifyWebPlaybackSDKReady = () => {
        player = new Spotify.Player({
            name: 'Spotify Visualizer',
            getOAuthToken: cb => { cb(token); },
            volume: 0.5
        });

        player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
            animate(); // Start animation loop
        });

        player.addListener('player_state_changed', state => {
            if (state) {
                const track = state.track_window.current_track;
                if (track.id !== currentTrackId) {
                    currentTrackId = track.id;
                    fetchAnalysis(track.id, token);
                }
                // Update play/pause button
                const playPauseBtn = document.getElementById('play-pause');
                playPauseBtn.textContent = state.paused ? 'Play' : 'Pause';
            }
        });

        player.connect();
    };
}

// Fetch audio analysis for the track
async function fetchAnalysis(trackId, token) {
    try {
        const response = await fetch(`https://api.spotify.com/v1/audio-analysis/${trackId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        analysis = data;
        console.log('Analysis loaded for track:', trackId);
    } catch (error) {
        console.error('Error fetching analysis:', error);
    }
}

// Canvas and animation
const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');

function animate() {
    if (!analysis || !player) {
        animationId = requestAnimationFrame(animate);
        return;
    }

    player.getCurrentState().then(state => {
        if (state && !state.paused) {
            const position = state.position / 1000; // Convert to seconds
            const segment = analysis.segments.find(seg => seg.start <= position && seg.start + seg.duration > position);
            if (segment) {
                // Use timbre values for bar heights (12 values)
                const bars = segment.timbre.map(val => Math.max(0, val + 100) / 2); // Normalize and scale
                drawBars(bars);
            }
        } else {
            // Clear canvas when paused
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }).catch(err => console.error(err));

    animationId = requestAnimationFrame(animate);
}

function drawBars(values) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = canvas.width / values.length;
    values.forEach((val, i) => {
        const height = val * 4; // Scale height
        const x = i * barWidth;
        const y = canvas.height - height;
        ctx.fillStyle = '#1db954';
        ctx.fillRect(x, y, barWidth - 2, height);
    });
}

// Control buttons
document.getElementById('play-pause').addEventListener('click', () => {
    player.togglePlay();
});

document.getElementById('next').addEventListener('click', () => {
    player.nextTrack();
});

document.getElementById('previous').addEventListener('click', () => {
    player.previousTrack();
});