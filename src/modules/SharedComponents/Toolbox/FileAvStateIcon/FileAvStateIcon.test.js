import React from 'react';
import FileAvStateIcon, { getTestId, UTCDateToCurrentTZDate } from './FileAvStateIcon';
import { render } from 'test-utils';
import { locale } from '../../../../locale';
import { AV_CHECK_STATE_CLEAN, AV_CHECK_STATE_INFECTED, AV_CHECK_STATE_UNSCANNABLE } from '../../../../config/general';
import moment from 'moment';

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
        const { getByTitle, getByTestId } = setup();
        expect(getByTitle(txt.description.map.default())).toBeInTheDocument();
        expect(getByTestId(getTestId(undefined, id))).toBeInTheDocument();
    });

    it('clean', () => {
        const state = AV_CHECK_STATE_CLEAN;
        const { getByTitle, getByTestId } = setup({ state, checkedAt });
        expect(getByTitle(txt.description.map[state](localTzDateFormatted))).toBeInTheDocument();
        expect(getByTestId(getTestId(state, id))).toBeInTheDocument();
    });

    it('infected', () => {
        const state = AV_CHECK_STATE_INFECTED;
        const { getByTitle, getByTestId } = setup({ state, checkedAt });
        expect(getByTitle(txt.description.map[state](localTzDateFormatted))).toBeInTheDocument();
        expect(getByTestId(getTestId(state, id))).toBeInTheDocument();
    });

    it('unscannable', () => {
        const state = AV_CHECK_STATE_UNSCANNABLE;
        const { getByTitle, getByTestId } = setup({ state, checkedAt });
        expect(getByTitle(txt.description.map[state]())).toBeInTheDocument();
        expect(getByTestId(getTestId(state, id))).toBeInTheDocument();
    });
});
