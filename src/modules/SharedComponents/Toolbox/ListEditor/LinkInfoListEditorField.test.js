import LinkInfoListEditorField from './LinkInfoListEditorField';

describe('LinkInfoListEditorField function', () => {
    it('should return <LinkInfoListEditor>', () => {
        const props = { onChange: jest.fn() };
        expect(LinkInfoListEditorField(props)).toMatchSnapshot();
    });

    it('should return <LinkInfoListEditor> with error attributes', () => {
        const props = { onChange: jest.fn(), state: { error: 'test' } };
        expect(LinkInfoListEditorField(props)).toMatchSnapshot();
    });
});
