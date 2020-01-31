import issnListEditorField from './issnListEditorField';

describe('issnListEditorField function', () => {
    it('should return <issnListEditor>', () => {
        const props = { input: { onChange: jest.fn() } };
        expect(issnListEditorField(props)).toMatchSnapshot();
    });

    it('should return <issnListEditor> with error attributes', () => {
        const props = { input: { onChange: jest.fn() }, meta: { error: 'test' } };
        expect(issnListEditorField(props)).toMatchSnapshot();
    });
});
