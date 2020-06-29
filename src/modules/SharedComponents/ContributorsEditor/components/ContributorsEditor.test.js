import { ContributorsEditor, mapStateToProps, styles } from './ContributorsEditor';
import { authorsSearch } from 'mock/data';
import Immutable from 'immutable';
import React from 'react';

function setup(testProps = {}, args = {}) {
    const props = {
        author: { aut_id: 1 },
        classes: {
            list: 'list',
            scroll: 'scroll',
        },
        contributorEditorId: 'test',
        ...testProps,
    };
    return getElement(ContributorsEditor, props, args);
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
        const wrapper = setup({ isNtro: true }, { isShallow: false });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders full component for admin user', () => {
        const wrapper = setup({ showContributorAssignment: false, canEdit: true }, { isShallow: false });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders component in edit mode', () => {
        const wrapper = setup({
            editMode: true,
            canEdit: true,
            locale: {
                form: {
                    locale: {
                        addButton: 'test',
                    },
                },
            },
            meta: {
                initial: {
                    toJS: () => [{}],
                },
            },
        });
        wrapper.setState(
            {
                contributors: [
                    {
                        selected: true,
                    },
                ],
            },
            () => {
                expect(wrapper.instance().render()).toMatchSnapshot();
            },
        );
    });

    it('appends a contributor to the list', () => {
        const wrapper = setup();
        expect(wrapper.state().contributors.length).toEqual(0);
        wrapper.instance().addContributor({ displayName: 'J.Smith' });
        expect(wrapper.state().contributors.length).toEqual(1);
    });

    it('appends a contributor with identifier to the list', () => {
        const wrapper = setup();
        expect(wrapper.state().contributors.length).toEqual(0);
        wrapper.instance().addContributor({
            displayName: 'J.Smith',
            ...authorsSearch.data[0],
        });
        expect(wrapper.state().contributors.length).toEqual(1);
        expect(wrapper.state().isCurrentAuthorSelected).toEqual(false);
    });

    it('appends a contributor with duplicate identifier to the list', () => {
        const wrapper = setup();
        expect(wrapper.state().contributors.length).toEqual(0);
        wrapper.instance().addContributor({
            displayName: 'J.Smith',
            ...authorsSearch.data[0],
        });
        expect(wrapper.state().contributors.length).toEqual(1);
        expect(wrapper.state().isCurrentAuthorSelected).toEqual(false);
        wrapper.instance().addContributor({
            displayName: 'J.Smith II',
            ...authorsSearch.data[0],
        });
        expect(wrapper.state().contributors.length).toEqual(1);
    });

    it('appends a contributor with identifier who is a current author to the list', () => {
        const wrapper = setup({ author: authorsSearch.data[0] });
        expect(wrapper.state().contributors.length).toEqual(0);
        wrapper.instance().addContributor({
            nameAsPublished: 'J.Smith',
            uqIdentifier: `${authorsSearch.data[0].aut_id}`,
        });
        expect(wrapper.state().contributors.length).toEqual(1);
        expect(wrapper.state().isCurrentAuthorSelected).toEqual(true);
    });

    it('can edit a selected contributor', () => {
        const wrapper = setup({
            editMode: true,
            author: authorsSearch.data[0],
        });
        wrapper.setState({
            contributorIndexSelectedToEdit: 0,
        });
        wrapper.instance().addContributor({
            uqIdentifier: authorsSearch.data[0].aut_id,
        });
        expect(wrapper.state()).toMatchSnapshot();
    });

    it('can not add contributor with same id', () => {
        const wrapper = setup({
            editMode: true,
            canEdit: true,
            author: authorsSearch.data[0],
        });
        wrapper.setState({
            contributors: [
                {
                    nameAsPublished: 'test',
                    aut_id: authorsSearch.data[0].aut_id,
                },
            ],
        });

        wrapper.instance().addContributor({
            nameAsPublished: 'Test 2',
            aut_id: authorsSearch.data[0].aut_id,
        });
        expect(wrapper.state()).toMatchSnapshot();
    });

    it('can not edit and add contributor with same id', () => {
        const wrapper = setup({
            canEdit: true,
            author: authorsSearch.data[0],
        });
        wrapper.setState({
            contributors: [
                {
                    nameAsPublished: 'test',
                    aut_id: authorsSearch.data[0].aut_id,
                },
                {
                    nameAsPublished: 'Test 2',
                },
            ],
            contributorIndexSelectedToEdit: 1,
        });
        wrapper.instance().addContributor({
            nameAsPublished: 'Testing',
            aut_id: authorsSearch.data[0].aut_id,
        });

        expect(wrapper.state()).toMatchSnapshot();

        wrapper.instance().addContributor({
            nameAsPublished: 'EditedContributorAuthorIdNOTInTheList',
        });
        expect(wrapper.state()).toMatchSnapshot();
    });

    it('assigns a contributor to current author', async () => {
        const wrapper = setup({
            author: {
                aut_id: 101,
            },
        });
        wrapper.setState({
            contributors: [{ aut_id: 101 }, { aut_id: 102 }, { aut_id: 103 }],
            isCurrentAuthorSelected: false,
        });
        expect(wrapper.state().contributors.length).toEqual(3);
        expect(wrapper.state().contributors[0].selected).toBeFalsy();
        wrapper.instance().assignContributor(0);
        expect(wrapper.state().contributors.length).toEqual(3);
        expect(wrapper.state().contributors[0].selected).toEqual(true);
    });

    it('chooses a contributor to edit', () => {
        const wrapper = setup({
            editMode: true,
            canEdit: true,
        });
        wrapper.setState({
            contributors: [
                {
                    nameAsPublished: 'test1',
                    selected: false,
                },
                {
                    nameAsPublished: 'test2',
                    selected: false,
                },
                {
                    nameAsPublished: 'test3',
                    selected: false,
                },
            ],
        });
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance().selectContributor(1);
        expect(wrapper.state().contributors).toEqual([
            {
                nameAsPublished: 'test1',
                selected: false,
            },
            {
                nameAsPublished: 'test2',
                selected: true,
            },
            {
                nameAsPublished: 'test3',
                selected: false,
            },
        ]);
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('chooses a architectural contributor to edit', () => {
        const wrapper = setup({
            editMode: true,
            canEdit: true,
            showIdentifierLookup: true,
        });
        wrapper.setState({
            contributors: [
                {
                    nameAsPublished: 'test1',
                    selected: false,
                },
                {
                    nameAsPublished: 'test2',
                    selected: false,
                },
                {
                    nameAsPublished: 'test3',
                    selected: false,
                },
            ],
        });
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance().selectContributor(1);
        expect(wrapper.state().contributors).toEqual([
            {
                nameAsPublished: 'test1',
                selected: false,
            },
            {
                nameAsPublished: 'test2',
                selected: true,
            },
            {
                nameAsPublished: 'test3',
                selected: false,
            },
        ]);
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('deletes a contributor from the list', () => {
        const wrapper = setup();
        wrapper.setState({
            contributors: [{}, {}, {}],
            isCurrentAuthorSelected: true,
        });
        expect(wrapper.state().contributors.length).toEqual(3);
        wrapper.instance().deleteContributor({}, 0);
        expect(wrapper.state().contributors.length).toEqual(2);
    });

    it('deletes all contributors from a list', () => {
        const wrapper = setup();
        wrapper.setState({
            contributors: [
                { nameAsPublished: 'One', disabled: false },
                { nameAsPublished: 'Two', disabled: false },
                { nameAsPublished: 'Three', disabled: false },
            ],
            isCurrentAuthorSelected: true,
        });
        expect(wrapper.state().contributors.length).toEqual(3);
        wrapper.instance().deleteAllContributors();
        expect(wrapper.state().contributors.length).toEqual(0);
        expect(wrapper.state().isCurrentAuthorSelected).toEqual(false);
    });

    it('moves up a contributor', () => {
        const wrapper = setup();
        wrapper.setState({
            contributors: [{ displayName: 1 }, { displayName: 2 }, { displayName: 3 }],
        });
        expect(wrapper.state().contributors.length).toEqual(3);
        expect(wrapper.state().contributors[1].displayName).toEqual(2);
        wrapper.instance().moveUpContributor({}, 1);
        expect(wrapper.state().contributors.length).toEqual(3);
        expect(wrapper.state().contributors[1].displayName).toEqual(1);
    });

    it('moves down a contributor', () => {
        const wrapper = setup();
        wrapper.setState({
            contributors: [{ displayName: 1 }, { displayName: 2 }, { displayName: 3 }],
        });
        expect(wrapper.state().contributors.length).toEqual(3);
        expect(wrapper.state().contributors[1].displayName).toEqual(2);
        wrapper.instance().moveDownContributor({}, 1);
        expect(wrapper.state().contributors.length).toEqual(3);
        expect(wrapper.state().contributors[1].displayName).toEqual(3);
    });

    it('returns array of contributor rows in edit mode with selectContributor select handler', () => {
        const wrapper = setup({
            editMode: true,
            canEdit: true,
        });
        const testFn = jest.fn();
        wrapper.instance().selectContributor = testFn;
        wrapper.setState({
            contributors: [
                {
                    disabled: false,
                    nameAsPublished: 1,
                },
            ],
        });
        expect(wrapper.instance().renderContributorRows()[0].props.onEdit).toBe(testFn);
    });

    it('should not be able to select contributor in edit mode', () => {
        const wrapper = setup({
            editMode: true,
            canEdit: true,
        });
        const testFn = jest.fn();
        wrapper.instance().selectContributor = testFn;
        wrapper.setState({
            contributors: [
                {
                    disabled: false,
                    nameAsPublished: 1,
                },
            ],
        });
        expect(wrapper.instance().renderContributorRows()[0].props.onSelect).toBe(null);
    });

    it('should disable selection when current author is selected', () => {
        const wrapper = setup({
            showContributorAssignment: true,
        });
        wrapper.setState({
            isCurrentAuthorSelected: true,
            contributors: [
                {
                    disabled: false,
                    nameAsPublished: 1,
                },
            ],
        });
        expect(wrapper.instance().renderContributorRows()[0].props.enableSelect).toBe(false);
    });

    it('returns contributor form with expected props', () => {
        const wrapper = setup({
            contributors: [{ nameAsPublished: 1 }],
        });
        const testFn = jest.fn();

        wrapper.instance().addContributor = testFn;

        expect(wrapper.instance().renderContributorForm()).toMatchSnapshot();

        wrapper.setProps({
            editMode: true,
            canEdit: true,
            locale: {
                form: {
                    locale: {
                        addButton: 'test',
                    },
                },
            },
            meta: {
                initial: {
                    toJS: () => [{}],
                },
            },
        });
        const contributorForm = wrapper.instance().renderContributorForm();
        expect(contributorForm).toMatchSnapshot();

        const testObj = {
            nameAsPublished: 2,
        };
        contributorForm.props.onSubmit(testObj);
        expect(testFn).toBeCalledWith(testObj);
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
            contributors: [{ nameAsPublished: 1 }, { nameAsPublished: 2 }, { nameAsPublished: 3 }],
        });
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Memo(ContributorRow)').length).toEqual(3);
        expect(wrapper.find('Infinite').length).toEqual(0);
    });

    it('renders 4 contributor rows wrapped in an infinite scroll', () => {
        const wrapper = setup({ contributors: [] });
        wrapper.setState({
            contributors: [{ displayName: 1 }, { displayName: 2 }, { displayName: 3 }, { displayName: 4 }],
        });
        expect(wrapper.find('Memo(ContributorRow)').length).toEqual(4);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should show validation error', () => {
        const wrapper = setup({
            contributors: [],
            meta: { error: 'This is a test error' },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('WithStyles(ForwardRef(Typography))').length).toEqual(1);
    });

    it('should update component', () => {
        const onChangeFn = jest.fn();
        const wrapper = setup({
            onChange: onChangeFn,
        });
        wrapper.setState({
            contributors: [{ displayName: 'test 1' }, { displayName: 'test 2' }],
        });

        wrapper.update();

        expect(onChangeFn).toHaveBeenCalledWith([{ displayName: 'test 1' }, { displayName: 'test 2' }]);
    });

    it('should get contributors from props and input value set as an array', () => {
        const wrapper = setup({
            input: {
                name: 'test',
                value: [{ displayName: 'test 1' }, { displayName: 'test 2' }],
            },
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should get contributors from props and input value set as an Immutable list', () => {
        const wrapper = setup({
            input: {
                name: 'test',
                value: Immutable.List([{ displayName: 'test 1' }, { displayName: 'test 2' }]),
            },
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
                ),
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render error as one child', () => {
        const wrapper = setup({
            meta: {
                error: <span>test</span>,
            },
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
                row: 'test row',
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.setState({
            contributors: ['test1', 'test2'],
        });
        expect(wrapper.instance().moveDownContributor('test2', 1)).toBeUndefined();
    });

    it('should map state to props as expected', () => {
        const testFunction = () => ({
            author: 'test',
        });
        expect(
            mapStateToProps({
                get: testFunction,
            }),
        ).toEqual({
            author: 'test',
        });
        expect(
            mapStateToProps({
                get: () => false,
            }),
        ).toEqual({
            author: null,
        });
    });
});
