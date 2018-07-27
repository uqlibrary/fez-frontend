import {PureComponent} from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import * as validationRules from 'config/validation';
import {PublisherField} from './AutoCompleteFields/PublisherField';
import {CollectionField} from './Fields/CollectionField';
import SubtypeField from './Fields/SubtypeField';

class AdvancedSearchRowInput extends PureComponent {
    static propTypes = {
        children: PropTypes.func.isRequired,
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array
        ]),
        inputField: PropTypes.shape({
            type: PropTypes.string.isRequired,
            validation: PropTypes.array.isRequired,
            hint: PropTypes.string
        }).isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            InputComponent: TextField,
            inputProps: {}
        };
    }

    componentWillMount() {
        this.setState({
            InputComponent: this.getInputComponent(),
            inputProps: this.getInputProps()
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            ...this.state,
            inputProps: {
                ...this.state.inputProps,
                'errorText': this.runValidationRules(nextProps.value)
            }
        });
    }

    getInputComponent = () => {
        switch (this.props.inputField.type) {
            case 'TextField':
                return TextField;
            case 'PublisherLookup':
                return PublisherField;
            case 'CollectionLookup':
                return CollectionField;
            case 'SubtypeLookup':
                return SubtypeField;
            default:
                return TextField;
        }
    };

    getInputProps = () => {
        switch (this.props.inputField.type) {
            case 'TextField':
                return {
                    'hintText': this.props.inputField.hint,
                    'aria-label': this.props.inputField.hint,
                    'errorText': this.runValidationRules(this.props.value),
                    'autoComplete': 'off'
                };
            case 'PublisherLookup':
                return {
                    'hintText': this.props.inputField.hint,
                    'aria-label': this.props.inputField.hint,
                    'errorText': this.runValidationRules(this.props.value),
                    'floatingLabelText': null
                };
            case 'CollectionLookup':
                return {
                    'hintText': this.props.inputField.hint,
                    'aria-label': this.props.inputField.hint,
                    'errorText': this.runValidationRules(this.props.value),
                    'floatingLabelText': null
                };
            case 'SubtypeLookup':
                return {
                    'hintText': this.props.inputField.hint,
                    'aria-label': this.props.inputField.hint,
                    'errorText': this.runValidationRules(this.props.value),
                    'floatingLabelText': null,
                };
            default: return {};
        }
    };

    runValidationRules = (value) => {
        const rules = !!this.props.inputField.validation && this.props.inputField.validation;
        return !!rules &&
            rules.reduce((errors, rule) => ([...errors, validationRules[rule](value)]), [])
                .filter(error => error)
                .join(', ') || undefined;
    };

    render() {
        return this.props.children(this.state.InputComponent, this.state.inputProps);
    }
}

export default AdvancedSearchRowInput;
