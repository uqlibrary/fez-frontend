import { AuthButton, styles } from '../components/AuthButton';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        classes: {},
    };
    return getElement(AuthButton, props);
}

describe('AuthButton', () => {
    it('renders logged out status', () => {
        const wrapper = setup({ isAuthorizedUser: false });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders logged in user status', () => {
        const wrapper = setup({ isAuthorizedUser: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('has helper to generate styles', () => {
        const theme = {
            palette: {
                white: {
                    main: '#fff',
                },
            },
        };
        expect(styles(theme)).toEqual({
            iconButton: {
                color: '#fff',
            },
        });
    });
});
