jest.dontMock('./VideoDocumentForm');
import React from 'react';
import VideoDocumentForm from './VideoDocumentForm';
import { render, WithReduxStore } from 'test-utils';

/* eslint-disable react/prop-types */
jest.mock('redux-form/immutable', () => ({
    Field: props => {
        return (
            <field
                is="mock"
                name={props.name}
                title={props.title}
                required={props.required}
                disabled={props.disabled}
                label={props.label || props.floatingLabelText}
                hasError={props.hasError}
            />
        );
    },
}));

function setup(testProps = {}) {
    const props = {
        ...testProps,
        isSubmitting: testProps.isSubmitting || false, // : PropTypes.bool,
    };
    return render(
        <WithReduxStore>
            <VideoDocumentForm {...props} />
        </WithReduxStore>,
    );
}

describe('VideoDocumentForm renders ', () => {
    it('component', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with 10 input fields', () => {
        const { container } = setup();
        expect(container.getElementsByTagName('field').length).toEqual(10);
    });

    it('component with all fields disabled', () => {
        const { container } = setup({ isSubmitting: true });
        expect(container.querySelectorAll('field[disabled=true]').length).toEqual(10);
    });

    it('component should render contributor assignment', () => {
        const { container } = setup({
            formValues: {
                get: key => {
                    const values = {
                        editors: [{ selected: true }, { selected: true }],
                        authors: [{ selected: true }, { selected: true }],
                    };
                    return values[key];
                },
            },
        });
        expect(container).toMatchSnapshot();
    });
});
