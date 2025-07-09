import LinkInfoListEditorField from './LinkInfoListEditorField';

describe('LinkInfoListEditorField function', () => {
    it('should return <LinkInfoListEditor>', () => {
        const props = { input: { onChange: jest.fn() } };
        expect(LinkInfoListEditorField(props)).toMatchSnapshot();
    });

    it('should return <LinkInfoListEditor> with error attributes', () => {
        const props = { input: { onChange: jest.fn() }, meta: { error: 'test' } };
        expect(LinkInfoListEditorField(props)).toMatchSnapshot();
    });
});
