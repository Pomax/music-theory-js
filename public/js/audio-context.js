// master audio context. We only want to build one, not contantly build new ones.
const context = new (window.AudioContext || window.webkitAudioContext)();

// master volum control
const masterGain = context.createGain();
masterGain.gain.value = 1.0;
masterGain.connect(context.destination);

export { context, masterGain };
