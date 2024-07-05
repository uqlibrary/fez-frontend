import React from 'react';
import Immutable from 'immutable';
import { rtlRender, WithReduxStore } from 'test-utils';

import { HelpDrawer } from './HelpDrawer';

function setup(testProps = {}, testState = {}) {
    const props = {
        buttonLabel: 'Test OK',
        ...testProps,
    };
    const state = {
        helpDrawer: {
            open: true,
            ...testState,
        },
    };

    return rtlRender(
        <WithReduxStore initialState={Immutable.Map(state)}>
            <HelpDrawer {...props} />
        </WithReduxStore>,
    );
}

describe('HelpDrawer snapshots tests', () => {
    it('renders menu', () => {
        const hdText = 'Integer mattis rutrum velit nec posuere. Quisque rhoncus quam elit.';
        const { baseElement } = setup(
            { buttonLabel: 'Close' },
            {
                title: 'HelpDrawer Title',
                text: hdText,
            },
        );

        expect(baseElement).toMatchSnapshot();
    });

    it('renders text as react children', () => {
        const { baseElement } = setup(
            {},
            {
                title: 'HelpDrawer title',
                text: (
                    <p>
                        <span>Test text</span>
                    </p>
                ),
            },
        );
        expect(baseElement).toMatchSnapshot();
    });

    it('renders text as react element', () => {
        const { baseElement } = setup(
            {},
            {
                title: 'HelpDrawer title',
                text: <span>Test text</span>,
            },
        );
        expect(baseElement).toMatchSnapshot();
    });
});
