import * as actions from 'actions/actionTypes';
import {locale} from 'locale';
import XLSX from 'xlsx';

export const excel = (publicationsList) => {
    const rows = [];
    // get the mapping for excel .ie 'PID': 'rek_pid'
    const mapping = locale.components.export.mapping.excel;
    // add the columns first
    const columns = Object.keys(mapping);
    rows.push(columns);

    publicationsList.forEach(record => {
        const row = [];

        columns.forEach(key => {
            const mappedField = mapping[key];
            let value = null;

            // sort out relation mapping .ie 'Author': {'fez_record_search_key_author.rek_author': '|'},
            if (typeof mappedField === 'object') {
                const relationPath = Object.keys(mappedField).pop();
                const [relationName, relationField] = relationPath.split('.');

                if (relationName in record) {
                    const relation = record[relationName];

                    // 1-1 relation
                    if (relationField in relation) {
                        value = relation[relationField];
                        // 1-m relation
                    } else if (Array.isArray(relation)) {
                        const separator = mappedField[relationPath];
                        // pluck the relation value and combine them using the given separator
                        value = relation.map(value => value[relationField]).join(separator);
                    }
                }
                // otherwise value retrieved from the record level
            } else if (mappedField in record) {
                value = record[mappedField];
            }

            row.push(value);
        });

        if (row.length) {
            rows.push(row);
        }
    });

    if (rows.length > 1) {
        const ws = XLSX.utils.aoa_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        // console.log(ws);
        XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
        /* generate XLSX file and send to client */
        XLSX.writeFile(wb, 'export.xls');
    }
};

const exportPublication = () => next => action => {
    if (
        !!action.payload &&
        action.type === actions.AUTHOR_PUBLICATIONS_EXPORT
    ) {
        switch (action.format) {
            case 'excel':
                excel(action.payload);
                break;
            default:
        }
    }

    return next(action);
};

export default exportPublication;
