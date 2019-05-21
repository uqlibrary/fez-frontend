import React from 'react';
import {GrantListEditor, styles} from './GrantListEditor';
import Immutable from 'immutable';

function setup(testProps, isShallow = true){
    const props = {
        disabled: false,
        meta: {},
        onChange: jest.fn(),
        locale: {},
        input: {},
        classes: {},
        required: true,
        hideType: false,
        ...testProps,
    };
    return getElement(GrantListEditor, props, isShallow);
}

describe('GrantListEditor', () => {
    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should have a proper style generator', () => {
        expect(styles()).toMatchSnapshot();
    });

    it('should render with default given value', () => {
        const wrapper = setup({
            input: {
                name: 'TestField',
                value: [
                    {
                        grantAgencyName: 'Testing',
                        grantId: '1234',
                        grantAgencyType: 'Test'
                    }
                ]
            },
            locale: {
                form: {}
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render error from props', () => {
        const wrapper = setup({
            meta: {
                error: (
                    <span>Some error</span>
                )
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render error from props as children', () => {
        const wrapper = setup({
            meta: {
                error: (
                    <p>
                        <span>Test error 1</span>
                        <span>Test error 2</span>
                    </p>
                )
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render string error from props', () => {
        const wrapper = setup({
            meta: {
                error: 'Test error'
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should update with error message', () => {
        const wrapper = setup({});

        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.setState({
            errorMessage: 'Test error message from state'
        });

        wrapper.update();

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with default given value is Immutable List', () => {
        const wrapper = setup({
            input: {
                name: 'TestField',
                value: Immutable.List([
                    {
                        grantAgencyName: 'Testing',
                        grantId: '1234',
                        grantAgencyType: 'Test'
                    }
                ])
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should update on receiving new props', () => {
        const onChangeFn = jest.fn();
        const wrapper = setup({
            input: {
                name: 'TestField',
                value: [
                    {
                        grantAgencyName: 'Testing',
                        grantId: '1234',
                        grantAgencyType: 'Test'
                    }
                ]
            },
            onChange: onChangeFn
        });
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.setState({
            grants: [
                {
                    grantAgencyName: 'Test',
                    grantId: '123',
                    grantAgencyType: 'Testing'
                }
            ]
        });

        expect(onChangeFn).toHaveBeenCalled();
    });

    it('should add grant to the list', () => {
        const wrapper = setup({});
        wrapper.instance().addGrant({
            grantAgencyName: 'Test',
            grantId: '123',
            grantAgencyType: 'Testing'
        });
        wrapper.update();

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render scroll class if grants are more than 3', () => {
        const grant1 = {
            grantAgencyName: 'Test 1',
            grantId: '123',
            grantAgencyType: 'Testing 1'
        };

        const grant2 = {
            grantAgencyName: 'Test 2',
            grantId: '456',
            grantAgencyType: 'Testing 2'
        };

        const grant3 = {
            grantAgencyName: 'Test 3',
            grantId: '456',
            grantAgencyType: 'Testing 3'
        };

        const grant4 = {
            grantAgencyName: 'Test 4',
            grantId: '456',
            grantAgencyType: 'Testing 4'
        };

        const wrapper = setup({
            input: {
                name: 'test',
                value: [grant1, grant2, grant3, grant4]
            },
            classes: {
                scroll: 'scroll-class'
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should move the grant up', () => {
        const grant1 = {
            grantAgencyName: 'Test 1',
            grantId: '123',
            grantAgencyType: 'Testing 1'
        };

        const grant2 = {
            grantAgencyName: 'Test 2',
            grantId: '456',
            grantAgencyType: 'Testing 2'
        };

        const wrapper = setup({
            input: {
                name: 'test',
                value: [grant1, grant2]
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance().moveUpGrant(grant2, 1);
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance().moveUpGrant(grant1, 1);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not move the grant up at index 0', () => {
        const grant1 = {
            grantAgencyName: 'Test 1',
            grantId: '123',
            grantAgencyType: 'Testing 1'
        };

        const wrapper = setup({
            input: {
                name: 'test',
                value: [grant1]
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance().moveUpGrant(grant1, 0);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not move the grant up the disabled grant', () => {

        const grant1 = {
            grantAgencyName: 'Test 1',
            grantId: '123',
            grantAgencyType: 'Testing 1',
            disabled: true
        };

        const grant2 = {
            grantAgencyName: 'Test 2',
            grantId: '456',
            grantAgencyType: 'Testing 2'
        };

        const wrapper = setup({
            input: {
                name: 'test',
                value: [grant1, grant2]
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance().moveUpGrant(grant2, 1);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should move the grant down', () => {
        const grant1 = {
            grantAgencyName: 'Test 1',
            grantId: '123',
            grantAgencyType: 'Testing 1'
        };

        const grant2 = {
            grantAgencyName: 'Test 2',
            grantId: '456',
            grantAgencyType: 'Testing 2'
        };

        const wrapper = setup({
            input: {
                name: 'test',
                value: [grant1, grant2]
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance().moveDownGrant(grant1, 0);
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance().moveDownGrant(grant1, 1);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should delete grant', () => {
        const grant1 = {
            grantAgencyName: 'Test 1',
            grantId: '123',
            grantAgencyType: 'Testing 1'
        };

        const grant2 = {
            grantAgencyName: 'Test 2',
            grantId: '456',
            grantAgencyType: 'Testing 2'
        };

        const wrapper = setup({
            input: {
                name: 'test',
                value: [grant1, grant2]
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance().deleteGrant(grant1, 0);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should delete all grants', () => {
        const grant1 = {
            grantAgencyName: 'Test 1',
            grantId: '123',
            grantAgencyType: 'Testing 1'
        };

        const grant2 = {
            grantAgencyName: 'Test 2',
            grantId: '456',
            grantAgencyType: 'Testing 2'
        };

        const wrapper = setup({
            input: {
                name: 'test',
                value: [grant1, grant2]
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance().deleteAllGrants();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('isFormPopulated() sets state correctly', () => {
        const wrapper = setup({onChange: jest.fn()});
        wrapper.instance().isFormPopulated(true);
        expect(wrapper.state()).toEqual({"errorMessage": "", "grantFormPopulated": true, "grants": []})
        wrapper.instance().isFormPopulated(false);
        expect(wrapper.state()).toEqual({"errorMessage": "", "grantFormPopulated": false, "grants": []})
    });
});
