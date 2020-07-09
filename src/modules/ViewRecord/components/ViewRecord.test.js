import ViewRecord from './ViewRecord';
import { mockRecordToFix, ntro } from 'mock/data/testing/records';
import { default as record } from 'mock/data/records/record';
import { accounts } from 'mock/data/account';
import * as records from 'mock/data/testing/records';

function setup(testProps, isShallow = true) {
    const props = {
        match: testProps.match || { params: { pid: 'UQ:12344' } },
        actions: testProps.actions || {
            loadRecordToView: jest.fn(),
            clearRecordToView: jest.fn(),
        },
        account: testProps.account || accounts.uqresearcher,
        author: testProps.author || null,
        authorDetails: {
            is_administrator: 0,
            is_super_administrator: 0,
        },
        ...testProps,
    };
    return getElement(ViewRecord, props, isShallow);
}

describe('Component ViewRecord ', () => {
    it('should render default props', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render default props with admin menu', () => {
        const wrapper = setup({ account: { canMasquerade: true } });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render missing record message', () => {
        const wrapper = setup({ isDeleted: true, recordToViewError: { message: 'test', status: 404 } });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render loader', () => {
        const wrapper = setup({ loadingRecordToView: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render error', () => {
        const wrapper = setup({ recordToViewError: 'PID not found' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render record view', () => {
        const wrapper = setup({ recordToView: mockRecordToFix });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render deleted record view', () => {
        const wrapper = setup({ recordToView: mockRecordToFix, isDeleted: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should have status prop in the header for admins', () => {
        const wrapper = setup({
            recordToView: { ...mockRecordToFix, rek_status: 1, rek_status_lookup: 'Unpublished' },
            authorDetails: {
                is_administrator: 1,
                is_super_administrator: 0,
            },
        });
        expect(wrapper.find('WithStyles(ForwardRef(Chip))').props().label).toEqual('Unpublished');
    });

    it('should not render components for empty record', () => {
        const wrapper = setup({ recordToView: {} });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render record view without a title', () => {
        const wrapper = setup({ recordToView: mockRecordToFix, hideTitle: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should load record to view', () => {
        const testMethod = jest.fn();
        setup({
            actions: { loadRecordToView: testMethod },
            match: { params: { pid: 'UQ:111' } },
        });
        expect(testMethod).toHaveBeenCalledWith('UQ:111');
    });

    it('should reset component when component is unmounted', () => {
        const wrapper = setup({});
        wrapper.instance().componentWillUnmount();
        expect(wrapper.instance().props.actions.clearRecordToView).toHaveBeenCalled();
    });

    it('should have UNSAFE_componentWillReceiveProps load updated pid', () => {
        const wrapper = setup({});
        const test = jest.spyOn(wrapper.instance().props.actions, 'loadRecordToView');
        const newProps = {
            match: {
                params: {
                    pid: 'UQ:12345',
                },
            },
        };
        wrapper.instance().UNSAFE_componentWillReceiveProps(newProps);
        expect(test).toBeCalledWith(newProps.match.params.pid);

        // test else branch
        test.mockClear(); // Reset the called counter from earlier tests
        wrapper.instance().UNSAFE_componentWillReceiveProps(wrapper.instance().props);
        expect(test).not.toBeCalled();
    });

    it('should not load a record unnecessarily', () => {
        const wrapper = setup({ recordToView: {} });
        const test = jest.spyOn(wrapper.instance().props.actions, 'loadRecordToView');
        test.mockClear();
        wrapper.instance().componentDidMount();
        expect(test).not.toBeCalled();
    });

    it('should render NTRO Details', () => {
        const wrapper = setup({
            recordToView: ntro,
            loadingRecordToView: false,
            recordToViewError: '',
            account: {
                canMasquerade: true,
            },
        });
        expect(wrapper.find('NtroDetails').length).toBe(1);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render record view', () => {
        const author = {
            aut_id: 410,
            aut_org_username: 'uqresearcher',
            aut_org_staff_id: '0001952',
            aut_org_student_id: null,
            aut_email: '',
            aut_display_name: 'Researcher, J',
            aut_fname: 'J',
            aut_mname: '',
            aut_lname: 'Researcher',
            aut_title: 'Professor',
            aut_position: '',
            aut_homepage_link: '',
            aut_created_date: null,
            aut_update_date: '2017-07-23',
            aut_external_id: '0000040357',
            aut_ref_num: '',
            aut_researcher_id: 'A-1137-2007',
            aut_scopus_id: '35478294000',
            aut_is_scopus_id_authenticated: 1,
            aut_mypub_url: '',
            aut_rid_password: '',
            aut_people_australia_id: '',
            aut_description: '',
            aut_orcid_id: '0000-0001-1111-1111',
            aut_google_scholar_id: 'kUemDfMAAAAJ',
            aut_rid_last_updated: '2013-05-17',
            aut_publons_id: null,
            aut_student_username: null,
        };
        const wrapper = setup({
            account: { ...accounts.uqresearcher },
            author: { ...author },
            recordToView: { ...record },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('Document type snapshots of ViewRecord ', () => {
    const recordInfo = [
        {
            recordType: 'Data collection',
            record: 'dataCollection',
        },
        {
            recordType: 'Data collection with FoR codes',
            record: 'dataCollectionWithFoRCodes',
        },
        {
            recordType: 'Newspaper article',
            record: 'newspaperArticle',
        },
        {
            recordType: 'Thesis',
            record: 'thesis',
        },
        {
            recordType: 'Conference proceedings',
            record: 'conferenceProceedings',
        },
        {
            recordType: 'Conference paper with proceedings',
            record: 'conferencePaperWithProceedingsTitle',
        },
        {
            recordType: 'Digilib image',
            record: 'digilibImage',
        },
        {
            recordType: 'Working paper',
            record: 'workingPaper',
        },
        {
            recordType: 'Design',
            record: 'design',
        },
        {
            recordType: 'Creative work',
            record: 'creativeWork',
        },
        {
            recordType: 'Department technical report',
            record: 'departmentTechnicalReport',
        },
        {
            recordType: 'Journal article',
            record: 'journalArticle',
        },
        {
            recordType: 'Book chapter',
            record: 'bookChapter',
        },
        {
            recordType: 'Book',
            record: 'book',
        },
        {
            recordType: 'Edited book',
            record: 'editedBook',
        },
        {
            recordType: 'Conference paper',
            record: 'conferencePaper',
        },
        {
            recordType: 'Generic',
            record: 'generic',
        },
        {
            recordType: 'Audio document',
            record: 'audioDocument',
        },
        {
            recordType: 'Preprint',
            record: 'preprint',
        },
        {
            recordType: 'Research report',
            record: 'researchReport',
        },
        {
            recordType: 'Seminar paper',
            record: 'seminarPaper',
        },
        {
            recordType: 'Manuscript',
            record: 'manuscript',
        },
        {
            recordType: 'Image',
            record: 'imageDocument',
        },
        {
            recordType: 'Video',
            record: 'videoDocument',
        },
        {
            recordType: 'Journal',
            record: 'journal',
        },
        {
            recordType: 'Patent',
            record: 'patent',
        },
        {
            recordType: 'NTRO 1',
            record: 'ntro',
        },
        {
            recordType: 'NTRO 2',
            record: 'ntro2',
        },
        {
            recordType: 'NTRO minimal',
            record: 'ntroMinimal',
        },
    ];

    recordInfo.forEach(record => {
        it(`should render ${record.recordType}`, () => {
            const wrapper = setup({
                recordToView: records[record.record],
                loadingRecordToView: false,
                recordToViewError: null,
                match: { params: { pid: records[record.record.rek_pid] } },
                actions: {
                    loadRecordToView: jest.fn(),
                    clearRecordToView: jest.fn(),
                },
                hideCulturalSensitivityStatement: true,
                account: {},
            });
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });
});
