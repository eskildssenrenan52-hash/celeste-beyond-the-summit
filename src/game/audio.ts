// @ts-nocheck — imported game code, typed under the original looser tsconfig
import { BiomeId } from './types';

class GameAudio {
  private ctx: AudioContext | null = null;
  private muted = false;
  private unlocked = false;
  private ambientGain: GainNode | null = null;
  private ambientOsc: OscillatorNode | null = null;
  private currentBiome: BiomeId | null = null;

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(m: boolean): void {
    this.muted = m;
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setTargetAtTime(m ? 0 : 0.035, this.ctx.currentTime, 0.08);
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined' || !this.unlocked) return null;
    if (!this.ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      try {
        this.ctx = new AC();
      } catch {
        return null;
      }
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public unlock(): void {
    this.unlocked = true;
    const ctx = this.ensureContext();
    if (ctx && this.currentBiome) {
      const b = this.currentBiome;
      this.currentBiome = null;
      this.updateBiomeAmbience(b);
    }
  }

  public updateBiomeAmbience(biome: BiomeId): void {
    if (this.currentBiome === biome && this.ambientOsc) return;
    this.currentBiome = biome;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const baseFreqs: Record<BiomeId, number> = {
      silver_ash: 110,
      bioluminescent: 130.81,
      frostglass: 146.83,
      obsidian_forge: 82.41,
      astral_void: 98.0,
      crimson_sakura: 164.81,
      sunken_cathedral: 92.5,
      clockwork_spire: 138.59,
      emerald_sky: 196.0,
      solar_mirage: 155.56,
      amethyst_crypt: 103.83,
      alchemical_labs: 174.61,
      aurora_zenith: 220.0,
      crimson_canyon: 116.54,
      cyber_undercity: 130.81,
      celestial_marble: 196.0,
      ebony_fen: 87.31,
      orbital_nexus: 207.65,
      twilight_garden: 164.81,
      stormcrown: 123.47,
    };

    try {
      if (!this.ambientOsc || !this.ambientGain) {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        filter.type = 'lowpass';
        filter.frequency.value = 320;
        gain.gain.value = this.muted ? 0 : 0.03;
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        this.ambientOsc = osc;
        this.ambientGain = gain;
      }
      this.ambientOsc.frequency.setTargetAtTime(baseFreqs[biome], ctx.currentTime, 0.5);
    } catch {
      // Ignore audio errors in headless environments
    }
  }

  public stopAmbience(): void {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.08);
    }
  }

  public playTone(
    freq: number,
    duration = 0.14,
    type: OscillatorType = 'triangle',
    volume = 0.08
  ): void {
    this.tone(freq, freq, duration, type, volume, 0);
  }

  private tone(
    freqStart: number,
    freqEnd: number,
    duration: number,
    type: OscillatorType = 'square',
    volume = 0.08,
    delay = 0
  ): void {
    if (this.muted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const jitter = 1 + (Math.random() - 0.5) * 0.06;
    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(30, freqStart * jitter), now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(30, freqEnd * jitter), now + duration);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.01);
  }

  public playJump(wall = false): void {
    if (wall) {
      this.tone(240, 520, 0.09, 'triangle', 0.09);
    } else {
      this.tone(190, 440, 0.095, 'triangle', 0.09);
    }
  }

  public playDash(superTech = false): void {
    if (superTech) {
      this.tone(420, 140, 0.14, 'sawtooth', 0.11);
      this.tone(660, 880, 0.12, 'triangle', 0.07, 0.02);
    } else {
      this.tone(340, 110, 0.12, 'sawtooth', 0.1);
      this.tone(220, 90, 0.09, 'square', 0.05);
    }
  }

  public playLand(heavy = false): void {
    this.tone(heavy ? 130 : 165, 55, heavy ? 0.09 : 0.05, 'triangle', heavy ? 0.09 : 0.05);
  }

  public playSpring(): void {
    this.tone(260, 720, 0.15, 'triangle', 0.1);
    this.tone(390, 860, 0.12, 'sine', 0.06, 0.03);
  }

  public playCrystal(): void {
    this.tone(587.33, 880, 0.08, 'sine', 0.08);
    this.tone(880, 1174.66, 0.11, 'triangle', 0.07, 0.04);
  }

  public playRelic(): void {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, i) => {
      this.tone(n, n * 1.02, 0.12, 'triangle', 0.085, i * 0.055);
    });
  }

  public playKeyOrSwitch(): void {
    this.tone(440, 660, 0.09, 'sine', 0.08);
    this.tone(660, 990, 0.13, 'triangle', 0.08, 0.05);
  }

  public playDeath(): void {
    this.tone(280, 70, 0.22, 'sawtooth', 0.12);
    this.tone(190, 52, 0.25, 'square', 0.09, 0.04);
  }

  public playRespawn(): void {
    this.tone(220, 440, 0.11, 'sine', 0.06);
  }

  public playEnemyHit(killed = false): void {
    if (killed) {
      this.tone(360, 95, 0.14, 'sawtooth', 0.1);
      this.tone(520, 780, 0.1, 'triangle', 0.07, 0.03);
    } else {
      this.tone(240, 140, 0.08, 'square', 0.08);
    }
  }

  public playParry(): void {
    this.tone(620, 1240, 0.11, 'triangle', 0.11);
    this.tone(930, 1480, 0.13, 'sine', 0.08, 0.02);
  }

  public playDialogueBlip(pitch = 1): void {
    this.tone(320 * pitch, 340 * pitch, 0.035, 'square', 0.035);
  }

  public playCrumble(): void {
    this.tone(140, 65, 0.14, 'sawtooth', 0.06);
  }

  public playVictory(): void {
    const chord = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    chord.forEach((n, i) => {
      this.tone(n, n, 0.3, 'triangle', 0.08, i * 0.08);
    });
  }

  public playBossRoar(): void {
    this.tone(130, 58, 0.36, 'sawtooth', 0.12);
    this.tone(92, 46, 0.42, 'square', 0.08, 0.05);
  }

  public playBossLaser(): void {
    this.tone(680, 210, 0.22, 'sawtooth', 0.1);
    this.tone(1120, 420, 0.16, 'triangle', 0.07, 0.02);
  }

  public playWaveStart(): void {
    const notes = [392.0, 493.88, 587.33];
    notes.forEach((n, i) => {
      this.tone(n, n * 1.05, 0.12, 'triangle', 0.075, i * 0.06);
    });
  }
}

export const gameAudio = new GameAudio();
