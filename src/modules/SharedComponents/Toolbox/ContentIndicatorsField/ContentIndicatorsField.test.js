import Immutable from 'immutable';
import { ContentIndicatorsField, getSelected, showContentIndicatorsField } from './ContentIndicatorsField';
import { PUBLICATION_TYPE_THESIS } from 'config/general';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps
    };

    return getElement(ContentIndicatorsField, props, isShallow);
}

describe('ContentIndicatorsField component', () => {
    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with given field props', () => {
        const wrapper = setup({
            label: 'Test label',
            placeholder: 'Test placeholder',
            input: {
                value: [
                    454057,
                    454058
                ],
                onChange: jest.fn()
            },
            meta: {
                error: 'Test error'
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.setProps({
            input: {
                value: Immutable.List([454057, 454058])
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not allow deselection of initial values', () => {
        const input = {
            input: {
                value: [454057],
            },
            meta: {
                initial: Immutable.List([454057, 454058])
            }
        };
        const expected = [454057, 454058];
        expect(getSelected(input)).toEqual(expected);
    });

    describe('should detect whether content indicator field should be shown', () => {

        it('when collection is blacklisted', () => {
            const record = {
                fez_record_search_key_ismemberof: [{
                        rek_ismemberof: 'UQ:152694',
                }],
                rek_display_type: '',
            };
            expect(showContentIndicatorsField(record)).toBe(false);
        });

        it('when doctype is blacklisted', () => {
            const record = {
                fez_record_search_key_ismemberof: [],
                rek_display_type: PUBLICATION_TYPE_THESIS,
            };
            expect(showContentIndicatorsField(record)).toBe(false);
        });

    });
});
