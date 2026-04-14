// Spotify Visualizer App
const clientId = 'YOUR_SPOTIFY_CLIENT_ID'; // Replace with your Spotify app client ID
const redirectUri = 'http://localhost:8000'; // Adjust if using different port

let player;
let analysis = null;
let currentTrackId = null;
let animationId;
let previousBars = new Array(12).fill(0); // For smoothing animation
let isSeeking = false;
let currentDuration = 0;

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
                    currentDuration = track.duration_ms / 1000; // Convert to seconds
                    fetchAnalysis(track.id, token);
                    updateTrackInfo(track);
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
            updateProgress(position); // Update progress bar
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
    // Add subtle background with slight transparency for trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const barWidth = canvas.width / values.length;
    
    // Apply smoothing to create fluid animation
    const smoothedBars = values.map((val, i) => {
        previousBars[i] = previousBars[i] * 0.7 + val * 0.3; // Smooth transition
        return previousBars[i];
    });
    
    smoothedBars.forEach((height, i) => {
        const scaledHeight = height * 4; // Scale height
        const x = i * barWidth;
        const y = canvas.height - scaledHeight;
        const barX = x + 1;
        const barWidth2 = barWidth - 2;
        
        // Create gradient color based on bar position and height
        const gradient = ctx.createLinearGradient(barX, canvas.height, barX, y);
        const hue = (i / smoothedBars.length) * 360; // Color rotates across bars
        const brightness = Math.min(100, 50 + (height / 100) * 50); // Brighter when taller
        
        gradient.addColorStop(0, `hsl(${hue}, 100%, ${brightness - 20}%)`);
        gradient.addColorStop(0.7, `hsl(${hue}, 100%, ${brightness}%)`);
        gradient.addColorStop(1, `hsl(${hue}, 100%, ${brightness + 20}%)`);
        
        ctx.fillStyle = gradient;
        
        // Add glow effect
        ctx.shadowColor = `hsl(${hue}, 100%, ${brightness}%)`;
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Draw the bar
        ctx.fillRect(barX, y, barWidth2, scaledHeight);
    });
    
    // Reset shadow for next frame
    ctx.shadowBlur = 0;
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

// Volume control
const volumeSlider = document.getElementById('volume-slider');
const volumeValue = document.getElementById('volume-value');

volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value / 100; // Convert to 0-1 range
    volumeValue.textContent = e.target.value + '%';
    if (player) {
        player.setVolume(volume);
    }
});

// Progress bar control
const progressBar = document.getElementById('progress-bar');
const currentTimeDisplay = document.getElementById('current-time');
const totalTimeDisplay = document.getElementById('total-time');

progressBar.addEventListener('mousedown', () => {
    isSeeking = true;
});

progressBar.addEventListener('mouseup', (e) => {
    isSeeking = false;
    if (player && currentDuration) {
        const seekPosition = (e.target.value / 100) * currentDuration * 1000; // Convert to milliseconds
        player.seek(seekPosition);
    }
});

progressBar.addEventListener('input', (e) => {
    if (isSeeking && currentDuration) {
        const currentSeconds = (e.target.value / 100) * currentDuration;
        currentTimeDisplay.textContent = formatTime(currentSeconds);
    }
});

// Update progress bar and time display
function updateProgress(position) {
    if (!isSeeking && currentDuration) {
        const percentage = (position / currentDuration) * 100;
        progressBar.value = Math.min(100, Math.max(0, percentage));
        currentTimeDisplay.textContent = formatTime(position);
        totalTimeDisplay.textContent = formatTime(currentDuration);
    }
}

// Format seconds to MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Update track information display
function updateTrackInfo(track) {
    const trackName = document.getElementById('track-name');
    const artistName = document.getElementById('artist-name');
    const totalTime = document.getElementById('total-time');
    
    trackName.textContent = track.name;
    artistName.textContent = track.artists.map(artist => artist.name).join(', ');
    totalTime.textContent = formatTime(track.duration_ms / 1000);
}