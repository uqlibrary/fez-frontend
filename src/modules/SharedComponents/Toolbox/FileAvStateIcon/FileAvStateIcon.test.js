import React from 'react';
import FileAvStateIcon, { getTestId, UTCDateToCurrentTZDate } from './FileAvStateIcon';
import { assertTooltipText, render } from 'test-utils';
import { locale } from 'locale';
import { AV_CHECK_STATE_CLEAN, AV_CHECK_STATE_INFECTED, AV_CHECK_STATE_UNSCANNABLE } from 'config/general';
import moment from 'moment-timezone';

const txt = locale.components.fileAvStateIcon;
const checkedAt = '2000-01-01 00:00:00';
const localTzDate = '2000-01-01 10:00:00';
const localTzDateFormatted = moment(localTzDate).format('lll');
moment.tz.setDefault('Australia/Brisbane');

const id = 'UQ:107683-AL-IN-01.tif';
function setup(props = {}) {
    return render(<FileAvStateIcon id={id} {...props} />);
}

describe('FileAvStateIcon component', () => {
    it('UTCDateToCurrentTZDate', () => {
        expect(UTCDateToCurrentTZDate(checkedAt)).toEqual(localTzDateFormatted);
    });

    it('default', () => {
        const { getByTestId } = setup();
        assertTooltipText(getByTestId(getTestId(undefined, id)), txt.description.map.default());
    });

    it('clean', () => {
        const state = AV_CHECK_STATE_CLEAN;
        const { getByTestId } = setup({ state, checkedAt });
        assertTooltipText(getByTestId(getTestId(state, id)), txt.description.map[state](localTzDateFormatted));
    });

    it('infected', () => {
        const state = AV_CHECK_STATE_INFECTED;
        const { getByTestId } = setup({ state, checkedAt });
        assertTooltipText(getByTestId(getTestId(state, id)), txt.description.map[state](localTzDateFormatted));
    });

    it('unscannable', () => {
        const state = AV_CHECK_STATE_UNSCANNABLE;
        const { getByTestId } = setup({ state, checkedAt });
        assertTooltipText(getByTestId(getTestId(state, id)), txt.description.map[state](localTzDateFormatted));
    });
});
