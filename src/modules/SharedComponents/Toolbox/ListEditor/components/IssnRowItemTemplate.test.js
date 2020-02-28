import { IssnRowItemTemplate } from './IssnRowItemTemplate';
import React from 'react';

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        item: {},
        ...testProps,
    };
    return getElement(IssnRowItemTemplate, props, args);
}

describe('IssnRowItemTemplate component', () => {
    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render a value', () => {
        const wrapper = setup({
            item: {
                key: '1234-1234',
                value: {
                    ulrichs: {
                        link: 'http://example.com/ulrichs?id=1234',
                        linkText: 'Architectural Journal',
                    },
                    sherpaRomeo: {
                        link: 'http://example.com/sherpa?issn=1234-1234',
                    },
                },
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should skip missing ulrichs or sherparomeo', () => {
        const wrapper = setup({
            item: {
                key: '1235-1235',
                value: {
                    ulrichs: {
                        link: '',
                        linkText: '',
                    },
                    sherpaRomeo: {
                        link: '',
                    },
                },
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should call action to load Sherpa Romeo data', () => {
        const mockUseEffect = jest.spyOn(React, 'useEffect');
        mockUseEffect.mockImplementation(f => f());

        const testFn = jest.fn();
        setup({
            item: '1234-1234',
            actions: {
                getSherpaFromIssn: testFn,
            },
        });
        expect(testFn).toHaveBeenCalledWith('1234-1234');
        testFn.mockClear();

        const wrapper = setup({
            item: {
                key: '2345-2345',
                value: {
                    sherpaRomeo: {},
                },
            },
        });
        expect(wrapper).toMatchSnapshot();

        const testFn2 = jest.fn();
        const mockUseState = jest.spyOn(React, 'useState');
        mockUseState.mockImplementation(initial => [initial, testFn2]);
        const test = {};
        setup({
            item: '3456-3456',
            sherpaRomeo: test,
        });
        expect(testFn2).toHaveBeenCalledWith({
            key: '3456-3456',
            value: {
                sherpaRomeo: test,
            },
        });

        mockUseEffect.mockReset();
        mockUseState.mockReset();
    });
});
