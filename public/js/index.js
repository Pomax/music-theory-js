import { InputHandler } from "./input-handler.js";

function loadSucceeded() {
    document.getElementById('device').classList.add('live');
}

function loadFailed(msg) {
    throw new Error(msg);
}

// Shortcut the process if we have no WebMIDI available.
if (!navigator.requestMIDIAccess) { loadFailed("WebMIDI is not supported in this browser"); }

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
    let inputs = success.inputs.values();
    console.log(inputs.length);
    for (var input of inputs) {
       input.onmidimessage = getMIDIMessage;
    }
    loadSucceeded();
}

function onMidiFail() {
    loadFailed("MIDI access request failed");
}

// kick it all of.
navigator.requestMIDIAccess().then(onMidiSuccess, onMidiFail);
