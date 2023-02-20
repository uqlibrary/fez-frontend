import ChangeDisplayType from './ChangeDisplayType';
import { act } from '@testing-library/react';

import publicationTypeListJournalArticle from 'mock/data/records/publicationTypeListJournalArticle';
import publicationTypeListResearchReport from 'mock/data/records/publicationTypeListResearchReport';
import publicationTypeListAudio from 'mock/data/records/publicationTypeListAudio';
import { default as componentsLocale } from 'locale/components';

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
        expect(wrapper.find('[data-testid="change-display-type-page-title"]').text()).toBe(
            `Change display type from ${mockRecord.rek_display_type_lookup} - ${mockRecord.rek_subtype}`,
        );
    });

    it('should render form loaded with submit button disabled', () => {
        const wrapper = setup({ record: mockRecord });
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Field').length).toEqual(1);
    });

    it('should have an enabled submit button when user has selected a work type WITHOUT subtypes', () => {
        const wrapper = setup({ record: { ...publicationTypeListAudio.data[0] } });
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.find('Field').simulate('change', { target: { name: 'rek_display_type', value: '185' } });
        expect(toJson(wrapper)).toMatchSnapshot();

        expect(wrapper.find('ForwardRef(Button)').length).toEqual(2);
    });

    it('should have an enabled submit button when user has selected subtype for a work type WITH subtypes', () => {
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

        expect(wrapper.find('ForwardRef(Button)').length).toEqual(2);
    });

    it('should have an disabled submit button when user has not yet selected subtype for a work type WITH subtypes', () => {
        const wrapper = setup({ record: { ...publicationTypeListJournalArticle.data[0] } });
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper
            .find('Field')
            .simulate('change', { target: { name: 'rek_display_type', value: rekDisplayTypeJournalArticle } });
        expect(toJson(wrapper)).toMatchSnapshot();

        expect(wrapper.find('ForwardRef(Button)').length).toEqual(2);
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
            .find('#rek-change-display-type-cancel')
            .props()
            .onClick();
        expect(window.location.assign).toBeCalledWith(`http://localhost/view/${mockRecord.rek_pid}`);

        window.location = location;
    });

    it('should fire the correct submit function on button click', () => {
        const mockRecord1 = { ...publicationTypeListAudio.data[0] };
        const testFn = jest.fn();
        const wrapper = setup({
            handleSubmit: testFn,
            disableSubmit: false,
            saveRequesting: false,
            record: mockRecord1,
        });
        expect(wrapper.find('ForwardRef(Button)').length).toEqual(2);
        let submitButton = null;
        wrapper.find('ForwardRef(Button)').forEach(field => {
            if (field.props().children === componentsLocale.components.changeDisplayType.submit) {
                expect(field.props().disabled).toEqual(false);
                submitButton = field;
            }
        });
        (!!submitButton && submitButton.props().onClick()) || false;
    });

    it('should fire the correct cancel function on button click', () => {});
});
