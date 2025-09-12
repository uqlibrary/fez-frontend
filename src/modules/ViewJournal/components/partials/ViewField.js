import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/GridLegacy';
import Typography from '@mui/material/Typography';

import BooleanTemplate from './BooleanTemplate';
import DateTimeTemplate from './DateTimeTemplate';
import DefaultTemplate from './DefaultTemplate';
import LinkTemplate from './LinkTemplate';
import EnclosedLinkTemplate from './EnclosedLinkTemplate';
import MultiLinkTemplate from './MultiLinkTemplate';
import MultiValueTemplate from './MultiValueTemplate';
import WosCategoriesTemplate from './WosCategoriesTemplate';
import { useJournalContext } from 'context';
import CreativeCommonsLicenceTemplate from './CreativeCommonsLicenceTemplate';

export const useData = (dataConfig = [], getData, mergeData, separator) => {
    const { journalDetails } = useJournalContext();
    let fieldData = null;

    if (!!getData) {
        return getData(journalDetails);
    } else {
        const dataConfigIterator = dataConfig.entries();

        // eslint-disable-next-line no-unused-vars
        for (const [_, { isArray, primaryKey, path, filterFn }] of dataConfigIterator) {
            if (!!isArray) {
                const subKey = path[0];
                let data = !!primaryKey && !!journalDetails[primaryKey] && journalDetails[primaryKey];
                data = (!!filterFn && !!data && data.length > 0 && data.filter(filterFn)) || data;
                data = (!!subKey && !!data && data.length > 0 && data.map(item => item[subKey])) || data;

                if (!!data && data.length > 0) {
                    fieldData = data;
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
            return [LinkTemplate, { ...props, format: true }];
        case 'EnclosedLinkTemplate':
            return [EnclosedLinkTemplate, props];
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

export const ViewField = ({ fieldConfig, headerColumnWidth }) => {
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

    if (!!data || !!staticData || template === 'BooleanTemplate') {
        return (
            <Grid
                container
                sx={theme => ({
                    borderBottom: `1px solid ${theme.palette.secondary.light}`,
                    padding: theme.spacing(1),
                    height: '100%',
                })}
            >
                <Grid item xs={12} sm={headerColumnWidth}>
                    <Typography
                        variant="body2"
                        id={`${fieldId}-header`}
                        data-testid={`${fieldId}-header`}
                        sx={{
                            fontWeight: 400,
                        }}
                    >
                        {heading}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={12 - headerColumnWidth}>
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
    headerColumnWidth: PropTypes.number,
};

export default React.memo(ViewField);
