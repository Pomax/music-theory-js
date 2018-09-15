/**
 *
 */
class Ticker {
  constructor(BPM, receivers) {
    this.BPM = BPM;
    this.receivers = [];

    if (receivers) {
      if (!receivers.forEach) {
        receivers = [ receivers ];
      }
      this.receivers = receivers;
    }
  }

  addReceiver(r) {
    this.receivers.push(r);
  }

  removeReceiver(r) {
    let pos = this.receivers.indexOf(r);
    if (pos > -1) {
      this.receivers.splice(pos,)
    }
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
    this.receivers.forEach(r => r.tick(this.tickCount));
    setTimeout(() => this.tick(), 2);
  }

  play() {
    this.receivers.forEach(r => r.tickStarted());
    this.tickCount = 0;
    this.playing = true;
    this.start = Date.now();
    this.tick();
  }

  stop() {
    this.playing = false;
    this.receivers.forEach(r => r.tickStopped());
  }
};

Ticker.getMaster = (receiver) => {
  if (!Ticker.__master) {
    Ticker.__master = new Ticker(120);
  }
  if (receiver) {
    Ticker.__master.addReceiver(receiver);
  }
  return Ticker.__master;
};

export { Ticker };
