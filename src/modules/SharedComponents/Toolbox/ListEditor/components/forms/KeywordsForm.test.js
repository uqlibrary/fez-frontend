import React from 'react';
import KeywordsForm from './KeywordsForm';
import { indexOf } from 'lodash';
import { fireEvent, render } from 'test-utils';

const setup = (testProps = {}) => {
    const props = {
        mode: 'add',
        onSubmit: jest.fn(),
        listEditorId: 'test',
        normalize: value => value,
        ...testProps,
    };
    return render(<KeywordsForm {...props} />);
};

describe('KeywordsForm component', () => {
    it('should add array of keywords if the input value includes any pipe sign in "add" mode', () => {
        const onSubmit = jest.fn();
        const { getByTestId } = setup({ onSubmit: onSubmit });

        fireEvent.change(getByTestId('test-input'), { target: { value: 'one|two|three' } });
        fireEvent.click(getByTestId('test-add'));

        expect(onSubmit).toHaveBeenCalledWith(['one', 'two', 'three'], indexOf);
    });

    it('should not split item that includes in "update" mode', () => {
        const onSubmit = jest.fn();
        const { getByTestId } = setup({ onSubmit: onSubmit, mode: 'update' });

        fireEvent.change(getByTestId('test-input'), { target: { value: 'one|two|three' } });
        fireEvent.click(getByTestId('test-update'));

        expect(onSubmit).toHaveBeenCalledWith('one|two|three', indexOf);
    });
});
