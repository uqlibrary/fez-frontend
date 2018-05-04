jest.dontMock('./ConfirmDialogBox');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import ConfirmDialogBox from './ConfirmDialogBox';

function setup({locale, hideCancelButton, cancelAction, action}) {
    const props = {
        locale: locale || {
            confirmationTitle: 'Confirmation',
            confirmationMessage: 'Are you sure?',
            cancelButtonLabel: 'No',
            confirmButtonLabel: 'Yes'
        },
        onAction: action || jest.fn(),
        onCancelAction: cancelAction || jest.fn(),
        hideCancelButton: hideCancelButton || false,
        onRef: jest.fn()
    };

    return shallow(<ConfirmDialogBox {...props} />);
}

describe('ConfirmDialogBox snapshots tests', () => {
    it('renders component with yes/no buttons', () => {
        const wrapper = setup({});
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('renders component with yes', () => {
        const wrapper = setup({hideCancelButton: true});
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
    it('renders component with customised locale', () => {
        const wrapper = setup({locale: {
            confirmationTitle: 'ENG: Confirmation',
            confirmationMessage: 'ENG: Are you sure?',
            cancelButtonLabel: 'ENG: No',
            confirmButtonLabel: 'ENG: Yes'
        }});
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
});
