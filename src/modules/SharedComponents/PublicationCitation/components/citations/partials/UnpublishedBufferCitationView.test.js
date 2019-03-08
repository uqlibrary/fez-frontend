import {UnpublishedBufferCitationView} from './UnpublishedBufferCitationView';

function setup(testProps, isShallow = true) {
    // build full props list required by the component
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return getElement(UnpublishedBufferCitationView, props, isShallow);
}

describe('UnpublishedBufferCitationView test button click sets value', () => {
    it('should render empty component with no date', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should handle handleClick to open', () => {
        const mockEvent = {currentTarget: jest.fn()};
        const wrapper = setup({});

        expect(wrapper.state()).toEqual({anchorEl: null});
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance().handleClick(mockEvent);

        expect(wrapper.state()).toEqual({anchorEl: mockEvent.currentTarget});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should handle handleClose to close', () => {
        const mockEvent = {currentTarget: jest.fn()};
        const wrapper = setup({});

        expect(wrapper.state()).toEqual({anchorEl: null});
        expect(toJson(wrapper)).toMatchSnapshot(); // page loaded

        wrapper.instance().handleClick(mockEvent);
        expect(wrapper.state()).toEqual({anchorEl: mockEvent.currentTarget});
        expect(toJson(wrapper)).toMatchSnapshot(); // they've opened it

        wrapper.instance().handleClose(mockEvent);

        expect(wrapper.state()).toEqual({anchorEl: null});
        expect(toJson(wrapper)).toMatchSnapshot(); // and they have successfully closed it
    });

    it('should load menu correctly', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();

        let menu = wrapper.find('WithStyles(MenuItem)');
        expect(menu.length).toEqual(5);
    });

    it('should handle navigateToUrl', () => {
        const open = jest.fn();
        global.open = open;

        const wrapper = setup({}, true);
        expect(toJson(wrapper)).toMatchSnapshot();

        const menuitem = wrapper.find('WithStyles(MenuItem)').first();
        menuitem.simulate('click');
        expect(open).toHaveBeenCalledTimes(1);
    });
});
