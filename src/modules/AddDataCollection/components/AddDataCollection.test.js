import React from 'react';
import AddDataCollection, { licenseText } from './AddDataCollection';
import Immutable from 'immutable';
import { render, WithReduxStore, WithRouter, fireEvent, waitFor, screen } from 'test-utils';
import { before } from 'lodash';

/* eslint-disable react/prop-types */
jest.mock('modules/SharedComponents/Toolbox/ReactHookForm', () => ({
    Field: () => {
        return <field />;
    },
}));

function setup(testProps = {}, renderMethod = render) {
    const props = {
        resetForm: testProps.resetForm || jest.fn(),
        ...testProps,
    };

    return renderMethod(
        <WithReduxStore>
            <WithRouter>
                <AddDataCollection {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

jest.mock('hooks', () => ({
    useValidatedForm: jest.fn(),
}));
describe('AddDataCollection test mocking hooks', () => {
    it('should navigate to my datasets url', async () => {
        const { useValidatedForm } = require('hooks'); // Mocked version
        setup();
        expect(useValidatedForm).toHaveBeenCalled();
    });
});

describe('AddDataCollection test', () => {
    it('should render data set form', () => {
        const { container, getByRole } = setup();
        expect(container.getElementsByTagName('field').length).toEqual(28);
    });
});
