import {
    SecurityCard,
    isFileValid,
    SecuritySelector,
    OverriddenSecuritySelector,
    DataStreamSecuritySelector,
    styles
} from './SecurityCard';
import { RECORD_TYPE_RECORD } from 'config/general';
import { communityRecord, collectionRecord, recordWithDatastreams } from 'mock/data/records';

function setup(testProps, isShallow = true) {
    const props = {
        classes: {},
        disabled: false,
        selectedPolicyKey: 1,
        text: {
            description: 'test1',
            prompt: 'test2',
            dataStream: {
                overridePrompt: 'test3'
            }
        },
        record: {
            rek_pid: 'test4',
            rek_object_type_lookup: 'Community'
        },
        ...testProps
    };

    return getElement(SecurityCard, props, isShallow);
}

describe('SecurityCard component', () => {
    it('should render properly', () => {
        const wrapper1 = setup({});
        expect(toJson(wrapper1)).toMatchSnapshot();

        const wrapper2 = setup({ selectedPolicyKey: undefined });
        expect(toJson(wrapper2)).toMatchSnapshot();
    });

    it('should render communities properly', () => {
        const wrapper = setup({ record: communityRecord });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render collections properly', () => {
        const wrapper = setup({ record: collectionRecord });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render collections properly with dataStreamPolicy', () => {
        const wrapper = setup({ record: collectionRecord, dataStreamPolicy: 1 });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render records properly with inherited security', () => {
        const wrapper = setup({ record: recordWithDatastreams });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render records properly without inherited security', () => {
        const recordWithoutInheritedSecurity = {
            ...recordWithDatastreams,
            rek_security_inherited: false
        };
        const wrapper = setup({ record: recordWithoutInheritedSecurity });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should have a proper field normalising prop', () => {
        const wrapper = setup({ record: recordWithDatastreams });
        expect(wrapper.find('Field').props().normalize('')).toBe(1);
        expect(wrapper.find('Field').props().normalize('something')).toBe(0);
    });
});

describe('isFileValid helper', () => {
    it('should detect valid files', () => {
        const test = {
            dsi_dsid: 'test.txt',
            dsi_label: 'test',
            dsi_state: 'A'
        };
        expect(isFileValid(test)).toBe(true);
    });
});

describe('SecuritySelector component', () => {
    it('should render properly', () => {
        const testProps = {
            disabled: false,
            text: {
                description: 'test1',
                prompt: 'test2',
                selectedTitle: 'test3',
            },
            isPolicyInherited: true,
            isSecurityInheritedChecked: true,
            securityType: 'test4',
            securityPolicy: 2
        };
        const test1 = getElement(SecuritySelector, testProps);
        expect(toJson(test1)).toMatchSnapshot();

        testProps.securityType = RECORD_TYPE_RECORD;
        const test2 = getElement(SecuritySelector, testProps);
        expect(toJson(test2)).toMatchSnapshot();
    });
});

describe('OverriddenSecuritySelector component', () => {
    it('should render properly', () => {
        const testProps = {
            disabled: false,
            text: {
                description: 'test1',
                prompt: 'test2',
                selectedTitle: 'test3'
            },
            securityType: 'test4',
            securityPolicy: 1
        };
        const wrapper = getElement(OverriddenSecuritySelector, testProps);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

});

describe('DataStreamSecuritySelector component', () => {
    it('should render properly', () => {
        const test = getElement(
            DataStreamSecuritySelector,
            {
                text: {
                    prompt: 'test1',
                },
                disabled: false,
                dsi: {
                    dsi_dsid: 'test2',
                    fieldName: 'test3',
                },
                classes: {
                    dataStreamFileBlock: 'test4',
                },
            },
            true
        );
        expect(toJson(test)).toMatchSnapshot();
    });
});

describe('styles helper', () => {
    it('should return style object as expected', () => {
        expect(styles()).toMatchSnapshot();
    });
});
