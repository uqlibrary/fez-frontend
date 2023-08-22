import React from 'react';
import InheritedSecurityDetails from './InheritedSecurityDetails';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        collections: [],
        title: 'Inherited security policy details',
        ...testProps,
    };

    return rtlRender(<InheritedSecurityDetails {...props} />);
}

describe('InheritedSecurityDetails component', () => {
    it('should render properly', () => {
        const { container } = setup({
            title: 'Inherited security policy details',
            parentKey: 'rek_security_policy',
        });
        expect(container).toMatchSnapshot();
    });

    it('should render collections correctly', () => {
        const { container } = setup({
            collections: [
                {
                    parent: {
                        rek_pid: 'UQ:11111',
                        rek_security_policy: 2,
                    },
                    rek_ismemberof: 'UQ:11111',
                    rek_ismemberof_lookup: 'Test collection',
                },
                {
                    parent: {
                        rek_pid: 'UQ:22222',
                        rek_security_policy: 4,
                    },
                    rek_ismemberof: 'UQ:22222',
                    rek_ismemberof_lookup: 'Another test collection',
                },
            ],
            title: 'Inherited security policy details',
            parentKey: 'rek_security_policy',
        });
        expect(container).toMatchSnapshot();
    });

    it('should render collections for datastreams correctly', () => {
        const { container } = setup({
            collections: [
                {
                    parent: {
                        rek_pid: 'UQ:11111',
                        rek_datastream_policy: 2,
                    },
                    rek_ismemberof: 'UQ:11111',
                    rek_ismemberof_lookup: 'Test collection',
                },
                {
                    parent: {
                        rek_pid: 'UQ:22222',
                        rek_datastream_policy: 4,
                    },
                    rek_ismemberof: 'UQ:22222',
                    rek_ismemberof_lookup: 'Another test collection',
                },
            ],
            title: 'Inherited datastream security policy details',
            parentKey: 'rek_datastream_policy',
        });
        expect(container).toMatchSnapshot();
    });

    it('should render collections for record correctly with empty policy description', () => {
        const { container } = setup({
            collections: [
                {
                    rek_ismemberof: 'UQ:11111',
                    rek_ismemberof_lookup: 'Test collection',
                },
                {
                    rek_ismemberof: 'UQ:22222',
                    rek_ismemberof_lookup: 'Another test collection',
                },
            ],
            title: 'Inherited security policy details',
            parentKey: 'rek_security_policy',
        });
        expect(container).toMatchSnapshot();
    });

    it('should render collections for datastreams correctly with empty policy description', () => {
        const { container } = setup({
            collections: [
                {
                    rek_ismemberof: 'UQ:11111',
                    rek_ismemberof_lookup: 'Test collection',
                },
                {
                    rek_ismemberof: 'UQ:22222',
                    rek_ismemberof_lookup: 'Another test collection',
                },
            ],
            title: 'Inherited datastream security policy details',
            parentKey: 'rek_datastream_policy',
        });
        expect(container).toMatchSnapshot();
    });
});
