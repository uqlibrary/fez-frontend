import * as actions from './actions';

describe('HelpDrawer actions tests ', () => {
    it('it should create action for open help drawer', () => {
        const payload = {
            title: 'Help',
            text: 'Ask us anything....',
            buttonLabel: 'Close',
        };

        const action = actions.show(payload.title, payload.text, payload.buttonLabel);
        expect(action).toEqual({ type: actions.SHOW, payload });
    });

    it('it should create action for hide help drawer', () => {
        const action = actions.hide();
        expect(action).toEqual({ type: actions.HIDE });
    });
});
