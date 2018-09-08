/**
 *
 */
class Ticker {
  constructor(receiver, BPM) {
    this.receiver = receiver;
    this.BPM = BPM;
  }

  reset() {
    this.tickCount = 0;
  }

  // return difference in old and new tick counts based on BPM-since-start
  setBPM(bpm) {
    this.BPM = bpm;
    let diff = Date.now() - this.start;
    let tickCount = ((diff*this.BPM*32)/60000)|0;
    return tickCount - this.tickCount;
  }

  tick() {
    if (!this.playing) return;
    let diff = Date.now() - this.start;
    let tickCount = this.tickCount = ((diff*this.BPM*32)/60000)|0;
    this.receiver.tick(this.tickCount);
    setTimeout(() => this.tick(), 2);
  }

  play() {
    this.tickCount = 0;
    this.playing = true;
    this.start = Date.now();
    this.tick();
  }

  stop() {
    this.playing = false;
  }
};

export { Ticker };
