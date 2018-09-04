import { InputHandler } from "./input-handler.js";

const device = document.getElementById('device');

function loadSucceeded() {
    device.classList.add('live');
}

function loadFailed(msg) {
    if (!device.classList.contains('led')) {
        device.textContent = msg;
    } else {
        alert(msg);
    }
    throw new Error(msg);
}

// Shortcut the process if we have no WebMIDI available.
if (!navigator.requestMIDIAccess) {
    loadFailed("WebMIDI is not supported (without plugins?) in this browser.");
}

device.textContent='';
device.classList.add('led');

const handler = new InputHandler(document.getElementById('magic'));

// router function
function getMIDIMessage(midiMessage) {
    var data = midiMessage.data;
    var command = data[0];
    var note = data[1];
    var velocity = (data.length > 2) ? data[2] : 0;
    handler.handle(command, note, velocity);
};

function onMidiSuccess(success) {
    for (var input of success.inputs.values()) {
       input.onmidimessage = getMIDIMessage;
    }
    loadSucceeded();
}

function onMidiFail() {
    loadFailed("Web MIDI is available, but MIDI device access failed...");
}

// kick it all of.
navigator.requestMIDIAccess().then(onMidiSuccess, onMidiFail);
