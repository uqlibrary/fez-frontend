import FileUploadField from './FileUploadField';

describe('FileUploadField method', () => {
    it('should return <FileUploader>', () => {
        const element = FileUploadField({
            input: {
                onChange: jest.fn(),
            },
        });
        expect(element).toMatchSnapshot();
    });
});
