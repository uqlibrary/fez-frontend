import Masquerade from './Masquerade';
import { pathConfig } from '../../../config';

function setup(testProps = {}) {
    const props = {
        history: {
            push: jest.fn(),
        },
        account: {},
        ...testProps,
    };
    return getElement(Masquerade, props);
}

beforeAll(() => {
    delete global.window.location;
    global.window.location = { href: jest.fn(), assign: jest.fn() };
});

describe('Component Masquerade', () => {
    it('should correctly set state on username change', () => {
        const wrapper = setup();

        wrapper.instance()._usernameChanged({
            target: {
                value: 'uqtest',
            },
        });

        wrapper.update();
        expect(wrapper.state('userName')).toEqual('uqtest');
    });

    it('should not masquerade if Esc key is pressed', () => {
        const wrapper = setup();
        wrapper.instance()._usernameChanged({
            target: {
                value: 'uqtest',
            },
        });
        wrapper.update();

        wrapper.instance()._masqueradeAs({
            key: 'Esc',
        });

        expect(wrapper.state('loading')).toBeFalsy();
    });

    it('should not masquerade if Enter is pressed but username length is 0', () => {
        const wrapper = setup();
        wrapper.instance()._masqueradeAs({
            key: 'Enter',
        });
        expect(wrapper.state('loading')).toBeFalsy();
    });

    it('should masquerade if Enter is pressed and username is set', () => {
        const wrapper = setup();
        wrapper.instance()._usernameChanged({
            target: {
                value: 'uqtest',
            },
        });
        wrapper.update();

        wrapper.instance()._masqueradeAs({
            key: 'Enter',
        });
        expect(wrapper.state('loading')).toBeTruthy();
    });

    it('should not masquerade if Enter is pressed without entering username', () => {
        const wrapper = setup();
        wrapper.instance()._masqueradeAs({
            key: 'Enter',
        });
        expect(wrapper.state('loading')).toBeFalsy();
    });

    it('should not masquerade if button is pressed without entering username', () => {
        const wrapper = setup();
        wrapper.instance()._masqueradeAs({ type: 'Click' });
        expect(wrapper.state('loading')).toBeFalsy();
    });

    it('should redirect to /dashboard when user is an author', () => {
        const wrapper = setup({ isAuthor: true });
        wrapper.instance()._usernameChanged({
            target: {
                value: 'uqtest',
            },
        });
        wrapper
            .update()
            .instance()
            ._masqueradeAs({
                key: 'Enter',
            });

        const url = wrapper.instance().__redirectUrl();
        expect(url.indexOf(pathConfig.dashboard) > -1).toBe(true);
    });

    it('should redirect to / when user is not an author', () => {
        const wrapper = setup();
        wrapper.instance()._usernameChanged({
            target: {
                value: 'uqtest',
            },
        });
        wrapper
            .update()
            .instance()
            ._masqueradeAs({
                key: 'Enter',
            });

        const url = wrapper.instance().__redirectUrl();
        expect(url.indexOf(pathConfig.dashboard) === -1).toBe(true);
    });
});
