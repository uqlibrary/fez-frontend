import { AppLoader } from './AppLoader';
import AppLoaderWithStyles from './AppLoader';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        classes: {
            appLoader: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'red',
                width: '100%',
                height: '100%',
                textAlign: 'center !important',
            },
            white: {
                color: 'white',
                fontWeight: 200,
            },
            spaceBetween: {
                margin: '16px 0',
            },
        },
    };
    return getElement(AppLoader, props);
}

describe('Component AppLoader', () => {
    it('should render as expected', () => {
        // set initial props values
        const props = {
            title: 'Fez frontend',
            logoImage: 'http://image/image.svg',
            logoText: 'Fez logo',
        };
        const wrapper = setup({ ...props });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with styles', () => {
        const wrapper = getElement(AppLoaderWithStyles, { title: 'Test loader' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
