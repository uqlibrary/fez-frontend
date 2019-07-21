import reloadReducerFromLocalStorage from './ReloadReducerFromLocalStorage';

function setup(WrappedComponent, testProps = {}) {
    const props = {
        ...testProps,
    };

    return getElement(WrappedComponent, props);
}

describe('ReloadReducerFromLocalStorage component', () => {
    it('should render view with default reducer', () => {
        window.localStorage.setItem('form', JSON.stringify({ test: 'abc' }));
        const WrappedComponent = reloadReducerFromLocalStorage()('div');
        const wrapper = setup(WrappedComponent, { id: '#form-reducer' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render view with given reducer', () => {
        window.localStorage.setItem('record', JSON.stringify({ publication: { pid: 'UQ:123455' } }));
        const WrappedComponent = reloadReducerFromLocalStorage('record')('div');
        const wrapper = setup(WrappedComponent, { id: '#record-reducer' });
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(window.localStorage.getItem('record')).toBeNull();
    });
});
