import ListEditorField from './ListEditorField';

describe('ListEditorField function', () => {
    it('should return <FreeTextListEditor> with specified props', () => {
        const props = {
            meta: {
                error: 'test1',
            },
            input: {
                onChange: jest.fn(),
            },
            remindToAdd: 'test2',
            maxInputLength: 100,
        };
        expect(ListEditorField(props)).toMatchSnapshot();

        delete props.meta;
        expect(ListEditorField(props)).toMatchSnapshot();
    });
});
