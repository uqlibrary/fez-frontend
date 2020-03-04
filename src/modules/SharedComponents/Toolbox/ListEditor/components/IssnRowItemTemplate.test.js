import { IssnRowItemTemplate, styles } from './IssnRowItemTemplate';
import React from 'react';

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        item: {},
        actions: {
            getSherpaFromIssn: jest.fn(),
            getUlrichsFromIssn: jest.fn(),
        },
        classes: {},
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
                    },
                    sherpaRomeo: {
                        link: 'http://example.com/sherpa?issn=1234-1234',
                        colour: 'blue',
                    },
                },
            },
            classes: {
                romeoColour: 'example',
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
                    },
                    sherpaRomeo: {
                        link: '',
                    },
                },
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should call actions as expected', () => {
        const mockUseEffect = jest.spyOn(React, 'useEffect');
        mockUseEffect.mockImplementation(f => f());

        const actionSherpa = jest.fn();
        const actionUlrichs = jest.fn();
        setup({
            item: '1234-1234',
            actions: {
                getSherpaFromIssn: actionSherpa,
                getUlrichsFromIssn: actionUlrichs,
            },
        });
        expect(actionSherpa).toHaveBeenCalledWith('1234-1234');
        expect(actionUlrichs).toHaveBeenCalledWith('1234-1234');

        mockUseEffect.mockRestore();
    });

    it('should init state as expected', () => {
        const mockUseEffect = jest.spyOn(React, 'useEffect');
        mockUseEffect.mockImplementation(f => f());

        const mockUseState = jest.spyOn(React, 'useState');
        mockUseState.mockImplementation(initial => [initial, jest.fn()]);
        setup({
            item: '2345-2345',
        });
        expect(mockUseState).toHaveBeenCalledWith({
            key: '2345-2345',
            value: {
                sherpaRomeo: {
                    link: '',
                },
                ulrichs: {
                    link: '',
                },
            },
        });

        mockUseEffect.mockRestore();
        mockUseState.mockRestore();
    });

    it('should set state as expected during edits', () => {
        const mockUseEffect = jest.spyOn(React, 'useEffect');
        mockUseEffect.mockImplementation(f => f());

        const useStateOriginal = React.useState;
        const mockUseState = jest.spyOn(React, 'useState');
        mockUseState.mockImplementation(initial => {
            const [issnOriginal, setIssnOriginal] = useStateOriginal(initial);
            const setIssn = jest.fn(newIssn => setIssnOriginal(newIssn));
            return [issnOriginal, setIssn];
        });

        const wrapper = setup({
            item: '1234-1234',
            sherpaRomeo: { link: 'example' },
            ulrichs: { link: 'example' },
        });
        wrapper.setProps({
            item: '1212-1212',
            sherpaRomeo: null,
            ulrichs: null,
        });
        expect(mockUseState).toHaveBeenCalledWith({
            key: '1212-1212',
            value: {
                sherpaRomeo: {
                    link: '',
                },
                ulrichs: {
                    link: '',
                },
            },
        });

        mockUseEffect.mockRestore();
        mockUseState.mockRestore();
    });

    it('should generate styles as expected', () => {
        expect(styles()).toMatchSnapshot();
    });
});
