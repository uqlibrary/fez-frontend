import PublicationForm from './PublicationForm';
import React from 'react';
import { previewAndHalt, render, WithReduxStore, WithRouter } from 'test-utils';

function setup(props = {}, renderMethod = render) {
    return renderMethod(
        <WithReduxStore>
            <WithRouter>
                <PublicationForm {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('PublicationForm', () => {
    it('initial state', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });
});
