import FileUploadDropzoneStaticContent from './FileUploadDropzoneStaticContent';

function setup(testProps, args = {}) {
    const props = {
        ...testProps,
    };

    return getElement(FileUploadDropzoneStaticContent, props, args);
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
        const wrapper = setup(props, { isShallow: false });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
