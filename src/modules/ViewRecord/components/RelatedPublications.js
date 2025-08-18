import React from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/viewRecord';
import { pathConfig } from 'config/pathConfig';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

const RelatedPublications = ({
    publication,
    title = locale.viewRecord.sections.relatedPublications.title,
    parentSearchKey,
    childrenSearchKey = {
        key: 'fez_record_search_key_has_related_datasets',
        pid: 'rek_has_related_datasets',
        title: 'rek_has_related_datasets_lookup',
        order: 'rek_has_related_datasets_order',
    },
    showPublicationTitle = false,
}) => {
    const renderTitle = (item, searchKey) => {
        const pid = item[searchKey.pid];
        return <Link to={pathConfig.records.view(pid)}>{item[searchKey.title]}</Link>;
    };

    const renderSubList = (subList, searchKey) => {
        if (subList && searchKey) {
            const testId = searchKey.pid.replace(/_/g, '-');
            return subList
                .filter(item => item[searchKey.title] && item[searchKey.title].trim().length > 0)
                .sort((item1, item2) => item1[searchKey.order] - item2[searchKey.order])
                .map((item, index) => {
                    return (
                        <li key={`${searchKey.key}-${index}`}>
                            <Typography variant="body2" data-testid={`${testId}-${index}`}>
                                {renderTitle(item, searchKey)}
                            </Typography>
                        </li>
                    );
                });
        } else {
            return null;
        }
    };

    const renderList = (publication, parentSearchKey, childrenSearchKey, showPublicationTitle) => {
        const parents = (parentSearchKey && publication[parentSearchKey.key]) || [];
        const children = publication[childrenSearchKey.key];
        const testId = parentSearchKey && parentSearchKey.pid.replace(/_/g, '-');

        return (
            <Box component={'ul'} sx={{ margin: 0 }} className={'publicationList'}>
                {renderSubList(parents, parentSearchKey)}
                {showPublicationTitle && (
                    <li key={'current'}>
                        <Typography variant="body2" data-testid={`${testId}-current`}>
                            {publication.rek_title}
                            <b>{' (' + locale.viewRecord.sections.relatedPublications.currentRecord + ')'}</b>
                        </Typography>
                    </li>
                )}
                {renderSubList(children, childrenSearchKey)}
            </Box>
        );
    };

    if (
        (!parentSearchKey || !publication[parentSearchKey.key] || publication[parentSearchKey.key].length === 0) &&
        (!publication[childrenSearchKey.key] || publication[childrenSearchKey.key].length === 0)
    ) {
        return null;
    }

    return (
        <Grid xs={12}>
            <StandardCard title={title} className="relatedPublications">
                {renderList(publication, parentSearchKey, childrenSearchKey, showPublicationTitle)}
            </StandardCard>
        </Grid>
    );
};

RelatedPublications.propTypes = {
    publication: PropTypes.object.isRequired,
    title: PropTypes.string,
    parentSearchKey: PropTypes.object,
    childrenSearchKey: PropTypes.object,
    showPublicationTitle: PropTypes.bool,
};

export default RelatedPublications;
