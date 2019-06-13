import InheritedSecurityDetails from './InheritedSecurityDetails';

function setup(testProps = {}, isShallow = true) {
    const props = {
        collections: [],
        ...testProps
    }

    return getElement(InheritedSecurityDetails, props, isShallow);
}

describe('InheritedSecurityDetails component', () => {
    it('should render properly', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render collections correctly', () => {
        const wrapper = setup({
            collections: [{
                parent: {
                    rek_pid: 'UQ:11111',
                    rek_security_policy: 2,
                },
                rek_ismemberof: 'UQ:11111',
                rek_ismemberof_lookup: 'Test collection'
            }, {
                parent: {
                    rek_pid: 'UQ:22222',
                    rek_security_policy: 4,
                },
                rek_ismemberof: 'UQ:22222',
                rek_ismemberof_lookup: 'Another test collection'
            }]
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});