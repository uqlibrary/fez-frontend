import MyRecords from './MyRecords';
import {myRecordsList} from 'mock/data';
import {routes} from 'config';

function setup(testProps, isShallow = true) {
    const props = {
        actions: {
            searchAuthorPublications: jest.fn(),
            setFixRecord: jest.fn(),
        },
        location: {pathname: routes.pathConfig.records.mine},
        history: {
            push: jest.fn(),
            go: jest.fn()
        },
        accountLoading: false,
        publicationsListPagingData: {},
        loadingPublicationsList: false,
        publicationsList: [],
        publicationsListFacets: {},
        ...testProps
    };
    return getElement(MyRecords, props, isShallow);
}

describe('MyRecords test', () => {
    it('renders loading screen while loading account data', () => {
        const wrapper = setup({ accountLoading: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders loading screen while loading publications ', () => {
        const wrapper = setup({ loadingPublicationsList: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders no results', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders list of publications', () => {
        const wrapper = setup({
            publicationsList: myRecordsList.data,
            publicationsListPagingData: {"total": 147, "per_page": 20, "current_page": 1, "from": 1,"to": 20}
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });


    it('state is updated', () => {
        const testAction = jest.fn();
        const wrapper = setup({actions: {searchAuthorPublications: testAction}});

        wrapper.instance().pageSizeChanged(100);
        expect(wrapper.state().pageSize).toEqual(100);
        expect(wrapper.state().page).toEqual(1);
        expect(testAction).toHaveBeenCalled();

        wrapper.instance().pageChanged(2);
        expect(wrapper.state().page).toEqual(2);
        expect(testAction).toHaveBeenCalled();

        wrapper.instance().sortByChanged('foo', 'bar');
        expect(wrapper.state().sortBy).toEqual('foo');
        expect(wrapper.state().sortDirection).toEqual('bar');
        expect(testAction).toHaveBeenCalled();

        wrapper.instance().facetsChanged({'foo': 'bar'});
        expect(wrapper.state().activeFacets).toEqual({'foo': 'bar'});
        expect(wrapper.state().page).toEqual(1);
        expect(testAction).toHaveBeenCalled();
    });

    it('sets forever true has publications', () => {
        const wrapper = setup({loadingPublicationsList: true});
        expect(wrapper.state().hasPublications).toEqual(false);

        wrapper.instance().componentWillReceiveProps({loadingPublicationsList: false, publicationsList: [1,2,3], history: {}, location: {}});
        expect(wrapper.state().hasPublications).toEqual(true);
    });

    it('gets publications when user clicks back', () => {
        const testAction = jest.fn();
        const wrapper = setup({accountLoading: true, actions: {searchAuthorPublications: testAction}});

        wrapper.instance().componentWillReceiveProps({history: { action: 'POP'}, location: {pathname: routes.pathConfig.records.mine}});
        expect(testAction).toHaveBeenCalled();
    });

    it('doesn\'t retrieve data from history if user navigates to next page', () => {
        const testAction = jest.fn();
        const wrapper = setup({accountLoading: true, actions: {searchAuthorPublications: testAction}});

        wrapper.instance().componentWillReceiveProps({history: { action: 'PUSH'}, location: {pathname: routes.pathConfig.records.mine}});
        expect(testAction).not.toHaveBeenCalled();
    });

    it('sets publication to fix', () => {
        const push = jest.fn();
        const setFixRecord = jest.fn();
        const wrapper = setup({accountLoading: true, actions: {setFixRecord: setFixRecord},  history: {push: push}});
        wrapper.instance().fixRecord({rek_pid: 'UQ:111111'});
        expect(push).toHaveBeenCalledWith(routes.pathConfig.records.fix('UQ:111111'));
        expect(setFixRecord).toHaveBeenCalled();
    });
});
