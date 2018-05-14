jest.dontMock('./ExportPublications');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import ExportPublications from './ExportPublications';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';


function setup({onPageSizeChanged, onSortByChanged, disabled, pagingData, isShallow = true}) {
    const defaultPagingData = {
        export_to: 'excel',
        from: 1,
        to: 20,
        total: 60,
        per_page: 20,
        current_page: 1
    };

    const props = {
        pagingData: pagingData || defaultPagingData,
        disabled: disabled || false,
        onPageSizeChanged: onPageSizeChanged || jest.fn(),
        onSortByChanged: onSortByChanged || jest.fn()
    };

    if(isShallow) {
        return shallow(<ExportPublications {...props} />);
    }

    return mount(<ExportPublications {...props} />, {
        context: {
            muiTheme: getMuiTheme()
        },
        childContextTypes: {
            muiTheme: PropTypes.object.isRequired
        }
    });
}

beforeAll(() => {
    
});

describe('Export Publications renders ', () => {
    it('component with all fields enabled', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
        const format = wrapper.find('SelectField');
        expect(format.length).toBe(1);
    });

    it('component with all fields disabled', () => {
        const wrapper = setup({disabled: true});
        wrapper.find('SelectField').forEach(option => {
            expect(option.props().disabled).toEqual(true);
        })
    });
});
