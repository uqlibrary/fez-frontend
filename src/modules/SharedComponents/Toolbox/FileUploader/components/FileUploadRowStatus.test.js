import React from 'react';
import { FileUploadRowStatus, mapStateToProps } from './FileUploadRowStatus';
import { render, WithReduxStore } from 'test-utils';

const getProps = (testProps = {}) => ({
    progress: 0,
    isUploadInProgress: false,
    onDelete: jest.fn(),
    ...testProps,
});

function setup(testProps = {}) {
    return render(
        <WithReduxStore>
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
        const { container } = setup({
            progress: 50,
            isUploadInProgress: true,
        });
        expect(container).toMatchSnapshot();
    });

    it('should render done icon if upload is finished', () => {
        const { container } = setup({
            progress: 100,
            isUploadInProgress: true,
        });
        expect(container).toMatchSnapshot();
    });

    it('should render disabled view', () => {
        const { container } = setup({ disabled: true });
        expect(container).toMatchSnapshot();
    });

    it('should render for edge browser if file is being uploaded but no progress data', () => {
        const { container } = setup({ progress: 0, isUploadInProgress: true });
        expect(container).toMatchSnapshot();
    });

    it('should render if file uploaded successfully but later other file failed', () => {
        const { container } = setup({ progress: 100, isUploadInProgress: false });
        expect(container).toMatchSnapshot();
    });

    it('should map state to props as expected', () => {
        const state = {
            get: jest.fn(() => ({
                propName: 'test1',
                isUploadInProgress: true,
            })),
        };
        const test = mapStateToProps(state, { name: 'propName' });
        const result = {
            progress: 'test1',
            isUploadInProgress: true,
        };
        expect(test).toMatchObject(result);

        const test2 = mapStateToProps(
            {
                get: jest.fn(() => null),
            },
            { name: 'propName' },
        );
        const result2 = {
            progress: 0,
            isUploadInProgress: false,
        };
        expect(test2).toMatchObject(result2);
    });
});
