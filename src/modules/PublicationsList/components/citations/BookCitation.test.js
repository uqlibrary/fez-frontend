jest.dontMock('./BookChapterCitation');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import BookCitation from './BookCitation';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {locale} from 'config';
import {claimedPublications} from 'mock/data/publications';
import {book} from 'mock/data/testing/records';


function setup({publication, isShallow = true}) {
    const props = {
        publication: publication || {}, // : PropTypes.object.isRequired,
    };

    if (isShallow) {
        return shallow(<BookCitation {...props} />);
    }

    return mount(<BookCitation {...props} />, {
        context: {
            muiTheme: getMuiTheme()
        },
        childContextTypes: {
            muiTheme: PropTypes.object.isRequired
        }
    });
}

beforeAll(() => {
    injectTapEventPlugin();
});

describe('BookCitation renders ', () => {
    it('component with empty publication', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const wrapper = setup({ publication: book });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
