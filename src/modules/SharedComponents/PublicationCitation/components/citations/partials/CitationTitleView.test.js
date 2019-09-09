import CitationTitleView from './CitationTitleView';

function setup(testProps = {}) {
    const props = { ...testProps };
    return getElement(CitationTitleView, props);
}

describe('CitationTitleView partial', () => {
    it('should render default view', () => {
        const wrapper = setup({
            prefix: 'prefix',
            suffix: 'suffix',
            className: 'className',
            value: 'value',
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render properly with empty props', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render properly with value prop only', () => {
        const wrapper = setup({
            value: 'value',
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render properly with a suffix that equal to the last character of the value', () => {
        const wrapper = setup({
            value: 'values',
            suffix: 's',
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
