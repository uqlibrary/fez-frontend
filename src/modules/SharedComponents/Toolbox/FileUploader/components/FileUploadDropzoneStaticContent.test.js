import React from 'react';
import FileUploadDropzoneStaticContent from './FileUploadDropzoneStaticContent';
import { rtlRender } from 'test-utils';

function setup(testProps) {
    const props = {
        ...testProps,
    };

    return rtlRender(<FileUploadDropzoneStaticContent {...props} />);
}

describe('Component FileUploadDropzoneStaticContent', () => {
    it('should render with default setup', () => {
        const props = {
            locale: {
                fileUploadRestrictionHeading: 'Restrictions for file upload',
                fileUploadRestrictions: 'No restrictions applies to Tests!!!',
                fileUploadInstruction: 'Upload whatever you like :)',
            },
        };
        const { container } = setup(props);
        expect(container).toMatchSnapshot();
    });
});
