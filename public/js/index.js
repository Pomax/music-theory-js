import { router } from "./router/router.js";
import { Synth } from "./synth/synth.js";
import { setupArranger } from "./arranger/arranger.js";

const device = document.getElementById('device');

function loadSucceeded(noMIDIwarning) {
    new Synth(document.getElementById('synth'), 1);
    setupArranger(document.getElementById('arranger'));
    document.getElementById('components').classList.remove('uninitialized');
    document.querySelector('.screenshot').classList.add('hidden');
    if (!noMIDIwarning) {
        device.classList.add('live');
    } else {
        alert(noMIDIwarning);
    }
}

function loadFailed(msg) {
    alert(msg);
    throw new Error(msg);
}

// Shortcut the process if we have no WebMIDI available.
if (!navigator.requestMIDIAccess) {
    loadFailed("WebMIDI is not supported (without plugins?) in this browser.");
}

device.textContent='';
device.classList.add('led');

// router function
function getMIDIMessage(midiMessage) {
    var data = midiMessage.data;
    var status = data[0];
    var type = (status & 0xF0) >> 4;
    var channel = (status & 0x0F);
    var data = data.slice(1);
    router.receive(type, channel, data);
};

function onMidiSuccess(success) {
    let deviceCount = 0;
    for (var input of success.inputs.values()) {
        input.onmidimessage = getMIDIMessage;
        deviceCount++;
    }
    if (deviceCount > 0) {
        loadSucceeded();
    } else {
        loadSucceeded("No available MIDI devices were found (are they already in use in another program?)");
    }
}

function onMidiFail() {
    loadSucceeded("Web MIDI is available, but MIDI device access failed.");
}

// kick it all of.
navigator.requestMIDIAccess().then(onMidiSuccess, onMidiFail);
