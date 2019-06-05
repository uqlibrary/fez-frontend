import {PublicationCitation, styles} from './PublicationCitation';
import {mockRecordToFix} from 'mock/data/testing/records';

const getProps = (testProps = {}) => ({
    classes: {},
    publication: mockRecordToFix,
    history: {push: jest.fn()},
    actions: {
        setFixRecord: jest.fn(),
        setRecordToView: jest.fn()
    },
    hideLinks: false,
    ...testProps
});

function setup(testProps, isShallow = true){
    return getElement(PublicationCitation, getProps(testProps), isShallow);
}

describe('PublicationCitation ', () => {
    it('should render component with default item', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should have a proper style generator', () => {
        const theme = {
            typography: {
                caption: 'test1',
                body2: {
                    color: 'test2'
                }
            },
            breakpoints: {
                down: jest.fn(() => '@media (max-width:959.95px)')
            }
        };
        expect(styles(theme)).toMatchSnapshot();
    });

    it('should render component with default item without links to title and doi', () => {
        const wrapper = setup({hideLinks: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with default list hiding the difference count', () => {
        const wrapper = setup({hideCountDiff: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with default list hiding the total count', () => {
        const wrapper = setup({hideCountTotal: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with default actions', () => {
        const wrapper = setup({showDefaultActions: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render primary action button', () => {
        const wrapper = setup({});
        expect(wrapper.instance().renderActions([])).toBe(null);
        expect(wrapper.instance().renderActions([{
            primary: true
        }])).toMatchSnapshot();
    });

    it('should render component with custom actions', () => {
        const customActions = [
            {
                label: 'Claim now',
                handleAction: jest.fn()
            },
            {
                label: 'Not mine',
                handleAction: jest.fn()
            },
            {
                label: 'View stats',
                handleAction: jest.fn()
            }
        ];
        const wrapper = setup({
            showDefaultActions: false,
            customActions: customActions
        });

        wrapper.find('WithStyles(Button).publicationAction').forEach((button, index) => {
            expect(
                button.getElement().props.children
            ).toBe(
                customActions[index].label
            );
            button.getElement().props.onClick();
            expect(customActions[index].handleAction).toBeCalled();
        });

    });

    it('should render component with publication from multiple sources', () => {
        const publicationWithSources = {...mockRecordToFix, "sources": [{source: "espace", id: "UQ:224457"}]};
        const wrapper = setup({publication: publicationWithSources, showSources: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component without a title', () => {
        const publicationWithSources = {...mockRecordToFix, "sources": [{source: "espace", id: "UQ:224457"}]};
        const wrapper = setup({publication: publicationWithSources, showSources: true, hideTitle: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should handle default actions', () => {
        const wrapper = setup({
            showDefaultActions: true
        });
        const test = jest.spyOn(wrapper.instance(), '_handleDefaultActions');
        wrapper.find('WithStyles(Button).publicationAction').forEach((button, index) => {
            expect(
                button.getElement().props.children
            ).toBe(
                wrapper.instance().defaultActions[index].label
            );

            const actionKey = wrapper.instance().defaultActions[index].key;
            button.getElement().props.onClick();
            expect(test).toBeCalledWith(actionKey);

            switch (actionKey) {
                case 'fixRecord':
                    expect(wrapper.instance().props.history.push).toHaveBeenCalled();
                    break;

                case 'shareRecord':
                    // TODO
                    console.log('Test missing');
                    break;

                    case 'NAN':
                    // TODO
                    console.log('Test missing');
                    break;

                default:
                    console.log('Unsupported default action');
                    break;
            }
        });
        wrapper.instance()._handleDefaultActions('shareRecord');
        wrapper.instance()._handleDefaultActions('');
    });

    it('should render publication with citation metric', () => {
        const publicationWithMetricData = {
            ...mockRecordToFix,
            metricData: {
                count: 23,
                difference: 5,
                citation_url: 'http://www.test.com',
                source: 'altmetric'
            }
        };
        const wrapper = setup({
            publication: publicationWithMetricData,
            showMetrics: true,
            showSourceCountIcon: true
        });
        expect(toJson(wrapper.find('.citationMetrics WithStyles(ExternalLink)'))).toMatchSnapshot();

        // Display count without icon
        wrapper.setProps({
            showSourceCountIcon: false
        });
        expect(toJson(wrapper.find('.citationMetrics WithStyles(Typography).count'))).toMatchSnapshot();
    });

    it('should render publication with unpublished buffer', () => {
        const wrapper = setup({publication: mockRecordToFix, showUnpublishedBufferFields: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should return message indicating unavailability of citation display', () => {
        const wrapper = setup({});
        expect(wrapper.instance().renderCitation(null)).toMatchSnapshot();
    });

});
