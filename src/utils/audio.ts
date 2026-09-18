// Subtle, soothing Web Audio chime for guided 4-7-8 breathwork
class CalmingChime {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playTone(freq: number = 432, type: OscillatorType = 'sine', duration: number = 1.2, volume: number = 0.15) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio autoplay blocked or unsupported
    }
  }

  playInhale() {
    this.playTone(432, 'sine', 1.5, 0.12); // Soothing 432Hz harmonic
  }

  playHold() {
    this.playTone(528, 'sine', 1.0, 0.10); // Solfeggio clarity frequency
  }

  playExhale() {
    this.playTone(396, 'sine', 2.0, 0.12); // Grounding release frequency
  }
}

export const calmingChime = new CalmingChime();
