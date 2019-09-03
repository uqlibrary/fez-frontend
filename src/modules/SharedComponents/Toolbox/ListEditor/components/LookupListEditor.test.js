import LookupListEditor from './LookupListEditor';

function setup(testProps = {}) {
    const props = {
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
