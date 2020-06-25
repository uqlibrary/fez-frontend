import LookupListEditor from './LookupListEditor';

function setup(testProps = {}) {
    const props = {
        listEditorId: 'lookup-list-editor',
        ...testProps,
    };

    return getElement(LookupListEditor, props);
}

describe('LookupListEditor', () => {
    it('should render default component', () => {
        const wrapper = setup({ input: { onChange: jest.fn() } });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
