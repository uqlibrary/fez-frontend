import React, { forwardRef, useImperativeHandle, useState } from 'react';
import Grid from '@mui/material/Grid';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import Button from '@mui/material/Button';
import { Popover } from '@mui/material';
import { useForm } from 'hooks';
import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';
import { validation } from 'config';
import { CONTRIBUTOR_NAMES_FORM_GIVEN_NAME_FIRST, CONTRIBUTOR_NAMES_FORM_LAST_NAME_FIRST } from 'config/general';
import PropTypes from 'prop-types';

const defaultValueSeparator = ', ';

const defaultFormFields = [
    { name: 'last-name', label: 'Last Name' },
    { name: 'given-name', label: 'Given Name' },
];

const validateNames = value => (value?.match?.(/,/) && 'Commas are not allowed') || undefined;

const NamesForm = forwardRef(({ id, onClose, fieldOrder = CONTRIBUTOR_NAMES_FORM_LAST_NAME_FIRST }, ref) => {
    const formFields = [...defaultFormFields];
    let separator = defaultValueSeparator;
    if (fieldOrder === CONTRIBUTOR_NAMES_FORM_GIVEN_NAME_FIRST) {
        formFields.reverse();
        separator = ' ';
    }

    const [anchor, setAnchor] = useState();
    const isOpen = Boolean(anchor);
    const {
        handleSubmit,
        reset,
        setValue,
        control,
        setFocus,
        trigger,
        formState: { hasValidationError },
    } = useForm({ defaultValues: formFields.reduce((all, { name }) => ({ ...all, [name]: '' }), {}) });
    const open = event => {
        setAnchor(event.currentTarget);
    };

    const close = () => setAnchor(null);

    const onSubmit = handleSubmit(data => {
        onClose(formFields.map(field => data[field.name].trim()).join(separator));
        reset();
        close();
    });

    useImperativeHandle(ref, () => {
        return {
            open(event, value) {
                const values = value?.trim?.().split?.(separator).reverse();
                formFields.forEach(field => setValue(field.name, values.pop()));
                open(event);
            },
        };
    }, []);

    return (
        <Popover
            open={isOpen}
            anchorEl={anchor}
            onClose={close}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            transitionDuration={0}
            slotProps={{
                transition: {
                    onEntered: () => {
                        trigger(['surname', 'name']);
                        setFocus('surname');
                    },
                },
            }}
        >
            <form>
                <Grid container spacing={1} style={{ padding: 10 }}>
                    {formFields.map(field => (
                        <Grid item sm={12} md={12} key={field.name}>
                            <Field
                                control={control}
                                component={TextField}
                                placeholder={field.label}
                                name={field.name}
                                validate={[validation.minLengthValidator(2), validateNames]}
                                textFieldId={`${id}-names-form-${field.name}`}
                            />
                        </Grid>
                    ))}
                    <Grid item sm={12} md={12}>
                        <Button
                            type="submit"
                            onClick={onSubmit}
                            variant="contained"
                            color="primary"
                            disabled={hasValidationError}
                            data-testid={`${id}-names-form-submit-button`}
                        >
                            SET
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Popover>
    );
});

NamesForm.propTypes = {
    id: PropTypes.string,
    onClose: PropTypes.func,
    fieldOrder: PropTypes.oneOf([CONTRIBUTOR_NAMES_FORM_LAST_NAME_FIRST, CONTRIBUTOR_NAMES_FORM_GIVEN_NAME_FIRST]),
};

export default NamesForm;
