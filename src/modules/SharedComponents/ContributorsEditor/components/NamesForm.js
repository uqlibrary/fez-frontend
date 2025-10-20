import React, { forwardRef, useImperativeHandle, useState } from 'react';
import Grid from '@mui/material/Grid';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import Button from '@mui/material/Button';
import { Popover } from '@mui/material';
import { useForm } from '../../../../hooks';
import { Field } from '../../Toolbox/ReactHookForm';
import { validation } from 'config';
import PropTypes from 'prop-types';

const validateNames = value => (value?.match?.(/,/) && 'Commas are not allowed') || undefined;

const NamesForm = (props, ref) => {
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
    } = useForm({ defaultValues: { surname: '', name: '' } });

    const open = event => {
        setAnchor(event.currentTarget);
    };

    const close = () => setAnchor(null);

    const onSubmit = handleSubmit(data => {
        props.onClose(`${data.surname?.trim()}, ${data.name?.trim()}`);
        reset();
        close();
    });

    useImperativeHandle(ref, () => {
        return {
            open(event, value) {
                const names = value?.split?.(',');
                setValue('name', names.pop());
                setValue('surname', names.pop());
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
                    <Grid item sm={12} md={12}>
                        <Field
                            control={control}
                            component={TextField}
                            placeholder="Surname"
                            name="surname"
                            validate={[validation.minLengthValidator(2), validateNames]}
                        />
                    </Grid>
                    <Grid item sm={12} md={12}>
                        <Field
                            control={control}
                            component={TextField}
                            placeholder="Name"
                            name="name"
                            validate={[validation.minLengthValidator(2), validateNames]}
                        />
                    </Grid>
                    <Grid item sm={12} md={12}>
                        <Button
                            type="submit"
                            onClick={onSubmit}
                            variant="contained"
                            color="primary"
                            disabled={hasValidationError}
                        >
                            SET
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Popover>
    );
};

NamesForm.propTypes = {
    onClose: PropTypes.func,
};

export default forwardRef(NamesForm);
