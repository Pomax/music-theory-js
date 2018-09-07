/**
 *
 */
class Keyboard {
    constructor(router, top) {
        this.router = router;
        router.addListener(this, "noteon");
        router.addListener(this, "noteoff");

        this.keys = {};
        this.board = document.createElement("div");
        this.board.classList.add('board');
        top.appendChild(this.board);

        this.makeWhiteKey(48); // C3
        this.makeBlackKey(49); // C#
        this.makeWhiteKey(50); // D
        this.makeBlackKey(51); // D#
        this.makeWhiteKey(52); // E

        this.makeWhiteKey(53); // F
        this.makeBlackKey(54); // F#
        this.makeWhiteKey(55); // G
        this.makeBlackKey(56); // G#
        this.makeWhiteKey(57); // A
        this.makeBlackKey(58); // A#
        this.makeWhiteKey(59); // B

        this.makeWhiteKey(60); // C4
        this.makeBlackKey(61); // C#
        this.makeWhiteKey(62); // D
        this.makeBlackKey(63); // D#
        this.makeWhiteKey(64); // E

        this.makeWhiteKey(65); // F
        this.makeBlackKey(66); // F#
        this.makeWhiteKey(67); // G
        this.makeBlackKey(68); // G#
        this.makeWhiteKey(69); // A
        this.makeBlackKey(70); // A#
        this.makeWhiteKey(71); // B

        this.makeWhiteKey(72); // C5
    }

    makeWhiteKey(note) {
        var e = this.makeKey(note);
        e.classList.add('white');
    }

    makeBlackKey(note) {
        var e = this.makeKey(note);
        e.classList.add('black');
    }

    makeKey(note) {
        var e = document.createElement('button');
        e.classList.add('key');

        const uuid = Date.now() + Math.random();

        const fn = evt => {
            this.router.signalnoteoff(0, note, 0);
            document.removeEventListener("mouseup", fn);
        };

        e.addEventListener("mousedown", evt => {
            this.router.signalnoteon(0, note, 65);
            document.addEventListener("mouseup", fn);
        });

        this.board.appendChild(e);
        this.keys[note] = e;
        return e;
    }

    onNoteOn(note, velocity) {
        this.press(note);
    }

    onNoteOff(note, velocity) {
        this.release(note);
    }

    press(note) {
        var e = this.keys[note];
        if (e) {
            e.classList.add('pressed');
        }
    }

    release(note) {
        var e = this.keys[note];
        if (e) {
            e.classList.remove('pressed');
        }
    }
}

export { Keyboard }
