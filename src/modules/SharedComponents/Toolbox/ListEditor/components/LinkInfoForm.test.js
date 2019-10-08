import {
    LinkInfoForm,
    addItemCallbackFactory,
    handleChangeCallbackFactory,
    resetFormCallbackFactory,
} from './LinkInfoForm';

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        locale: {},
        onAdd: jest.fn(),
        ...testProps,
    };

    return getElement(LinkInfoForm, props, args);
}

describe('LinkInfoForm component', () => {
    it('should render the default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with id', () => {
        const wrapper = setup({ locale: { id: '100' } });
        expect(wrapper.find('TextField').get(0).props.id).toBe('100');
        expect(wrapper.find('TextField').get(1).props.id).toBe('100');
    });
});

describe('LinkInfoForm callback factories', () => {
    it('should create handleChange callback', () => {
        const linkAndDescription = { link: 'test link' };
        const setLinkAndDescription = jest.fn();
        const event = {
            target: {
                name: 'description',
                value: 'Test description',
            },
        };
        const callback = handleChangeCallbackFactory(linkAndDescription, setLinkAndDescription)[0];
        callback(event);
        expect(setLinkAndDescription).toHaveBeenCalledWith({
            link: 'test link',
            description: 'Test description',
        });
    });

    it('should create resetForm callback', () => {
        const linkInput = { current: { value: 'test1' } };
        const descriptionInput = { current: { value: 'test2' } };
        const setLinkAndDescription = jest.fn();

        const result = resetFormCallbackFactory(linkInput, descriptionInput, setLinkAndDescription);
        const callback = result[0];
        const updatedLinkInput = result[1][0];
        const updatedDescriptionInput = result[1][1];

        callback();
        expect(setLinkAndDescription).toHaveBeenCalledWith({ key: null, value: null });
        expect(updatedLinkInput).toEqual({ current: { value: null } });
        expect(updatedDescriptionInput).toEqual({ current: { value: null } });
    });

    it('should create addItem callback', () => {
        const testFn = jest.fn();
        const descriptionInput = { current: { focus: testFn } };
        const disabled = false;
        const linkAndDescription = {
            key: 'test1',
            value: 'test2',
        };
        const onAdd = jest.fn();
        const resetForm = jest.fn();

        const callback = addItemCallbackFactory(descriptionInput, disabled, linkAndDescription, onAdd, resetForm)[0];

        callback();
        expect(onAdd).toHaveBeenCalledWith(linkAndDescription);
        expect(resetForm).toHaveBeenCalledTimes(1);
        expect(testFn).toHaveBeenCalledTimes(1);

        testFn.mockClear();
        onAdd.mockClear();
        resetForm.mockClear();
        callback({ key: 'test3' });
        expect(onAdd).toHaveBeenCalledTimes(0);
        expect(resetForm).toHaveBeenCalledTimes(0);
        expect(testFn).toHaveBeenCalledTimes(0);
    });
});
