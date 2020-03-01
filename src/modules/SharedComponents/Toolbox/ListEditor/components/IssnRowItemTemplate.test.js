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

    it('should trigger React hooks as expected', () => {
        const mockUseEffect = jest.spyOn(React, 'useEffect');
        mockUseEffect.mockImplementation(f => f());

        const action = jest.fn();
        setup({
            item: '1234-1234',
            actions: {
                getSherpaFromIssn: action,
            },
        });
        expect(action).toHaveBeenCalledWith('1234-1234');

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

        mockUseEffect.mockRestore();
        mockUseState.mockRestore();
    });

    it('should update internal state during edits', () => {
        const mockUseEffect = jest.spyOn(React, 'useEffect');
        mockUseEffect.mockImplementation(f => f());

        let setIssn;
        const action = jest.fn();
        const useStateOriginal = React.useState;
        const mockUseState = jest.spyOn(React, 'useState');
        mockUseState.mockImplementation(initial => {
            const [issnOriginal, setIssnOriginal] = useStateOriginal(initial);
            setIssn = jest.fn(newIssn => setIssnOriginal(newIssn));
            return [issnOriginal, setIssn];
        });
        const wrapper = setup({
            item: '3456-3456',
            sherpaRomeo: { issn: '3456-3456' },
            actions: {
                getSherpaFromIssn: action,
            },
        });
        setIssn.mockClear();
        wrapper.setProps({
            item: '1212-1212',
            sherpaRomeo: null,
        });
        expect(action).toHaveBeenCalledWith('1212-1212');

        mockUseEffect.mockRestore();
        mockUseState.mockRestore();
    });
});
