import { useForm } from 'react-hook-form';
import { render, WithReduxStore } from 'test-utils';
import React from 'react';
import { formValues } from '../PublicationForm';

export const ControlledFieldWithReduxStore = (Form, props) => {
    const Wrapper = () => {
        const {
            control,
            formState: { isSubmitting },
        } = useForm();

        // eslint-disable-next-line react/prop-types
        return <Form {...{ control, isSubmitting, ...props, formValues: formValues(props?.formValues || {}) }} />;
    };

    return render(
        <WithReduxStore>
            <Wrapper />
        </WithReduxStore>,
    );
};
