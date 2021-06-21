import React from 'react';
import PropTypes from 'prop-types';

import { useJournalDetailsContext } from '../JournalDataContext';

export const JournalDataRenderer = ({ dataConfig, Template: TemplateComponent }) => {
    const { journalDetails } = useJournalDetailsContext();
    const data = React.useRef(null);

    const extractData = () => {
        const dataConfigIterator = dataConfig.entries();

        // eslint-disable-next-line no-unused-vars
        for (const [_, { isArray, index, primaryKey, path, filterFn }] of dataConfigIterator) {
            if (!!isArray) {
                if (index !== undefined) {
                    data.current =
                        !!journalDetails[primaryKey] &&
                        !!journalDetails[primaryKey][index] &&
                        path.reduce((fieldValue, key) => {
                            if (!!fieldValue[key]) {
                                return fieldValue[key];
                            } else {
                                return null;
                            }
                        }, journalDetails[primaryKey][index]);

                    if (!!data.current) return data.current;
                } else {
                    console.log(primaryKey, path);
                    const subKey = path[0];
                    console.log(journalDetails[primaryKey], subKey);
                    data.current =
                        !!journalDetails[primaryKey] &&
                        ((!!filterFn && journalDetails[primaryKey].filter(filterFn).map(item => item[subKey])) ||
                            journalDetails[primaryKey].map(item => item[subKey]));

                    console.log(data.current);
                    if (!!data.current) return data.current;
                }
            } else {
                data.current = path.reduce((fieldValue, key) => {
                    if (!!fieldValue[key]) {
                        return fieldValue[key];
                    } else {
                        return null;
                    }
                }, journalDetails);

                if (!!data.current) return data.current;
            }
        }

        return null;
    };

    return <TemplateComponent data={extractData()} />;
};

JournalDataRenderer.propTypes = {
    dataConfig: PropTypes.array,
    Template: PropTypes.any,
};

export default React.memo(JournalDataRenderer);
