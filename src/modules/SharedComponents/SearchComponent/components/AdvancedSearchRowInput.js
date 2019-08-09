import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import * as validationRules from 'config/validation';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { AuthorIdField, PublisherField, OrgUnitNameField } from 'modules/SharedComponents/LookupFields';
import { ThesisSubtypeField, CollectionsSelectField } from 'modules/SharedComponents/PublicationSubtype';
import UnpublishedStatusField from './Fields/UnpublishedStatusField';

export default class AdvancedSearchRowInput extends PureComponent {
    static propTypes = {
        children: PropTypes.func.isRequired,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.number]),
        hintText: PropTypes.string,
        label: PropTypes.any,
        onChange: PropTypes.func,
        inputField: PropTypes.shape({
            type: PropTypes.string.isRequired,
            validation: PropTypes.array.isRequired,
            hint: PropTypes.string,
            label: PropTypes.string,
            id: PropTypes.string,
            multiple: PropTypes.bool,
            errorHint: PropTypes.string,
            loadingHint: PropTypes.string,
            ariaLabel: PropTypes.string,
        }),
    };

    constructor(props) {
        super(props);
        this.state = {
            InputComponent: TextField,
            inputProps: {},
        };
    }

    componentWillMount() {
        this.setState({
            InputComponent: this.getInputComponent(),
            inputProps: this.getInputProps(),
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            ...this.state,
            inputProps: {
                ...this.state.inputProps,
                error: !!this.runValidationRules(nextProps.value),
                errorText: this.runValidationRules(nextProps.value),
            },
        });
    }

    getInputComponent = () => {
        switch (this.props.inputField.type) {
            case 'TextField':
                return TextField;
            case 'PublisherLookup':
                return PublisherField;
            case 'ThesisTypeLookup':
                return ThesisSubtypeField;
            case 'CollectionsLookup':
                return CollectionsSelectField;
            case 'AuthorIdLookup':
            case 'ContributorIdLookup':
                return AuthorIdField;
            case 'OrgUnitLookup':
                return OrgUnitNameField;
            case 'StatusLookup':
                return UnpublishedStatusField;
            default:
                return TextField;
        }
    };

    getInputProps = () => {
        const defaultProps = {
            hintText: this.props.inputField.hint,
            'aria-label': this.props.inputField.ariaLabel,
            errorText: this.runValidationRules(this.props.value),
            error: !!this.runValidationRules(this.props.value),
            label: this.props.label,
        };

        const textFieldMui1Props = {
            placeholder: this.props.inputField.hint,
            id: this.props.inputField.id || this.props.inputField.label || 'textfield',
            'aria-label': this.props.inputField.ariaLabel,
            error: !!this.runValidationRules(this.props.value),
            errorText: this.runValidationRules(this.props.value),
            label: this.props.inputField.label,
        };

        const lookupDefaultProps = {
            ...defaultProps,
            value: this.props.label || this.props.value,
            'aria-label': this.props.inputField.ariaLabel,
            allowFreeText: true,
            floatingLabelText: this.props.inputField.ariaLabel,
            hideLabel: true,
        };

        const selectDefaultProps = {
            ...defaultProps,
            selectedValue: this.props.value,
            hintText: this.props.inputField.hint,
            onChange: item => this.props.onChange(item, item),
            'aria-label': this.props.inputField.ariaLabel,
            label: this.props.inputField.label,
            style: { marginTop: 0 },
        };

        switch (this.props.inputField.type) {
            case 'TextField':
                return {
                    ...textFieldMui1Props,
                    autoComplete: 'search',
                    onChange: event => this.props.onChange(event.target.value),
                    hideLabel: true,
                };
            case 'PublisherLookup':
            case 'OrgUnitLookup':
                return {
                    ...lookupDefaultProps,
                    onChange: item => this.props.onChange(item.value, item.value),
                };
            case 'AuthorIdLookup':
            case 'ContributorIdLookup':
                return {
                    ...lookupDefaultProps,
                    label: this.props.label,
                    onChange: item => {
                        if (parseInt(item.id, 10) > 0) {
                            this.props.onChange(item.id, item.value);
                        } else {
                            this.props.onChange(0, '');
                        }
                    },
                };
            case 'ThesisTypeLookup':
                return {
                    ...selectDefaultProps,
                    multiple: this.props.inputField.multiple,
                    autoWidth: false,
                    hideLabel: true,
                    displayEmpty: true,
                };
            case 'CollectionsLookup':
                return {
                    ...selectDefaultProps,
                    loadingHint: this.props.inputField.loadingHint,
                    errorHint: this.props.inputField.errorHint,
                    multiple: this.props.inputField.multiple,
                    onChange: this.props.onChange,
                    autoWidth: false,
                    hideLabel: true,
                    displayEmpty: true,
                };
            case 'StatusLookup':
                return {
                    ...selectDefaultProps,
                    autoWidth: false,
                    hideLabel: true,
                    displayEmpty: false,
                    onChange: item => this.props.onChange(item),
                };
            default:
                return {};
        }
    };

    runValidationRules = value => {
        const rules = !!this.props.inputField.validation && this.props.inputField.validation;
        return (
            (!!rules &&
                rules
                    .reduce((errors, rule) => [...errors, validationRules[rule](value)], [])
                    .filter(error => error)
                    .join(', ')) ||
            undefined
        );
    };

    render() {
        return this.props.children(this.state.InputComponent, this.state.inputProps);
    }
}
