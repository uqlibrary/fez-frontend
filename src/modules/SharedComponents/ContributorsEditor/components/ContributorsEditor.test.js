import { ContributorsEditor, mapStateToProps, styles } from './ContributorsEditor';
import { authorsSearch } from 'mock/data';
import Immutable from 'immutable';
import React from 'react';

function setup(testProps, isShallow = true) {
    const props = {
        author: { aut_id: 1 },
        classes: {
            list: 'list',
            scroll: 'scroll'
        },
        ...testProps,
    };
    return getElement(ContributorsEditor, props, isShallow);
}

describe('ContributorsEditor', () => {
    it('renders full component with a defined className', () => {
        const wrapper = setup({ className: 'requiredField' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders full component with identifier lookup', () => {
        const wrapper = setup({ showIdentifierLookup: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders full component with role input', () => {
        const wrapper = setup({ showRoleInput: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders full component with NTRO fields', () => {
        const wrapper = setup({ isNtro: true }, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders component in edit mode', () => {
        const wrapper = setup({
            editMode: true,
            locale: {
                form: {
                    locale: {
                        addButton: 'test'
                    }
                }
            },
            meta: {
                initial: {
                    toJS: () => ([{}])
                }
            }
        });
        wrapper.setState({
            contributors: [{
                selected: true
            }],
        }, () => {
            expect(wrapper.instance().render()).toMatchSnapshot();
        });
    });

    it('appends a contributor to the list', () => {
        const wrapper = setup({});
        expect(wrapper.state().contributors.length).toEqual(0);
        wrapper.instance().addContributor({ displayName: 'J.Smith' });
        expect(wrapper.state().contributors.length).toEqual(1);
    });

    it('appends a contributor with identifier to the list', () => {
        const wrapper = setup({});
        expect(wrapper.state().contributors.length).toEqual(0);
        wrapper.instance().addContributor({
            displayName: 'J.Smith',
            ...authorsSearch.data[0]
        });
        expect(wrapper.state().contributors.length).toEqual(1);
        expect(wrapper.state().isCurrentAuthorSelected).toEqual(false);
    });

    it('appends a contributor with duplicate identifier to the list', () => {
        const wrapper = setup({});
        expect(wrapper.state().contributors.length).toEqual(0);
        wrapper.instance().addContributor({
            displayName: 'J.Smith',
            ...authorsSearch.data[0]
        });
        expect(wrapper.state().contributors.length).toEqual(1);
        expect(wrapper.state().isCurrentAuthorSelected).toEqual(false);
        wrapper.instance().addContributor({
            displayName: 'J.Smith II',
            ...authorsSearch.data[0]
        });
        expect(wrapper.state().contributors.length).toEqual(1);
    });

    it('appends a contributor with identifier who is a current author to the list', () => {
        const wrapper = setup({ author: authorsSearch.data[0] });
        expect(wrapper.state().contributors.length).toEqual(0);
        wrapper.instance().addContributor({
            displayName: 'J.Smith',
            ...authorsSearch.data[0]
        });
        expect(wrapper.state().contributors.length).toEqual(1);
        expect(wrapper.state().isCurrentAuthorSelected).toEqual(true);
    });

    it('updates a contributor', () => {
        const wrapper = setup({});
        wrapper.setState({
            contributors: [{
                test: 'value1'
            }, {
                test: 'value2'
            }, {
                test: 'value3'
            }]
        });
        wrapper.instance().updateContributor({ test: 'value4' }, 1);
        expect(wrapper.state().contributors[1].test).toBe('value4');
    });

    it('assigns a contributor to current author', async () => {
        const wrapper = setup({
            author: {
                aut_id: 101,
            },
        });
        wrapper.setState({
            contributors: [
                { aut_id: 101 },
                { aut_id: 102 },
                { aut_id: 103 },
            ],
            isCurrentAuthorSelected: false,
        });
        expect(wrapper.state().contributors.length).toEqual(3);
        expect(wrapper.state().contributors[0].selected).toBeFalsy();
        wrapper.instance().chooseSelf(0);
        expect(wrapper.state().contributors.length).toEqual(3);
        expect(wrapper.state().contributors[0].selected).toEqual(true);
    });

    it('chooses a contributor to edit', () => {
        const wrapper = setup({});
        wrapper.setState({
            contributors: [{
                selected: true
            }, {
                selected: false
            }, {
                selected: false
            }]
        });
        wrapper.instance().chooseToEdit(1);
        expect(wrapper.state().contributors).toEqual([
            {
                selected: false
            }, {
                selected: true
            }, {
                selected: false
            }
        ]);
    });

    it('deletes a contributor from the list', () => {
        const wrapper = setup({});
        wrapper.setState({
            contributors: [{}, {}, {}],
            isCurrentAuthorSelected: true
        });
        expect(wrapper.state().contributors.length).toEqual(3);
        wrapper.instance().deleteContributor({}, 0);
        expect(wrapper.state().contributors.length).toEqual(2);
    });

    it('deletes all contributors from a list', () => {
        const wrapper = setup({});
        wrapper.setState({
            contributors: [
                { 'nameAsPublished': 'One', 'disabled': false },
                { 'nameAsPublished': 'Two', 'disabled': false },
                { 'nameAsPublished': 'Three', 'disabled': false }
            ], isCurrentAuthorSelected: true
        });
        expect(wrapper.state().contributors.length).toEqual(3);
        wrapper.instance().deleteAllContributors();
        expect(wrapper.state().contributors.length).toEqual(0);
        expect(wrapper.state().isCurrentAuthorSelected).toEqual(false);
    });

    it('moves up a contributor', () => {
        const wrapper = setup({});
        wrapper.setState({
            contributors: [
                { displayName: 1 },
                { displayName: 2 },
                { displayName: 3 }
            ]
        });
        expect(wrapper.state().contributors.length).toEqual(3);
        expect(wrapper.state().contributors[1].displayName).toEqual(2);
        wrapper.instance().moveUpContributor({}, 1);
        expect(wrapper.state().contributors.length).toEqual(3);
        expect(wrapper.state().contributors[1].displayName).toEqual(1);
    });

    it('moves down a contributor', () => {
        const wrapper = setup({});
        wrapper.setState({
            contributors: [
                { displayName: 1 },
                { displayName: 2 },
                { displayName: 3 }
            ]
        });
        expect(wrapper.state().contributors.length).toEqual(3);
        expect(wrapper.state().contributors[1].displayName).toEqual(2);
        wrapper.instance().moveDownContributor({}, 1);
        expect(wrapper.state().contributors.length).toEqual(3);
        expect(wrapper.state().contributors[1].displayName).toEqual(3);
    });

    it('passes showContributorAssignment prop to ContributorRow as expected', () => {
        const wrapper = setup({
            showContributorAssignment: true
        });
        wrapper.setState({
            isCurrentAuthorSelected: false,
            contributors: [{ nameAsPublished: 1 }],
        });
        expect(wrapper.instance().renderContributorRows()[0].props.showContributorAssignment).toBe(true);
    });

    it('returns array of contributor rows in edit mode with chooseToEdit select handler', () => {
        const wrapper = setup({
            editMode: true
        });
        const testFn = jest.fn();
        wrapper.instance().chooseToEdit = testFn;
        wrapper.setState({
            contributors: [{
                nameAsPublished: 1
            }]
        })
        expect(wrapper.instance().renderContributorRows()[0].props.onSelect).toBe(testFn);
    });

    it('returns contributor form with expected props', () => {
        const wrapper = setup({
            contributors: [
                { nameAsPublished: 1 }
            ]
        });
        const testFn = jest.fn();
        expect(wrapper.instance().renderContributorForm(testFn, 0)).toMatchSnapshot();

        wrapper.setProps({
            editMode: true,
            locale: {
                form: {
                    locale: {
                        addButton: 'test'
                    }
                }
            },
            meta: {
                initial: {
                    toJS: () => ([{}])
                }
            }
        });
        const contributorForm = wrapper.instance().renderContributorForm(testFn, 0);
        expect(contributorForm).toMatchSnapshot();

        const testObj = {
            nameAsPublished: 2
        };
        contributorForm.props.onSubmit(testObj);
        expect(testFn).toBeCalledWith(testObj, 0);

    });

    // Tests for infinite scroll appear or not
    it('renders no contributor rows with no infinite scroll', () => {
        const wrapper = setup({ contributors: [] });
        wrapper.setState({ contributors: [] });
        expect(wrapper.find('ContributorRow').length).toEqual(0);
        expect(wrapper.find('Infinite').length).toEqual(0);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders 3 contributor rows with no infinite scroll', () => {
        const wrapper = setup({ contributors: [] });
        wrapper.setState({
            contributors: [
                { nameAsPublished: 1 },
                { nameAsPublished: 2 },
                { nameAsPublished: 3 }
            ]
        });
        wrapper.update();
        expect(wrapper.find('WithStyles(WithTheme(WithWidth(ContributorRow)))').length).toEqual(3);
        expect(wrapper.find('Infinite').length).toEqual(0);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders 4 contributor rows wrapped in an infinite scroll', () => {
        const wrapper = setup({ contributors: [] });
        wrapper.setState({
            contributors: [
                { displayName: 1 },
                { displayName: 2 },
                { displayName: 3 },
                { displayName: 4 }
            ]
        });
        expect(wrapper.find('WithStyles(WithTheme(WithWidth(ContributorRow)))').length).toEqual(4);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should show validation error', () => {
        const wrapper = setup({
            contributors: [],
            meta: { error: 'This is a test error' }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('WithStyles(Typography)').length).toEqual(1);
    });

    it('should update component', () => {
        const onChangeFn = jest.fn();
        const wrapper = setup({
            onChange: onChangeFn
        });
        wrapper.setState({
            contributors: [
                { displayName: 'test 1' },
                { displayName: 'test 2' },
            ]
        });

        expect(onChangeFn).toHaveBeenCalledWith([
            { displayName: 'test 1' },
            { displayName: 'test 2' },
        ]);
    });

    it('should get contributors from props and input value set as an array', () => {
        const wrapper = setup({
            input: {
                name: 'test',
                value: [
                    { displayName: 'test 1' },
                    { displayName: 'test 2' },
                ]
            }
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should get contributors from props and input value set as an Immutable list', () => {
        const wrapper = setup({
            input: {
                name: 'test',
                value: Immutable.List([
                    { displayName: 'test 1' },
                    { displayName: 'test 2' },
                ])
            }
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render error as html', () => {
        const wrapper = setup({
            meta: {
                error: (
                    <p>
                        <span>test</span>
                    </p>
                )
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render error as one child', () => {
        const wrapper = setup({
            meta: {
                error: (<span>test</span>)
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should have a proper style generator', () => {
        expect(styles()).toMatchSnapshot();
    });

    it('should not move contributor up', () => {
        const wrapper = setup({});
        expect(wrapper.instance().moveUpContributor('test', 0)).toBeUndefined();
    });

    it('should not move contributor down', () => {
        const wrapper = setup({
            locale: {
                form: 'test',
                header: 'test header',
                row: 'test row'
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.setState({
            contributors: [
                'test1',
                'test2'
            ]
        });
        expect(wrapper.instance().moveDownContributor('test2', 1)).toBeUndefined();
    });

    it('should map state to props as expected', () => {
        const testFunction = () => ({
            author: 'test'
        });
        expect(mapStateToProps({
            get: testFunction
        })).toEqual({
            author: 'test'
        });
        expect(mapStateToProps({
            get: () => false
        })).toEqual({
            author: null
        });
    });
});
