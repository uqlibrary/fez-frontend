import ViewRecord from './ViewRecord';
import { mockRecordToFix, ntro } from 'mock/data/testing/records';
import * as records from 'mock/data/testing/records';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
        match: testProps.match || { params: { pid: 'UQ:12344' } },
        actions: testProps.actions || {
            loadRecordToView: jest.fn(),
            clearRecordToView: jest.fn()
        }
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
        const wrapper = setup({
            actions: { loadRecordToView: testMethod },
            match: { params: { pid: 'UQ:111' } }
        });
        expect(testMethod).toHaveBeenCalledWith('UQ:111');
    });

    it('should reset component when component is unmounted', () => {
        const wrapper = setup({});
        wrapper.instance().componentWillUnmount();
        expect(wrapper.instance().props.actions.clearRecordToView).toHaveBeenCalled();
    });

    it('should have componentWillReceiveProps load updated pid', () => {
        const wrapper = setup({});
        const test = jest.spyOn(wrapper.instance().props.actions, 'loadRecordToView');
        const newProps = {
            match: {
                params: {
                    pid: 'UQ:12345'
                }
            }
        };
        wrapper.instance().componentWillReceiveProps(newProps);
        expect(test).toBeCalledWith(newProps.match.params.pid);

        // test else branch
        test.mockClear(); // Reset the called counter from earlier tests
        wrapper.instance().componentWillReceiveProps(wrapper.instance().props);
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
                canMasquerade: true
            }
        });
        expect(wrapper.find('NtroDetails').length).toBe(1);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('Document type snapshots of ViewRecord ', () => {

    const recordInfo = [
        {
            recordType: 'Data collection',
            record: 'dataCollection'
        }, {
            recordType: 'Data collection with FoR codes',
            record: 'dataCollectionWithFoRCodes'
        }, {
            recordType: 'Newspaper article',
            record: 'newspaperArticle'
        }, {
            recordType: 'Thesis',
            record: 'thesis'
        }, {
            recordType: 'Conference proceedings',
            record: 'conferenceProceedings'
        }, {
            recordType: 'Conference paper with proceedings',
            record: 'conferencePaperWithProceedingsTitle'
        }, {
            recordType: 'Digilib image',
            record: 'digilibImage'
        }, {
            recordType: 'Working paper',
            record: 'workingPaper'
        }, {
            recordType: 'Design',
            record: 'design'
        }, {
            recordType: 'Creative work',
            record: 'creativeWork'
        }, {
            recordType: 'Department technical report',
            record: 'departmentTechnicalReport'
        }, {
            recordType: 'Journal article',
            record: 'journalArticle'
        }, {
            recordType: 'Book chapter',
            record: 'bookChapter'
        }, {
            recordType: 'Book',
            record: 'book'
        }, {
            recordType: 'Edited book',
            record: 'editedBook'
        }, {
            recordType: 'Conference paper',
            record: 'conferencePaper'
        }, {
            recordType: 'Generic',
            record: 'generic'
        }, {
            recordType: 'Audio document',
            record: 'audioDocument'
        }, {
            recordType: 'Preprint',
            record: 'preprint'
        }, {
            recordType: 'Research report',
            record: 'researchReport'
        }, {
            recordType: 'Seminar paper',
            record: 'seminarPaper'
        }, {
            recordType: 'Manuscript',
            record: 'manuscript'
        }, {
            recordType: 'Image',
            record: 'imageDocument'
        }, {
            recordType: 'Video',
            record: 'videoDocument'
        }, {
            recordType: 'Journal',
            record: 'journal'
        }, {
            recordType: 'Patent',
            record: 'patent'
        }, {
            recordType: 'NTRO 1',
            record: 'ntro'
        }, {
            recordType: 'NTRO 2',
            record: 'ntro2'
        }, {
            recordType: 'NTRO minimal',
            record: 'ntroMinimal'
        },
    ];

    recordInfo.forEach((record) => {
        it(`should render ${record.recordType}`, () => {
            const wrapper = setup({
                recordToView: records[record.record],
                loadingRecordToView: false,
                recordToViewError: null,
                match: { params: { pid: records[record.record.rek_pid] } },
                actions: {
                    loadRecordToView: jest.fn(),
                    clearRecordToView: jest.fn()
                },
                hideCulturalSensitivityStatement: true,
                account: {}
            });
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });

});
