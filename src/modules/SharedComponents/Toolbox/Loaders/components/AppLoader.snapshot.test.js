import AppLoader from './AppLoader';

function setup(testProps, isShallow = true) {
    const props = {...testProps};
    return getElement(AppLoader, props, isShallow);
}

describe('AppLoader snapshots tests', () => {
    it('renders loader without image', () => {
        const wrapper = setup({title: 'Fez frontend'});
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('renders loader with image', () => {
        const wrapper = setup({
            title:'Fez frontend',
            logoImage: 'http://image/image.svg',
            logoText: 'Fez logo',
            progressColor: '#CCC'
        });
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
});
