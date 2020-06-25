import IssnListEditorField from './IssnListEditorField';

describe('IssnListEditorField function', () => {
    it('should return <ListEditor>', () => {
        const props = { input: { onChange: jest.fn() }, listEditorId: 'issn-list-editor' };
        expect(IssnListEditorField(props)).toMatchSnapshot();
    });

    it('should return <ListEditor> with error attributes', () => {
        const props = { input: { onChange: jest.fn() }, meta: { error: 'test' }, listEditorId: 'issn-list-editor' };
        expect(IssnListEditorField(props)).toMatchSnapshot();
    });
});
