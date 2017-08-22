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

describe('PublicationSubtypesList renders correctly', () => {
    it('without subtypes list', () => {
        const props = {
            vocabId: 453581,
            subtypesList: [],
            actions: {
                loadPublicationSubtypesList: jest.fn()
            }
        };
        const wrapper = setup(props, 'pubSubTypes1');

        const tree = toJson(wrapper);

        expect(tree).toMatchSnapshot();
    });

    it('with subtypes list', () => {
        const props = {
            vocabId: 453581,
            subtypesList: [
                {
                    'cvr_id': 4706,
                    'cvr_parent_cvo_id': 453581,
                    'cvr_child_cvo_id': 453582,
                    'controlled_vocab': {
                        'cvo_id': 453582,
                        'cvo_title': 'Research book (original research)',
                        'cvo_desc': '',
                        'cvo_image_filename': null,
                        'cvo_external_id': null,
                        'cvo_hide': 0,
                        'cvo_order': 2,
                        'cvo_lat': null,
                        'cvo_long': null,
                        'cvo_policy': null,
                        'controlled_vocab_children': []
                    }
                }, {
                    'cvr_id': 4707,
                    'cvr_parent_cvo_id': 453581,
                    'cvr_child_cvo_id': 453583,
                    'controlled_vocab': {
                        'cvo_id': 453583,
                        'cvo_title': 'Textbook',
                        'cvo_desc': '',
                        'cvo_image_filename': null,
                        'cvo_external_id': null,
                        'cvo_hide': 0,
                        'cvo_order': 4,
                        'cvo_lat': null,
                        'cvo_long': null,
                        'cvo_policy': null,
                        'controlled_vocab_children': []
                    }
                }, {
                    'cvr_id': 4708,
                    'cvr_parent_cvo_id': 453581,
                    'cvr_child_cvo_id': 453584,
                    'controlled_vocab': {
                        'cvo_id': 453584,
                        'cvo_title': 'Edited book',
                        'cvo_desc': '',
                        'cvo_image_filename': null,
                        'cvo_external_id': null,
                        'cvo_hide': 0,
                        'cvo_order': 6,
                        'cvo_lat': null,
                        'cvo_long': null,
                        'cvo_policy': null,
                        'controlled_vocab_children': []
                    }
                }, {
                    'cvr_id': 4709,
                    'cvr_parent_cvo_id': 453581,
                    'cvr_child_cvo_id': 453585,
                    'controlled_vocab': {
                        'cvo_id': 453585,
                        'cvo_title': 'Reference work, encyclopaedia, manual or handbook',
                        'cvo_desc': '',
                        'cvo_image_filename': null,
                        'cvo_external_id': null,
                        'cvo_hide': 0,
                        'cvo_order': 8,
                        'cvo_lat': null,
                        'cvo_long': null,
                        'cvo_policy': null,
                        'controlled_vocab_children': []
                    }
                }, {
                    'cvr_id': 4710,
                    'cvr_parent_cvo_id': 453581,
                    'cvr_child_cvo_id': 453586,
                    'controlled_vocab': {
                        'cvo_id': 453586,
                        'cvo_title': 'Creative work',
                        'cvo_desc': '',
                        'cvo_image_filename': null,
                        'cvo_external_id': null,
                        'cvo_hide': 0,
                        'cvo_order': 10,
                        'cvo_lat': null,
                        'cvo_long': null,
                        'cvo_policy': null,
                        'controlled_vocab_children': []
                    }
                }, {
                    'cvr_id': 4711,
                    'cvr_parent_cvo_id': 453581,
                    'cvr_child_cvo_id': 453587,
                    'controlled_vocab': {
                        'cvo_id': 453587,
                        'cvo_title': 'Other',
                        'cvo_desc': '',
                        'cvo_image_filename': null,
                        'cvo_external_id': null,
                        'cvo_hide': 0,
                        'cvo_order': 12,
                        'cvo_lat': null,
                        'cvo_long': null,
                        'cvo_policy': null,
                        'controlled_vocab_children': []
                    }
                }
            ],
            actions: {
                loadPublicationSubtypesList: jest.fn()
            }
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
            subtypesList: [],
            actions: {
                loadPublicationSubtypesList: mounted
            },
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
            subtypesList: [],
            actions: {
                loadPublicationSubtypesList: mounted
            },
            onChange: updated,
            selectedValue: 'Testing'
        };

        setup(props, 'pubSubTypes4');
        expect(updated).toHaveBeenCalled();
    });
});
