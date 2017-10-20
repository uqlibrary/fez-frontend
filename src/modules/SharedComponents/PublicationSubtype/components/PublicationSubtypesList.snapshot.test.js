jest.dontMock('./PublicationSubtypesList');
// jest.mock('draft-js/lib/generateRandomKey', () => () => '123');

import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import { PublicationSubtypesList } from './PublicationSubtypesList';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';

function setup(props, id) {
    return mount(<PublicationSubtypesList id={id} {...props} />, {
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

describe('PublicationSubtypesList renders ', () => {
    it('without subtypes list', () => {
        const props = {
            vocabId: 453581,
            itemsList: [],
            loadPublicationSubtypesList: jest.fn()
        };
        const wrapper = setup(props, 'pubSubTypes1');

        const tree = toJson(wrapper);

        expect(tree).toMatchSnapshot();
    });

    it('with subtypes list', () => {
        const props = {
            vocabId: 453581,
            itemsList: ['MyRecords book (original research)', 'Textbook', 'Edited book',
                'Reference work, encyclopaedia, manual or handbook', 'Creative work', 'Other'],
            loadPublicationSubtypesList: jest.fn()
        };

        const wrapper = setup(props, 'pubSubTypes2');

        const tree = toJson(wrapper);

        expect(tree).toMatchSnapshot();
    });

    it('with disabled flag set to true', () => {
        const props = {
            vocabId: 453581,
            itemsList: ['MyRecords book (original research)', 'Textbook', 'Edited book',
                'Reference work, encyclopaedia, manual or handbook', 'Creative work', 'Other'],
            disabled: true,
            loadPublicationSubtypesList: jest.fn()
        };

        const wrapper = setup(props, 'pubSubTypes2');

        const tree = toJson(wrapper);

        expect(tree).toMatchSnapshot();
    });

    it('calls componentDidMount and componentWillUpdate', () => {
        const mounted = jest.fn();
        const updated = jest.fn();
        const props = {
            vocabId: 453581,
            itemsList: [],
            loadPublicationSubtypesList: mounted,
            onChange: updated
        };

        const wrapper = setup(props, 'pubSubTypes3');
        expect(mounted).toHaveBeenCalled();

        wrapper.instance()._onSubtypeSelected({}, 0, 'Test');
        expect(updated).toHaveBeenCalled();
    });

    it('calls componentDidMount and componentWillUpdate on providing selectedValue', () => {
        const mounted = jest.fn();
        const updated = jest.fn();

        const props = {
            vocabId: 453581,
            itemsList: [],
            loadPublicationSubtypesList: mounted,
            onChange: updated,
            selectedValue: 'Testing'
        };

        setup(props, 'pubSubTypes4');
        expect(updated).toHaveBeenCalled();
    });
});
