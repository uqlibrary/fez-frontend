import * as XLSX from 'xlsx';
import { IS_PRODUCTION, PRODUCTION_URL, STAGING_URL } from 'config/general';

export const stringToColour = string => {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
};

export const abbreviateNumber = (number, decPlaces) => {
    const abbrev = ['k', 'm', 'b', 't'];
    const _decPlaces = Math.pow(10, decPlaces);

    let _number = number;

    for (let i = abbrev.length - 1; i >= 0; i--) {
        const size = Math.pow(10, (i + 1) * 3);

        if (size <= _number) {
            _number = Math.round((_number * _decPlaces) / size) / _decPlaces;
            _number += abbrev[i];
            break;
        }
    }

    return `${_number}`;
};

export const arrayMove = (data, fromIndex, toIndex) => {
    const oldIndex = fromIndex < 0 ? 0 : fromIndex;
    const newIndex = toIndex > data.length - 1 ? data.length - 1 : toIndex;

    const arr = [...data];

    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);

    return arr;
};

export const reorderArray = (data, fromIndex, toIndex) => {
    const arr = arrayMove(data, fromIndex, toIndex);
    arr.forEach((item, index) => (item.qlk_order = index));
    return arr;
};

export const filterObjectProps = (data, propsToKeep) => {
    const obj = structuredClone(data);
    Object.keys(obj).forEach(key => {
        if (!propsToKeep.includes(key)) delete obj[key];
    });
    return obj;
};

export const exportReportToExcel = ({ filename, sheetLabel, colHeaders, data }) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    !!colHeaders &&
        XLSX.utils.sheet_add_aoa(worksheet, [colHeaders], {
            origin: 'A1',
        });
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetLabel);

    XLSX.writeFileXLSX(workbook, filename);

    return true;
};

export const isEmptyStr = str =>
    str === null || str === undefined || (typeof str === 'string' && !!!str.trim()) || typeof str !== 'string';

export const trimTrailingSlash = text => text.replace(/\/+$/g, '');

export const getPlatformUrl = () => trimTrailingSlash(IS_PRODUCTION ? PRODUCTION_URL : STAGING_URL);
