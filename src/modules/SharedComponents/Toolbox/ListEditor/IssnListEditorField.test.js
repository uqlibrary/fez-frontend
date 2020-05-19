import IssnListEditorField from './IssnListEditorField';

describe('IssnListEditorField function', () => {
    it('should return <ListEditor>', () => {
        const props = { input: { onChange: jest.fn() } };
        expect(IssnListEditorField(props)).toMatchSnapshot();
    });

    it('should return <ListEditor> with error attributes', () => {
        const props = { input: { onChange: jest.fn() }, meta: { error: 'test' } };
        expect(IssnListEditorField(props)).toMatchSnapshot();
    });
});
