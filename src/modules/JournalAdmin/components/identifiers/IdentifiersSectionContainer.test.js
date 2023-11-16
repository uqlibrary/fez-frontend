import IdentifiersSectionContainer from './IdentifiersSectionContainer';
import Immutable from 'immutable';

jest.mock('../../../../context');
import { useRecordContext } from 'context';

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        ...testProps,
    };

    return renderComponent(IdentifiersSectionContainer, props, args);
}

describe('IdentifiersSectionContainer component', () => {
    it('should render default view', () => {
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456',
                rek_object_type_lookup: 'Record',
                fez_record_search_key_ismemberof: [
                    {
                        rek_ismemberof: 'Test collection',
                        parent: {
                            rek_security_policy: 2,
                            rek_datastream_policy: 1,
                        },
                    },
                ],
                rek_display_type: 179,
            },
        }));

        const render = setup(
            {},
            { isShallow: true, requiresStore: true, store: global.setupStoreForMount(Immutable.Map({})).store },
        );
        expect(render.getRenderOutput()).toMatchSnapshot();
    });
});
