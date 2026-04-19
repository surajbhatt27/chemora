
// Web Audio API for synthetic sounds
class SoundEffects {
  private audioContext: AudioContext | null = null;
  
  private initAudio() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    // Resume if suspended (browser autoplay policies)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }
  
  // Click sound
  click() {
    try {
      const ctx = this.initAudio();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = 880;
      gainNode.gain.value = 0.15;
      
      oscillator.type = 'sine';
      
      gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.1);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.05);
    } catch (e) {
      // Silent fail
    }
  }
  
  // Success sound
  success() {
    try {
      const ctx = this.initAudio();
      const notes = [523.25, 659.25, 783.99]; 
      
      notes.forEach((freq, i) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.value = freq;
        gainNode.gain.value = 0.1;
        
        const startTime = ctx.currentTime + (i * 0.08);
        gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + 0.2);
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.15);
      });
    } catch (e) {}
  }
  
  // Pop sound - for confetti
  pop() {
    try {
      const ctx = this.initAudio();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = 440;
      gainNode.gain.value = 0.08;
      
      oscillator.type = 'triangle';
      
      gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.08);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.05);
    } catch (e) {}
  }
  
  // Error sound - sad descending
  error() {
    try {
      const ctx = this.initAudio();
      const notes = [523.25, 493.88, 440];
      
      notes.forEach((freq, i) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.value = freq;
        gainNode.gain.value = 0.12;
        
        const startTime = ctx.currentTime + (i * 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + 0.15);
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.12);
      });
    } catch (e) {}
  }
}

export const sounds = new SoundEffects();

// Vibration helper (mobile only)
export const vibrate = (pattern: number | number[]) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};