// master audio context. We only want to build one, not contantly build new ones.
const context = new (window.AudioContext || window.webkitAudioContext)();

// master volume control
const masterGain = context.createGain();
masterGain.gain.value = 1.0;

// hook it all up
masterGain.connect(context.destination);

// and export.
export { context, masterGain };
