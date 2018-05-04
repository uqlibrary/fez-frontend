import FileUploadDropzoneStaticContent from './FileUploadDropzoneStaticContent';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps
    };

    return getElement(FileUploadDropzoneStaticContent, props, isShallow);
}

describe('Component FileUploadDropzoneStaticContent', () => {
    it('should render with default setup', () => {
        const props = {
            locale: {
                fileUploadRestrictionHeading: 'Restrictions for file upload',
                fileUploadRestrictions: 'No restrictions applies to Tests!!!',
                fileUploadInstruction: 'Upload whatever you like :)'
            }
        };
        const wrapper = setup(props, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
