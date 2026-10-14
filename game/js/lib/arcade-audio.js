// =========================================================================
// RETRO ARCADE AUDIO & HIGH SCORE SYSTEM
// =========================================================================

class RetroArcadeAudio {
    constructor() {
        this.ctx = null;
    }
    init() {
        if (!this.ctx) {
            try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) {
                    this.ctx = new AudioCtx();
                }
            } catch (e) {}
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }
    play(soundName) {
        if (!this.ctx) return;
        try {
            if (soundName === 'powerup') this.playPowerup();
            else if (soundName === 'explosion' || soundName === 'damage') this.playExplosion();
            else if (soundName === 'laser' || soundName === 'shoot') this.playLaser();
            else if (soundName === 'bomb') this.playBomb();
            else if (soundName === 'gameover') this.playGameOver();
            else if (soundName === 'jump') {
                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'square';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.exponentialRampToValueAtTime(320, now + 0.12);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now);
                osc.stop(now + 0.12);
            } else {
                this.playPowerup();
            }
        } catch(e) {}
    }
    playLaser() {
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.exponentialRampToValueAtTime(110, now + 0.1);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.1);
        } catch(e) {}
    }
    playExplosion() {
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const bufferSize = Math.floor(this.ctx.sampleRate * 0.25);
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, now);
            filter.frequency.linearRampToValueAtTime(80, now + 0.25);
            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);
            noise.start(now);
            noise.stop(now + 0.25);
        } catch(e) {}
    }
    playPowerup() {
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const freqs = [350, 440, 523, 659, 880];
            freqs.forEach((f, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(f, now + idx * 0.04);
                gain.gain.setValueAtTime(0.12, now + idx * 0.04);
                gain.gain.exponentialRampToValueAtTime(0.01, now + (idx + 1) * 0.04);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now + idx * 0.04);
                osc.stop(now + (idx + 1) * 0.04);
            });
        } catch(e) {}
    }
    playBomb() {
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(160, now);
            osc.frequency.exponentialRampToValueAtTime(30, now + 0.4);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.4);
        } catch(e) {}
    }
    playDamage() {
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(140, now);
            osc.frequency.linearRampToValueAtTime(50, now + 0.16);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.16);
        } catch(e) {}
    }
    playBossHit() {
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.linearRampToValueAtTime(90, now + 0.08);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.08);
        } catch(e) {}
    }
    playGameOver() {
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const freqs = [392, 370, 349, 311];
            freqs.forEach((f, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(f, now + idx * 0.15);
                gain.gain.setValueAtTime(0.15, now + idx * 0.15);
                gain.gain.exponentialRampToValueAtTime(0.01, now + (idx + 1) * 0.15);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now + idx * 0.15);
                osc.stop(now + (idx + 1) * 0.15);
            });
        } catch(e) {}
    }
}
const retroArcadeAudio = new RetroArcadeAudio();

const DEFAULT_EDGE_HIGH_SCORES = [
    { name: 'JAX', score: 12500 },
    { name: 'MAYA', score: 9800 },
    { name: 'LEO', score: 7500 },
    { name: 'SAM', score: 5200 },
    { name: 'ZOE', score: 3400 }
];

function getEdgeHighScores() {
    try {
        const stored = localStorage.getItem('disney_destiny_edge_high_scores');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch(e) {}
    return DEFAULT_EDGE_HIGH_SCORES.slice();
}

function saveEdgeHighScore(playerScore, playerName = 'RILEY') {
    let scores = getEdgeHighScores();
    scores.push({ name: playerName, score: playerScore });
    scores.sort((a, b) => b.score - a.score);
    scores = scores.slice(0, 5);
    try {
        localStorage.setItem('disney_destiny_edge_high_scores', JSON.stringify(scores));
    } catch(e) {}
    return scores;
}

