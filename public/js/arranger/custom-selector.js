import { h, render, Component } from '../preact.js';

class CustomSelector extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let owner = this.props.owner;
        let label = this.props.label;
        let keys = this.props.options;

        if (!keys.forEach) {
            keys = Object.keys(keys);
        }

        return h(
            'select',
            { onChange: evt => this.handleChange(evt) },
            h(
                'option',
                { value: '', selected: true },
                label,
                ':'
            ),
            keys.map(t => h(
                'option',
                { key: t, value: t, selected: owner.state[label] === t ? 'selected' : null },
                t
            ))
        );
    }

    handleChange(evt) {
        let state = {},
            owner = this.props.owner;
        state[this.props.label] = evt.target.value;
        owner.setState(state, () => {
            owner.contentUpdated();
        });
    }
}

export { CustomSelector };