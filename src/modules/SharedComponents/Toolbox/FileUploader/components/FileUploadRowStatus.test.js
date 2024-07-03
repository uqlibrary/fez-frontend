import React from 'react';
import Immutable from 'immutable';

import FileUploadRowStatus from './FileUploadRowStatus';
import { render, WithReduxStore, preview } from 'test-utils';

const getProps = (testProps = {}) => ({
    name: 'progress',
    onDelete: jest.fn(),
    ...testProps,
});

function setup(testProps = {}, testState = {}) {
    const state = {
        fileUpload: {
            progress: 0,
            isUploadInProgress: false,
            ...testState,
        },
    };

    return render(
        <WithReduxStore initialState={Immutable.Map(state)}>
            <FileUploadRowStatus {...getProps(testProps)} />
        </WithReduxStore>,
    );
}

describe('Component FileUploadRowStatus', () => {
    it('should render default view', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should render circular progress if upload is in progress', () => {
        const { container } = setup(
            {},
            {
                progress: 50,
                isUploadInProgress: true,
            },
        );
        preview.debug();
        expect(container).toMatchSnapshot();
    });

    it('should render done icon if upload is finished', () => {
        const { container } = setup(
            {},
            {
                progress: 100,
                isUploadInProgress: true,
            },
        );
        expect(container).toMatchSnapshot();
    });

    it('should render disabled view', () => {
        const { container } = setup({ disabled: true });
        expect(container).toMatchSnapshot();
    });

    it('should render for edge browser if file is being uploaded but no progress data', () => {
        const { container } = setup({}, { progress: 0, isUploadInProgress: true });
        expect(container).toMatchSnapshot();
    });

    it('should render if file uploaded successfully but later other file failed', () => {
        const { container } = setup({}, { progress: 100, isUploadInProgress: false });
        expect(container).toMatchSnapshot();
    });
});
