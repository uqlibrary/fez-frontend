import { useEffect, useState, memo } from 'react';
import PropTypes from 'prop-types';
import * as validationRules from 'config/validation';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import {
    AuthorIdField,
    PublisherField,
    OrgUnitNameField,
    CollectionField,
} from 'modules/SharedComponents/LookupFields';
import { ThesisSubtypeSelectField } from 'modules/SharedComponents/SelectFields';
import { UnpublishedStatusField } from './Fields/UnpublishedStatusField';

const runValidationRules = (inputField, value) => {
    const rules = !!inputField.validation && inputField.validation;
    return (
        (!!rules &&
            rules
                .reduce((errors, rule) => [...errors, validationRules[rule](value)], [])
                .filter(error => error)
                .join(', ')) ||
        undefined
    );
};

const getInputComponent = type => {
    switch (type) {
        case 'TextField':
            return TextField;
        case 'PublisherLookup':
            return PublisherField;
        case 'ThesisTypeLookup':
            return ThesisSubtypeSelectField;
        case 'CollectionsLookup':
            return CollectionField;
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

const getInputProps = (inputField, value, onChange, label) => {
    const defaultProps = {
        hintText: inputField.hint,
        'aria-label': inputField.ariaLabel,
        errorText: runValidationRules(inputField, value),
        error: !!runValidationRules(inputField, value),
        label: label,
    };

    const textFieldMui1Props = {
        placeholder: inputField.hint,
        id: inputField.id || inputField.label || 'textfield',
        textFieldId: inputField.id,
        'aria-label': inputField.ariaLabel,
        error: !!runValidationRules(inputField, value),
        errorText: runValidationRules(inputField, value),
        label: inputField.label,
    };

    const lookupDefaultProps = {
        ...defaultProps,
        value: label || value,
        allowFreeText: true,
        floatingLabelText: inputField.ariaLabel,
        hideLabel: true,
    };

    const selectDefaultProps = {
        ...defaultProps,
        selectedValue: value,
        onChange: item => onChange(item, item),
        label: inputField.label,
        style: { marginTop: 0 },
    };

    switch (inputField.type) {
        case 'TextField':
            return {
                ...textFieldMui1Props,
                autoComplete: 'search',
                onChange: event => onChange(event.target.value),
                hideLabel: true,
            };
        case 'PublisherLookup':
        case 'OrgUnitLookup':
            return {
                ...lookupDefaultProps,
                onChange: item => onChange(item.value, item.value),
            };
        case 'AuthorIdLookup':
        case 'ContributorIdLookup':
            return {
                ...lookupDefaultProps,
                value: { id: value, value: label },
                label: label,
                hideLabel: true,
                placeholder: inputField.hint,
                authorIdFieldId: 'rek-author-id',
                onChange: item => {
                    if (!!item && !!item.id && parseInt(item.id, 10) > 0) {
                        onChange(item.id, item.value);
                    } else {
                        onChange(0, '');
                    }
                },
            };
        case 'ThesisTypeLookup':
            return {
                ...selectDefaultProps,
                value: value.length > 0 ? value : [],
                multiple: inputField.multiple,
                autoWidth: false,
                hideLabel: true,
                displayEmpty: value === '' || value.length === 0,
                genericSelectFieldId: 'rek-genre-type',
                selectPrompt: inputField.selectPrompt,
                ...(value === '' || value.length === 0
                    ? {
                          selectProps: {
                              renderValue /* istanbul ignore next */: () => inputField.selectPrompt,
                          },
                      }
                    : {}),
            };
        case 'CollectionsLookup':
            return {
                ...selectDefaultProps,
                collectionFieldId: inputField.collectionFieldId,
                onChange: onChange,
                disableClearable: true,
            };
        case 'StatusLookup':
            return {
                ...selectDefaultProps,
                autoWidth: false,
                hideLabel: true,
                displayEmpty: false,
                onChange: item => onChange(item),
            };
        default:
            return {};
    }
};

const getErrorProps = (inputField, value) => ({
    error: !!runValidationRules(inputField, value),
    errorText: runValidationRules(inputField, value),
});

export const AdvancedSearchRowInput = ({ render, value, label, onChange, inputField }) => {
    const InputComponent = getInputComponent(inputField.type);
    const [inputProps, setInputProps] = useState({
        ...getInputProps(inputField, value, onChange, label),
        ...getErrorProps(inputField, value),
    });

    useEffect(() => {
        setInputProps({
            ...getInputProps(inputField, value, onChange, label),
            ...getErrorProps(inputField, value),
        });
    }, [inputField, value, onChange, label]);

    return render(InputComponent, { ...inputProps });
};

AdvancedSearchRowInput.propTypes = {
    render: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.number]),
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

export default memo(AdvancedSearchRowInput);
