import React from 'react';
import Masquerade from './Masquerade';
import { render, WithReduxStore, fireEvent } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        author: null,
        actions: {},
        account: {},
        ...testProps,
    };
    return render(
        <WithReduxStore>
            <Masquerade {...props} />
        </WithReduxStore>,
    );
}

beforeAll(() => {
    delete global.window.location;
    global.window.location = { href: '', replace: jest.fn(), assign: jest.fn() };
});

describe('Component Masquerade', () => {
    it('Should render form as expected', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('Should render readonly description', () => {
        const props = {
            account: { canMasqueradeType: 'readonly' },
        };
        const { container } = setup(props);
        expect(container).toMatchSnapshot();
    });

    it('should correctly set state on username change', () => {
        const { getByLabelText } = setup();

        fireEvent.change(getByLabelText(/Enter a UQ staff or student username/i), { target: { value: 'uqtest' } });
        expect(getByLabelText(/Enter a UQ staff or student username/i).value).toEqual('uqtest');
    });

    it('should not masquerade if Esc key is pressed', () => {
        const { getByTestId, getByLabelText } = setup();
        fireEvent.change(getByLabelText(/Enter a UQ staff or student username/i), { target: { value: 'uqtest' } });
        fireEvent.keyUp(getByTestId('submit-masquerade'), { key: 'Escape', keyCode: 27 });

        expect(getByTestId('submit-masquerade')).toBeEnabled();
    });

    it('should masquerade if Enter is pressed and username is set', () => {
        const { getByTestId, getByLabelText } = setup();
        fireEvent.change(getByLabelText(/Enter a UQ staff or student username/i), { target: { value: 'uqtest' } });
        fireEvent.keyUp(getByTestId('submit-masquerade'), { key: 'Enter', keyCode: 13 });

        expect(getByTestId('submit-masquerade')).toBeDisabled();
    });

    it('should not masquerade if Enter is pressed without entering username', () => {
        const { getByTestId } = setup();
        fireEvent.keyUp(getByTestId('submit-masquerade'), { key: 'Enter', keyCode: 13 });
        expect(getByTestId('submit-masquerade')).toBeEnabled();
    });

    it('should masquerade if button is pressed and username is set', () => {
        const { getByTestId, getByLabelText } = setup();
        fireEvent.change(getByLabelText(/Enter a UQ staff or student username/i), { target: { value: 'uqtest' } });
        fireEvent.click(getByTestId('submit-masquerade'));
        expect(getByTestId('submit-masquerade')).toBeDisabled();
    });

    it('should not masquerade if button is pressed without entering username', () => {
        const { getByTestId } = setup();
        fireEvent.click(getByTestId('submit-masquerade'));
        expect(getByTestId('submit-masquerade')).toBeEnabled();
    });
});
