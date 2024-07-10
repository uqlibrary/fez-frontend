import React from 'react';
import PropTypes from 'prop-types';

export const LookupForm = ({
    onAdd,
    locale,
    disabled,
    inputField: InputField,
    error,
    errorText,
    category,
    required,
    itemSelectedToEdit,
}) => {
    const [defaultValue, setDefaultValue] = React.useState('');

    React.useEffect(() => {
        setDefaultValue((itemSelectedToEdit && itemSelectedToEdit.value) ?? null);
    }, [itemSelectedToEdit]);

    return (
        <React.Fragment>
            {InputField && (
                <InputField
                    key={defaultValue}
                    input={{ onChange: onAdd, value: defaultValue }}
                    floatingLabelText={locale.inputFieldLabel}
                    hintText={locale.inputFieldHint}
                    disabled={disabled}
                    error={error}
                    errorText={errorText}
                    category={category}
                    required={required}
                />
            )}
        </React.Fragment>
    );
};

LookupForm.propTypes = {
    onAdd: PropTypes.func.isRequired,
    locale: PropTypes.object,
    disabled: PropTypes.bool,
    inputField: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    error: PropTypes.bool,
    errorText: PropTypes.string,
    category: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    required: PropTypes.bool,
    itemSelectedToEdit: PropTypes.object,
};

LookupForm.defaultProps = {
    locale: {
        inputFieldLabel: 'Item name',
        inputFieldHint: 'Please type the item name, then select from the list',
    },
    required: false,
};

export default React.memo(LookupForm);
