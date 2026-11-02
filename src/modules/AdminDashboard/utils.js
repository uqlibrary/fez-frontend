import ExcelJS from 'exceljs';
import FileSaver from 'file-saver';
import { IS_PRODUCTION, PRODUCTION_URL, STAGING_URL } from 'config/general';

export const stringToColour = string => {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }

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

export const filterObjectPropsByKey = (key, data, propsToKeep) => {
    const obj = { ...data };
    const keepProps = propsToKeep.reduce((keeping, next) => [...keeping, next[key]], []);
    Object.keys(obj).forEach(mykey => {
        if (!keepProps.includes(mykey)) delete obj[mykey];
    });
    return obj;
};

export const exportReportToExcel = async ({ filename, colHeaders, data, sheetLabel = 'sheet' }) => {
    if (!filename || !data) return false;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetLabel);

    !!colHeaders && (worksheet.columns = colHeaders);

    worksheet.addRows(data);

    try {
        // Use a buffer to create the file in memory
        // and then send to the browser for download
        const buffer = await workbook.xlsx.writeBuffer();
        const file = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        FileSaver.saveAs(file, filename);
        return true;
    } catch (error) {
        console.error(`Error writing file ${filename}:`, error);
        return false;
    }
};

export const trimTrailingSlash = text => text.replace(/\/+$/g, '');

export const getPlatformUrl = () => trimTrailingSlash(IS_PRODUCTION ? PRODUCTION_URL : STAGING_URL);

export const getTotalDocCount = items => Object.values(items).reduce((total, item) => total + (item.doc_count || 0), 0);

export const buildChartItem = (id, label, count, total) => {
    const percentage = total ? (count / total) * 100 : 0;
    return {
        id,
        label: `${label} (${percentage.toFixed(1)}%)`,
        value: count,
    };
};

export const transformBucketsToChartData = (buckets, lookup) => {
    const total = getTotalDocCount(buckets);
    return buckets.map(({ key, doc_count: docCount }) =>
        buildChartItem(key, lookup[key] ?? `Unknown (${key})`, docCount, total),
    );
};
