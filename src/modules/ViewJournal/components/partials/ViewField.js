import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import BooleanTemplate from './BooleanTemplate';
import DateTimeTemplate from './DateTimeTemplate';
import DefaultTemplate from './DefaultTemplate';
import LinkTemplate from './LinkTemplate';
import MultiLinkTemplate from './MultiLinkTemplate';
import MultiValueTemplate from './MultiValueTemplate';
import WosCategoriesTemplate from './WosCategoriesTemplate';
import { useJournalDetailsContext } from '../JournalDataContext';
import CreativeCommonsLicenceTemplate from './CreativeCommonsLicenceTemplate';

export const useData = (dataConfig = [], getData, mergeData, separator) => {
    const { journalDetails } = useJournalDetailsContext();

    let fieldData = null;

    if (!!getData) {
        return getData(journalDetails);
    } else {
        const dataConfigIterator = dataConfig.entries();

        // eslint-disable-next-line no-unused-vars
        for (const [_, { isArray, index, primaryKey, path, filterFn }] of dataConfigIterator) {
            if (!!isArray) {
                if (index !== undefined) {
                    const data =
                        !!journalDetails[primaryKey] &&
                        !!journalDetails[primaryKey][index] &&
                        path.reduce((fieldValue, key) => {
                            if (!!fieldValue && !!fieldValue[key]) {
                                return fieldValue[key];
                            } else {
                                return null;
                            }
                        }, journalDetails[primaryKey][index]);

                    if (!!data) {
                        (!!mergeData && (fieldData = [fieldData, data].filter(Boolean))) || (fieldData = data);
                        !!separator && (fieldData = fieldData.join(separator));
                    }
                } else {
                    const subKey = path[0];
                    const data =
                        !!journalDetails[primaryKey] &&
                        ((!!filterFn && journalDetails[primaryKey].filter(filterFn).map(item => item[subKey])) ||
                            journalDetails[primaryKey].map(item => item[subKey]));

                    if (!!data && data.length > 0) {
                        fieldData = data;
                    }
                }
            } else {
                const data = path.reduce((fieldValue, key) => {
                    if (!!fieldValue && !!fieldValue[key]) {
                        return fieldValue[key];
                    } else {
                        return null;
                    }
                }, journalDetails);

                if (!!data) {
                    (!!mergeData && (fieldData = [fieldData, data].filter(Boolean))) || (fieldData = data);
                    !!separator && (fieldData = fieldData.join(separator));
                }
            }
        }

        return fieldData;
    }
};

export const useTemplate = (template, props) => {
    switch (template) {
        case 'LinkTemplate':
            return [LinkTemplate, props];
        case 'MultiValueTemplate':
            return [MultiValueTemplate, props];
        case 'MultiLinkTemplate':
            return [MultiLinkTemplate, props];
        case 'BooleanTemplate':
            return [BooleanTemplate, {}];
        case 'CreativeCommonsLicenceTemplate':
            return [CreativeCommonsLicenceTemplate, {}];
        case 'DateTimeTemplate':
            return [DateTimeTemplate, props];
        case 'WosCategoriesTemplate':
            return [WosCategoriesTemplate, props];
        default:
            return [DefaultTemplate, props];
    }
};

const useStyles = makeStyles(theme => ({
    gridRow: {
        borderBottom: `1px solid ${theme.palette.secondary.light}`,
        padding: theme.spacing(1),
    },
}));

export const ViewField = ({ fieldConfig }) => {
    const classes = useStyles();
    const {
        fieldId,
        heading,
        data: dataConfig,
        getData,
        template,
        templateProps: props,
        mergeData,
        separator,
        staticData,
    } = fieldConfig;
    const data = useData(dataConfig, getData, mergeData, separator);
    const [TemplateComponent, templateProps] = useTemplate(template, props);

    if (!!data || !!staticData) {
        return (
            <Grid container className={classes.gridRow}>
                <Grid item xs={12} sm={3}>
                    <Typography variant="body2" id={`${fieldId}-header`} data-testid={`${fieldId}-header`}>
                        {heading}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={9}>
                    <TemplateComponent data={data} templateProps={templateProps} fieldId={fieldId} />
                </Grid>
            </Grid>
        );
    } else {
        return null;
    }
};

ViewField.propTypes = {
    fieldConfig: PropTypes.object,
};

export default React.memo(ViewField);
