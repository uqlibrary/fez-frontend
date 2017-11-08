import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class LookupForm extends Component {
    static propTypes = {
        onAdd: PropTypes.func.isRequired,
        floatingLabelText: PropTypes.string,
        hintText: PropTypes.string,
        disabled: PropTypes.bool,
        inputField: PropTypes.func,
        meta: PropTypes.object
    };

    static defaultProps = {
        isValid: () => '',
        floatingLabelText: 'Item name',
        hintText: 'Please type the item name'
    }

    constructor(props) {
        super(props);
    }

    addKeyValueItem = (item) => {
        this.props.onAdd(item);
    }

    render() {
        console.log(this.props);
        // input={{onChange: this.addKeyValueItem}}
        return (
            <div className="columns">
                <div className="column">
                    {
                        this.props.inputField &&
                        <this.props.inputField
                            input={{onChange: this.props.onAdd}}
                            floatingLabelText={this.props.floatingLabelText}
                            hintText={this.props.hintText}
                            disabled={this.props.disabled}
                            meta={this.props.meta} />
                    }
                </div>
            </div>
        );
    }
}
