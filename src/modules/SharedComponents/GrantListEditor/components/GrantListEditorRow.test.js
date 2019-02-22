import {GrantListEditorRow} from './GrantListEditorRow';
import GrantListEditorRowWithStyles from './GrantListEditorRow';

function setup(testProps, isShallow = true){
    const props = {
        index: 0,
        grant: {},
        canMoveUp: false,
        canMoveDown: false,
        onMoveUp: jest.fn(),
        onMoveDown: jest.fn(),
        onDelete: jest.fn(),
        locale: {},
        disabled: false,
        classes: {},
        width: 'md',
        ...testProps,
    };
    return getElement(GrantListEditorRow, props, isShallow);
}

describe('GrantListEditorRow', () => {
    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render default mobile view', () => {
        const wrapper = setup({width: 'xs'});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render given locale', () => {
        const wrapper = setup({
            locale: {
                deleteRecordConfirmation: {},
                moveUpHint: 'Move up',
                moveDownHint: 'Move down',
                deleteHint: 'Delete hint',
                selectHint: 'Select hint [name]'
            },
            grant: {
                nameAsPublished: 'testing'
            },
            classes: {
                selected: 'selected-grant'
            }
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render given grant data', () => {
        const wrapper = setup({
            locale: {
                deleteRecordConfirmation: {},
                moveUpHint: 'Move up',
                moveDownHint: 'Move down',
                deleteHint: 'Delete hint',
                selectHint: 'Select hint [name]'
            },
            grant: {
                grantAgencyName: 'testing',
                grantId: '1234',
                grantAgencyType: '453985',
                selected: true
            },
            classes: {
                selected: 'selected-grant'
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render default view with styles', () => {
        const wrapper = getElement(GrantListEditorRowWithStyles, {});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should set confirmation box ref', () => {
        const wrapper = setup({});
        wrapper.instance().handleConfirmationBoxRef('test');
        expect(wrapper.instance().confirmationBox).toEqual('test');
    });

    it('should show confirmation box', () => {
        const showConfirmationFn = jest.fn();
        const wrapper = setup({});
        wrapper.instance().confirmationBox = {
            showConfirmation: showConfirmationFn
        };

        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.find('WithStyles(IconButton)').get(2).props.onClick();
        expect(showConfirmationFn).toHaveBeenCalled();
    });

    it('should delete grant', () => {
        const onDeleteFn = jest.fn();
        const wrapper = setup({onDelete: onDeleteFn});
        wrapper.instance()._deleteRecord();
        expect(onDeleteFn).toHaveBeenCalled();
    });

    it('should move grant up', () => {
        const onMoveUpFn = jest.fn();
        const wrapper = setup({onMoveUp: onMoveUpFn});
        wrapper.find('WithStyles(IconButton)').get(0).props.onClick();
        expect(onMoveUpFn).toHaveBeenCalled();
    });

    it('should move grant down', () => {
        const onMoveDownFn = jest.fn();
        const wrapper = setup({onMoveDown: onMoveDownFn});
        wrapper.find('WithStyles(IconButton)').get(1).props.onClick();
        expect(onMoveDownFn).toHaveBeenCalled();
    });
});
