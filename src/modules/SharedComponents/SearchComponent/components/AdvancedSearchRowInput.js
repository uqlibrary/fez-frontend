import React, { useEffect, useState, memo } from 'react';
import PropTypes from 'prop-types';
import * as validationRules from 'config/validation';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import {
    AuthorIdField,
    PublisherField,
    OrgUnitNameField,
    CollectionField,
} from 'modules/SharedComponents/LookupFields';
import { ThesisSubtypeSelectField } from 'modules/SharedComponents/SelectFields';

import { UNPUBLISHED_STATUS } from 'config/general';

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
            return NewGenericSelectField;
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
                id: inputField.id,
                placeholder: inputField.hint,
                autoCompleteAsynchronousFieldId: inputField.id,
                onChange: item => onChange(item, item),
            };
        case 'AuthorIdLookup':
        case 'ContributorIdLookup':
            return {
                ...lookupDefaultProps,
                value: { id: value, value: label },
                label: label,
                hideLabel: true,
                placeholder: inputField.hint,
                id: inputField.id,
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
                              renderValue /* c8 ignore next */: () => inputField.selectPrompt,
                          },
                      }
                    : {
                          selectProps: {
                              renderValue /* c8 ignore next */: () => value.join(', '),
                          },
                      }),
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
                genericSelectFieldId: 'rek-status',
                autoWidth: false,
                hideLabel: true,
                selectPrompt: inputField.selectPrompt,
                displayEmpty: value === '',
                itemsList: UNPUBLISHED_STATUS,
                onChange: item => onChange(item),
            };
        default:
            return {
                ...defaultProps,
                id: inputField.id || 'text-field',
                textFieldId: inputField.id || 'text-field',
            };
    }
};

const getErrorProps = (inputField, value) => ({
    error: !!runValidationRules(inputField, value),
    errorText: runValidationRules(inputField, value),
});

export const AdvancedSearchRowInput = ({ AdvancedSearchField, value, label, onChange, inputField, searchField }) => {
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

    return (
        <AdvancedSearchField
            InputComponent={InputComponent}
            inputProps={inputProps}
            value={value}
            disabled={searchField === '0' || searchField === 'mtj_jnl_id'}
        />
    );
};

AdvancedSearchRowInput.propTypes = {
    AdvancedSearchField: PropTypes.elementType,
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
        disabled: PropTypes.bool,
        errorHint: PropTypes.string,
        loadingHint: PropTypes.string,
        ariaLabel: PropTypes.string,
    }),
    searchField: PropTypes.string,
};

export default memo(AdvancedSearchRowInput);
