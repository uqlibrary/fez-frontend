import { Alert, styles } from '../components/Alert';

function setup(testProps = {}) {
    // build full props list required by the component
    const props = {
        classes: {},
        ...testProps,
    };
    return getElement(Alert, props);
}

describe('Alert snapshots test', () => {
    it('renders Alert of error type', () => {
        const title = 'This is a title';
        const message = 'This is the message';
        const type = 'error';

        const wrapper = setup({ title, message, type });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders Alert of error type should render action button', () => {
        const wrapper = setup({ action: jest.fn(), actionButtonLabel: 'Do something' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders Alert of error type should render dismiss icon button', () => {
        const wrapper = setup({ allowDismiss: true, dismissAction: jest.fn() });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders Alert of error type should render dismiss icon button and action button', () => {
        const wrapper = setup({
            action: jest.fn(),
            actionButtonLabel: 'Do something',
            allowDismiss: true,
            dismissAction: jest.fn(),
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders Alert of error type should render dismiss icon button and action button and spinner', () => {
        const wrapper = setup({
            showLoader: true,
            action: jest.fn(),
            actionButtonLabel: 'Do something',
            allowDismiss: true,
            dismissAction: jest.fn(),
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should generate expected styles', () => {
        const theme = {
            shadows: ['test1'],
            breakpoints: {
                up: jest.fn(breakpoint => breakpoint),
                down: jest.fn(breakpoint => breakpoint),
            },
            palette: {
                error: {
                    dark: '#111',
                },
                white: {
                    main: '#eee',
                },
                warning: {
                    dark: '#222',
                },
                secondary: {
                    dark: '#333',
                    main: '#444',
                },
                accent: {
                    dark: '#555',
                },
                success: {
                    dark: '#123',
                },
            },
        };
        expect(styles(theme)).toMatchSnapshot();
    });

    it('should render alert with alternate action', () => {
        const wrapper = setup({
            alternateAction: jest.fn(),
            alternateActionButtonLabel: 'Do something',
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
