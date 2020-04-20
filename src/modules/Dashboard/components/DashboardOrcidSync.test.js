import DashboardOrcidSyncContainer, { openUrl, DashboardOrcidSync } from './DashboardOrcidSync';

function setup(testProps = {}, args = {}, component = DashboardOrcidSync) {
    const props = {
        author: {
            aut_orcid_works_last_sync: '2020-02-14 16:23:30',
        },
        ...testProps,
    };
    return getElement(component, props, args);
}

describe('openUrl helper', () => {
    it('should return function that calls window.open', () => {
        const testOpen = jest.spyOn(window, 'open');
        testOpen.mockImplementation(() => {});
        const url = 'https://www.uq.edu.au/';
        openUrl(url)();
        expect(testOpen).toHaveBeenCalledWith(url, '_blank');
    });
});

describe('DashboardOrcidSyncContainer', () => {
    it('should render properly', () => {
        const wrapper = setup(
            {},
            {
                requiresStore: true,
            },
            DashboardOrcidSyncContainer,
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('DashboardOrcidSync', () => {
    it('should render properly', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render Pending status', () => {
        const wrapper = setup({
            orcidSyncStatus: {
                orj_status: 'Pending',
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render Pending status', () => {
        const wrapper = setup({
            orcidSyncStatus: {
                orj_status: 'Pending',
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render Done status, and be able to click the sync button', () => {
        const testFn1 = jest.fn();
        const testFn2 = jest.fn();
        const wrapper = setup({
            author: {
                aut_orcid_id: 'test',
            },
            orcidSyncStatus: {
                orj_status: 'Done',
            },
            hideDrawer: testFn1,
            requestOrcidSync: testFn2,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.props().text.props.primaryClick();
        expect(testFn1).toHaveBeenCalledTimes(1);
        expect(testFn2).toHaveBeenCalledTimes(1);
    });

    it('should render Error status', () => {
        const wrapper = setup({
            orcidSyncStatus: {
                orj_status: 'Error',
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
