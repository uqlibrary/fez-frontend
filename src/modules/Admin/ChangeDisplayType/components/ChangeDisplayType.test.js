import ChangeDisplayType from './ChangeDisplayType';
import Immutable from 'immutable';
import { act } from '@testing-library/react';
// import { createMemoryHistory } from 'history';

// import publicationTypeListConferencePaper from 'mock/data/records/publicationTypeListConferencePaper';
import publicationTypeListJournalArticle from 'mock/data/records/publicationTypeListJournalArticle';
import publicationTypeListResearchReport from 'mock/data/records/publicationTypeListResearchReport';
import publicationTypeListAudio from 'mock/data/records/publicationTypeListAudio';
// import { default as formLocale } from '../../../../locale/publicationForm';
import { default as componentsLocale } from 'locale/components';
// import { routes } from '../../../../config';
// import collectionRecord from 'mock/data/records/collectionRecord';

// const confPaperRecord = {
//     ...publicationTypeListConferencePaper.data[0],
//     fez_record_search_key_doi: {
//         rek_doi: DOI_ORG_PREFIX,
//     },
//     fez_record_search_key_publisher: {
//         rek_publisher: 'The University of Queensland',
//     },
// };
// const journalArticleRecord = publicationTypeListJournalArticle.data[0];
const mockRecord = {
    ...publicationTypeListResearchReport.data[0],
    fez_record_search_key_publisher: {
        rek_publisher: 'The University of Queensland',
    },
};

jest.mock('react-router', () => ({
    useParams: jest.fn(() => ({ pid: mockRecord.rek_pid })),
}));

const setup = (testProps = {}, args = { isShallow: true }) => {
    const props = {
        autofill: jest.fn(),
        blur: jest.fn(),
        change: jest.fn(),
        clearAsyncError: jest.fn(),
        anyTouched: true,
        asyncValidating: false,
        asyncValidate: jest.fn(),
        clearFields: jest.fn(),
        clearSubmitErrors: jest.fn(),
        destroy: jest.fn(),
        dispatch: jest.fn(),
        handleSubmit: jest.fn(),
        history: { push: jest.fn() },
        initialize: jest.fn(),
        reset: jest.fn(),
        resetSection: jest.fn(),
        touch: jest.fn(),
        submit: jest.fn(),
        untouch: jest.fn(),
        clearSubmit: jest.fn(),
        dirty: true,
        form: 'form',
        initialized: false,
        submitFailed: false,
        valid: true,
        pure: true,
        // common immutable props above
        formValues: testProps.initialValues ? Immutable.Map(testProps.initialValues) : Immutable.Map({}),
        submitting: testProps.submitting || false, // : PropTypes.bool
        submitSucceeded: testProps.submitSucceeded || false, // : PropTypes.bool
        invalid: testProps.invalid || false, // : PropTypes.bool
        pristine: testProps.pristine || false, // : PropTypes.bool
        actions: {
            logout: jest.fn(),
            checkSession: jest.fn(),
            clearSessionExpiredFlag: jest.fn(),
        },
        resetSubType: jest.fn(),
        record: mockRecord,
        ...testProps,
    };

    return getElement(ChangeDisplayType, props, args);
};

const rekDisplayTypeJournalArticle = '179';

describe('ChangeDisplayType form', () => {
    it('should render empty form when no record supplied', () => {
        const wrapper = setup({ record: null });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render loading message when record is loading', () => {
        const wrapper = setup({
            loadingRecordToView: true,
            record: null,
        });
        expect(wrapper.find('WithStyles(InlineLoader)').props().message).toBe('Loading work');
    });

    it('should render citation', () => {
        const wrapper = setup({
            record: {
                ...mockRecord,
                fez_record_search_key_doi: {
                    rek_doi: 'Testing',
                },
            },
        });
        expect(wrapper.find('[data-testid="changeDisplayType-page-title"]').text()).toBe(
            `Change display type from ${mockRecord.rek_display_type_lookup} - ${mockRecord.rek_subtype}`,
        );
    });

    it('should render form loaded with submit button disabled', () => {
        // const wrapper = setup({ record: mockRecord }, { isShallow: false });
        const wrapper = setup({ record: mockRecord });
        expect(toJson(wrapper)).toMatchSnapshot();
        // console.log(wrapper.find('Field').debug());
        expect(wrapper.find('Field').length).toEqual(1);
        // expect(wrapper.find('#rek-changeDisplayType-submit').props().disabled).toEqual(true);
    });

    it('should have an enabled submit button when user has selected a work type WITHOUT subtypes', () => {
        // const wrapper = setup({ record: { ...publicationTypeListAudio.data[0] } }, { isShallow: false });
        const wrapper = setup({ record: { ...publicationTypeListAudio.data[0] } });
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.find('Field').simulate('change', { target: { name: 'rek_display_type', value: '185' } });
        expect(toJson(wrapper)).toMatchSnapshot();

        expect(wrapper.find('WithStyles(ForwardRef(Button))').length).toEqual(2);
        // expect(wrapper.find('#rek-changeDisplayType-submit').props().disabled).toEqual(false);
    });

    it('should have an enabled submit button when user has selected subtype for a work type WITH subtypes', () => {
        // const wrapper = setup({ record: { ...publicationTypeListJournalArticle.data[0] } }, { isShallow: false });
        const wrapper = setup({ record: { ...publicationTypeListJournalArticle.data[0] } });
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper
            .find('Field')
            .simulate('change', { target: { name: 'rek_display_type', value: rekDisplayTypeJournalArticle } });
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper
            .find('Field')
            .simulate('change', { target: { name: 'rek_subtype', value: 'Article (original research)' } });
        expect(toJson(wrapper)).toMatchSnapshot();

        expect(wrapper.find('WithStyles(ForwardRef(Button))').length).toEqual(2);
        // expect(wrapper.find('#rek-changeDisplayType-submit').props().disabled).toEqual(false);
    });

    it('should have an disabled submit button when user has not yet selected subtype for a work type WITH subtypes', () => {
        // const wrapper = setup({ record: { ...publicationTypeListJournalArticle.data[0] } }, { isShallow: false });
        const wrapper = setup({ record: { ...publicationTypeListJournalArticle.data[0] } });
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper
            .find('Field')
            .simulate('change', { target: { name: 'rek_display_type', value: rekDisplayTypeJournalArticle } });
        expect(toJson(wrapper)).toMatchSnapshot();

        expect(wrapper.find('WithStyles(ForwardRef(Button))').length).toEqual(2);
        // expect(wrapper.find('#rek-changeDisplayType-submit').props().disabled).toEqual(true);
    });

    it('should render lightbox upon submit', () => {
        const wrapper = setup({ submitSucceeded: true, newRecord: { rek_pid: 'UQ:12345' } });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('_handleDefaultSubmit()', () => {
        const wrapper = setup({ record: mockRecord });
        const testFn = jest.fn();
        const event = { preventDefault: testFn };

        wrapper.find('form').simulate('submit', event);
        expect(testFn).toHaveBeenCalled();
    });

    it('should display confirmation box after successful submission', () => {
        const wrapper = setup({ record: mockRecord });
        expect(toJson(wrapper)).toMatchSnapshot();

        act(() => {
            wrapper.setProps({ submitSucceeded: true });
            wrapper.update();
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('Change Display Type form - redirections', () => {
    const { location } = window;

    beforeAll(() => {
        delete window.location;
        window.location = { assign: jest.fn(), reload: jest.fn() };
    });

    afterAll(() => {
        window.location = location;
    });

    it('should redirect to view page on form cancel', () => {
        const { location } = window;
        delete window.location;
        window.location = { assign: jest.fn(), reload: jest.fn() };

        const wrapper = setup({});
        wrapper
            .find('#rek-changeDisplayType-cancel')
            .props()
            .onClick();
        expect(window.location.assign).toBeCalledWith(`http://localhost/view/${mockRecord.rek_pid}`);

        window.location = location;
    });

    // it('should redirect to admin edit page on button click', () => {
    //     const testFn = jest.fn();
    //     const record = {
    //         rek_pid: 'UQ:1234567',
    //         rek_display_type: 174,
    //     };
    //     const wrapper = setup({
    //         handleSubmit: testFn,
    //         record,
    //     });
    //     wrapper
    //         .find('#rek-changeDisplayType-submit')
    //         .props()
    //         .onClick();
    //     expect(testFn).toHaveBeenCalledWith(record);
    // });

    it('should fire the correct submit function on button click', () => {
        const mockRecord1 = { ...publicationTypeListAudio.data[0] };
        const testFn = jest.fn();
        const wrapper = setup({
            handleSubmit: testFn,
            disableSubmit: false,
            saveRequesting: false,
            record: mockRecord1,
        });
        expect(wrapper.find('WithStyles(ForwardRef(Button))').length).toEqual(2);
        let submitButton = null;
        wrapper.find('WithStyles(ForwardRef(Button))').forEach(field => {
            if (field.props().children === componentsLocale.components.changeDisplayType.submit) {
                expect(field.props().disabled).toEqual(false);
                submitButton = field;
            }
        });
        (!!submitButton && submitButton.props().onClick()) || false;
        // expect(testFn).toHaveBeenCalledWith(mockRecord1);
    });

    it('should fire the correct cancel function on button click', () => {});
});
