/**
 * See http://www.gweep.net/~prefect/eng/reference/protocol/midispec.html#CTL
 */
const MIDI_CONTROL_CODES = {};

MIDI_CONTROL_CODES['Bank Select'] = 0;
MIDI_CONTROL_CODES['Modulation Wheel (coarse)'] = 1;
MIDI_CONTROL_CODES['Breath controller (coarse)'] = 2;
MIDI_CONTROL_CODES['Foot Pedal (coarse)'] = 4;
MIDI_CONTROL_CODES['Portamento Time (coarse)'] = 5;
MIDI_CONTROL_CODES['Data Entry (coarse)'] = 6;
MIDI_CONTROL_CODES['Volume (coarse)'] = 7;
MIDI_CONTROL_CODES['Balance (coarse)'] = 8;
MIDI_CONTROL_CODES['Pan position (coarse)'] = 10;
MIDI_CONTROL_CODES['Expression (coarse)'] = 11;
MIDI_CONTROL_CODES['Effect Control 1 (coarse)'] = 12;
MIDI_CONTROL_CODES['Effect Control 2 (coarse)'] = 13;
MIDI_CONTROL_CODES['General Purpose Slider 1'] = 16;
MIDI_CONTROL_CODES['General Purpose Slider 2'] = 17;
MIDI_CONTROL_CODES['General Purpose Slider 3'] = 18;
MIDI_CONTROL_CODES['General Purpose Slider 4'] = 19;
MIDI_CONTROL_CODES['Bank Select (fine)'] = 32;
MIDI_CONTROL_CODES['Modulation Wheel (fine)'] = 33;
MIDI_CONTROL_CODES['Breath controller (fine)'] = 34;
MIDI_CONTROL_CODES['Foot Pedal (fine)'] = 36;
MIDI_CONTROL_CODES['Portamento Time (fine)'] = 37;
MIDI_CONTROL_CODES['Data Entry (fine)'] = 38;
MIDI_CONTROL_CODES['Volume (fine)'] = 39;
MIDI_CONTROL_CODES['Balance (fine)'] = 40;
MIDI_CONTROL_CODES['Pan position (fine)'] = 42;
MIDI_CONTROL_CODES['Expression (fine)'] = 43;
MIDI_CONTROL_CODES['Effect Control 1 (fine)'] = 44;
MIDI_CONTROL_CODES['Effect Control 2 (fine)'] = 45;
MIDI_CONTROL_CODES['Hold Pedal (on/off)'] = 64;
MIDI_CONTROL_CODES['Portamento (on/off)'] = 65;
MIDI_CONTROL_CODES['Sustenuto Pedal (on/off)'] = 66;
MIDI_CONTROL_CODES['Soft Pedal (on/off)'] = 67;
MIDI_CONTROL_CODES['Legato Pedal (on/off)'] = 68;
MIDI_CONTROL_CODES['Hold 2 Pedal (on/off)'] = 69;
MIDI_CONTROL_CODES['Sound Variation'] = 70;
MIDI_CONTROL_CODES['Sound Timbre'] = 71;
MIDI_CONTROL_CODES['Sound Release Time'] = 72;
MIDI_CONTROL_CODES['Sound Attack Time'] = 73;
MIDI_CONTROL_CODES['Sound Brightness'] = 74;
MIDI_CONTROL_CODES['Sound Control 6'] = 75;
MIDI_CONTROL_CODES['Sound Control 7'] = 76;
MIDI_CONTROL_CODES['Sound Control 8'] = 77;
MIDI_CONTROL_CODES['Sound Control 9'] = 78;
MIDI_CONTROL_CODES['Sound Control 10'] = 79;
MIDI_CONTROL_CODES['General Purpose Button 1 (on/off)'] = 80;
MIDI_CONTROL_CODES['General Purpose Button 2 (on/off)'] = 81;
MIDI_CONTROL_CODES['General Purpose Button 3 (on/off)'] = 82;
MIDI_CONTROL_CODES['General Purpose Button 4 (on/off)'] = 83;
MIDI_CONTROL_CODES['Effects Level'] = 91;
MIDI_CONTROL_CODES['Tremulo Level'] = 92;
MIDI_CONTROL_CODES['Chorus Level'] = 93;
MIDI_CONTROL_CODES['Celeste Level'] = 94;
MIDI_CONTROL_CODES['Phaser Level'] = 95;
MIDI_CONTROL_CODES['Data Button increment'] = 96;
MIDI_CONTROL_CODES['Data Button decrement'] = 97;
MIDI_CONTROL_CODES['Non-registered Parameter (coarse)'] = 98;
MIDI_CONTROL_CODES['Non-registered Parameter (fine)'] = 99;
MIDI_CONTROL_CODES['Registered Parameter (coarse)'] = 100;
MIDI_CONTROL_CODES['Registered Parameter (fine)'] = 101;
MIDI_CONTROL_CODES['All Sound Off'] = 120;
MIDI_CONTROL_CODES['All Controllers Off'] = 121;
MIDI_CONTROL_CODES['Local Keyboard (on/off)'] = 122;
MIDI_CONTROL_CODES['All Notes Off'] = 123;
MIDI_CONTROL_CODES['Omni Mode Off'] = 124;
MIDI_CONTROL_CODES['Omni Mode On'] = 125;
MIDI_CONTROL_CODES['Mono Operation'] = 126;
MIDI_CONTROL_CODES['Poly Operation'] = 127;

function code(label) { return MIDI_CONTROL_CODES[label]; }

export { code };
