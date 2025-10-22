import React, { forwardRef, useImperativeHandle, useState } from 'react';
import Grid from '@mui/material/Grid';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import Button from '@mui/material/Button';
import { Popover } from '@mui/material';
import { useForm } from 'hooks';
import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';
import { validation } from 'config';
import PropTypes from 'prop-types';
import { tryCatch } from 'helpers/general';

export const MODE_FAMILY_NAME_FIRST = 1;
export const MODE_GIVEN_NAME_FIRST = 2;

const LAST_NAME_FIRST_SEPARATOR = ', ';
const FAMILY_NAME_FIRST_SEPARATOR = ' ';

const defaultFormFields = [
    { name: 'family-name', label: 'Family Name' },
    { name: 'given-name', label: 'Given Name' },
];

const validateNames = value => (value?.match?.(/,/) && 'Commas are not allowed') || undefined;

const PopoverNamesForm = forwardRef(({ id, onClose, mode = MODE_FAMILY_NAME_FIRST }, ref) => {
    const formFields = [...defaultFormFields];
    let separator = LAST_NAME_FIRST_SEPARATOR;
    if (mode === MODE_GIVEN_NAME_FIRST) {
        formFields.reverse();
        separator = FAMILY_NAME_FIRST_SEPARATOR;
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
        onClose(tryCatch(() => formFields.map(field => data[field.name].trim()).join(separator), ''));
        reset();
        close();
    });

    useImperativeHandle(ref, () => {
        return {
            open(event, value) {
                tryCatch(() => {
                    const values = value
                        .trim?.()
                        .replace?.(/\s+/, ' ')
                        .split?.(separator)
                        .map?.(value => value?.trim?.())
                        .reverse?.();
                    formFields.forEach(field => setValue(field.name, values.pop()));
                });
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
                        const fields = formFields.reduce((all, { name }) => [...all, name], []);
                        trigger(fields);
                        setFocus(fields[0]);
                    },
                },
            }}
        >
            <form>
                <Grid container spacing={1} columns={10} sx={{ p: 2 }}>
                    {formFields.map(field => (
                        <Grid key={field.name} size={{ xs: 10, md: 4 }}>
                            <Field
                                control={control}
                                component={TextField}
                                placeholder={field.label}
                                name={field.name}
                                validate={[validation.required, validation.minLengthValidator(2), validateNames]}
                                textFieldId={`${id}-names-form-${field.name}`}
                                fullWidth
                            />
                        </Grid>
                    ))}
                    <Grid
                        size={{ xs: 10, md: 1 }}
                        sx={{
                            ml: { xs: 0, md: 1 },
                            mt: { xs: 1, md: 0 },
                        }}
                    >
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

PopoverNamesForm.propTypes = {
    id: PropTypes.string,
    onClose: PropTypes.func,
    mode: PropTypes.oneOf([MODE_FAMILY_NAME_FIRST, MODE_GIVEN_NAME_FIRST]),
};

export default PopoverNamesForm;
