import { h, render, Component } from "../preact.js";
import { router } from "../router/router.js";

/**
 * individual key class
 */
class Key extends Component {
    constructor(props) {
        super(props);
        this.state = { pressed: false };
        router.addListener(this, "noteon");
        router.addListener(this, "noteoff");
    }

    onNoteOn(note, velocity) {
        if(note === this.props.note) {
            this.setState({ pressed: true });
        }
    }

    onNoteOff(note, velocity) {
        if(note === this.props.note) {
            this.setState({ pressed: false });
        }
    }

    up(fn) {
        router.signalnoteoff(0, this.props.note, 0);
        document.removeEventListener("mouseup", fn);
    }

    down() {
        const fn = () => this.up(fn);
        router.signalnoteon(0, this.props.note, 65);
        document.addEventListener("mouseup", fn);
    }

    render() {
        let note = this.props.note;
        let color = ([1,3,6,8,10].indexOf(note % 12) > -1) ? `black` : `white`;
        let pressed = this.state.pressed ? 'pressed' : '';
        let classes = ['key',color,pressed].filter(v=>v).join(' ');
        let label = (note%12 === 0) ? note/12 : '';
        return <button className={classes} onMouseDown={evt => this.down(evt)}>{ label }</button>;
    }
}

// MIDI "only" has 128 real keys
const MIDI_KEYS = [...Array(128)].map((_,i) => i);


/**
 * The full keyboard, but you only get to see 24 keys at a time.
 */
class Keyboard extends Component{
    constructor(props) {
        super(props);
        this.all_keys = MIDI_KEYS.map(note => this.makeKey(note));
        this.low = 48; // C3
        this.setKeySlice();
    }

    setKeySlice() {
        this.setState({
            keys: this.all_keys.slice(this.low, this.low + 24)
        });
    }

    componentDidMount() {
        document.addEventListener('keydown', evt => {
            if(evt.key === '[') {
                this.changeOctave(-1);
            }
            if(evt.key === ']') {
                this.changeOctave(+1);
            }
        });
    }

    render() {
        return (
            <div className="board">
                { this.state.keys }
                <div className="octave">
                    <button onClick={evt => this.changeOctave(+1) }>+</button>
                    <button onClick={evt => this.changeOctave(-1) }>-</button>
                </div>
            </div>
        );
    }

    changeOctave(direction) {
        if (direction<0 && this.low > 11) {
            this.low -= 12;
        } else if (this.low <= 108 ) {
            this.low += 12;
        }
        this.setKeySlice();
    }

    makeKey(note) {
        return <Key note={note} key={note} />;
    }

}

export { Keyboard }
