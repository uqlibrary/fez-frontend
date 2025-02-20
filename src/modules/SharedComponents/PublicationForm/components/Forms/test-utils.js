import { useForm } from 'react-hook-form';
import { render, WithReduxStore } from 'test-utils';
import React from 'react';

export const ControlledFieldWithReduxStore = (Form, props) => {
    const Wrapper = () => {
        const {
            control,
            formState: { isSubmitting },
        } = useForm();

        // eslint-disable-next-line react/prop-types
        return <Form {...{ control, isSubmitting, ...props, values: props?.values || {} }} />;
    };

    return render(
        <WithReduxStore>
            <Wrapper />
        </WithReduxStore>,
    );
};
