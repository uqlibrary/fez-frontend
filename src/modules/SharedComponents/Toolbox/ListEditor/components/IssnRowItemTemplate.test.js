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
    let mockUseEffect;
    let mockUseState;
    let actionSherpa;
    let actionUlrichs;

    beforeAll(() => {
        actionSherpa = jest.fn();
        actionUlrichs = jest.fn();
    });

    beforeEach(() => {
        mockUseEffect = jest.spyOn(React, 'useEffect');
        mockUseEffect.mockImplementation(f => f());

        const useStateOriginal = React.useState;

        mockUseState = jest.spyOn(React, 'useState');
        mockUseState.mockImplementation(initial => {
            const [issnOriginal, setIssnOriginal] = useStateOriginal(initial);
            const setIssn = jest.fn(newIssn => setIssnOriginal(newIssn));
            return [issnOriginal, setIssn];
        });
    });

    afterEach(() => {
        mockUseEffect.mockRestore();
        mockUseState.mockRestore();
        actionSherpa.mockClear();
        actionUlrichs.mockClear();
    });

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
        setup({
            item: '1234-1234',
            actions: {
                getSherpaFromIssn: actionSherpa,
                getUlrichsFromIssn: actionUlrichs,
            },
        });
        expect(actionSherpa).toHaveBeenCalledWith('1234-1234');
        expect(actionUlrichs).toHaveBeenCalledWith('1234-1234');
    });

    it('should init state as expected', () => {
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
    });

    it('should render link data from API', () => {
        const wrapper = setup({
            item: '1234-1234',
        });
        wrapper.setProps({
            sherpaRomeo: { link: '1234', colour: 'blue' },
            ulrichs: { link: '1234' },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should attempt to get new link data after an edit', () => {
        const wrapper = setup({
            item: {
                key: '1234-1234',
                value: {
                    sherpaRomeo: { link: '1234' },
                    ulrichs: { link: '1234' },
                },
            },
            actions: {
                getSherpaFromIssn: actionSherpa,
                getUlrichsFromIssn: actionUlrichs,
            },
        });
        wrapper.setProps({
            item: {
                key: '1212-1212',
                value: {
                    sherpaRomeo: { link: '1234' },
                    ulrichs: { link: '1234' },
                },
            },
            sherpaRomeo: null,
            ulrichs: null,
        });
        expect(actionSherpa).toHaveBeenCalledWith('1212-1212');
        expect(actionUlrichs).toHaveBeenCalledWith('1212-1212');
    });

    it('should generate styles as expected', () => {
        expect(styles()).toMatchSnapshot();
    });
});
