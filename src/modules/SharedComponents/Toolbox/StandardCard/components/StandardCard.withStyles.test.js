import StandardCard from './StandardCard';

function setup(testProps, isShallow = true) {
    const props = {...testProps};
    return getElement(StandardCard, props, isShallow);
}

describe('StandardCard component with styles', () => {
    it('should render properly', () => {
        const wrapper = setup({}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});