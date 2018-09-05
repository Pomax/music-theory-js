class Ticker {
  constructor(receiver, BPM) {
    this.receiver = receiver;
    this.BPM = BPM;
  }

  reset() {
    this.tickCount = 0;
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
