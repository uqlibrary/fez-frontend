jest.dontMock('./FileUploadDropzone');

import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import FileUploadDropzone from './FileUploadDropzone';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';

function setup(props) {
    return mount(<FileUploadDropzone {...props} />, {
        context: {
            muiTheme: getMuiTheme()
        },
        childContextTypes: {
            muiTheme: PropTypes.object.isRequired
        }
    });
}

describe('FileUploadDropzone', () => {
    it('renders correctly without any setup', () => {
        const onDroppedCallback = jest.fn();
        const props = {
            onDropped: onDroppedCallback,
            maxSize: 1000,
            maxFiles: 3,
            uploadedFiles: [],
            clearErrors: false
        };
        const wrapper = setup(props);

        const tree = toJson(wrapper);

        expect(tree).toMatchSnapshot();
    });

    it('renders row for uploaded files', () => {
        const onDroppedCallback = jest.fn();
        const props = {
            onDropped: onDroppedCallback,
            maxSize: 1000,
            maxFiles: 3,
            uploadedFiles: [],
            clearErrors: false
        };
        const wrapper = setup(props);

        let tree = toJson(wrapper);

        expect(tree).toMatchSnapshot();

        const accepted = [
            {
                type: 'text/text',
                name: 'a.txt',
                size: 500
            },
            {
                type: '',
                name: 'folder',
                size: 500
            },
            {
                type: 'text/text',
                name: 'jalksjflkajsdlkfjasdlkfjalsdfjlkasdjflkajsdfkljasdlfjasljfsajlkdsjflkasdjflkjasdflkj.txt',
                size: 100
            },
            {
                type: 'text/text',
                name: 'a.text.txt',
                size: 100
            }
        ];

        const rejected = [
            {
                type: 'text/text',
                name: 'b.txt',
                size: 50000
            }
        ];

        wrapper.instance().onDrop(accepted, rejected);
        tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();

        const moreFiles = [
            {
                type: 'text/text',
                name: 'b.txt',
                size: 100
            },
            {
                type: 'text/text',
                name: 'c.txt',
                size: 100
            },
            {
                type: 'text/text',
                name: 'd.txt',
                size: 100
            }
        ];

        wrapper.instance().onDrop(moreFiles, []);
        tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
        expect(onDroppedCallback).toHaveBeenCalled();
    });
});
