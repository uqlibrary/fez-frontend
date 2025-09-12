import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/GridLegacy';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import TabContainer from 'modules/Admin/components/TabContainer';

export const titleToId = (title = '') =>
    `${title}`
        .replace(/[^a-z0-9 ]/gi, '')
        .toLowerCase()
        .replace(/ /g, '-');

export const hasContent = (common, tabs) =>
    (Array.isArray(common) && common.length > 0) || (Array.isArray(tabs) && tabs.length > 0);

const TabbedCard = ({ cardId, cardTitle, common, contentRenderer, tabs }) => {
    const [currentTabValue, setCurrentTabValue] = React.useState('0');
    const handleTabChange = (event, value) => setCurrentTabValue(value);

    if (!hasContent(common, tabs)) {
        return '';
    }

    return (
        <StandardCard standardCardId={cardId} title={cardTitle} key={cardId}>
            <Grid container spacing={2}>
                {common && (
                    <Grid item xs={12}>
                        {contentRenderer(common, cardId)}
                    </Grid>
                )}
                <Grid item xs={12}>
                    <Tabs
                        indicatorColor="primary"
                        onChange={handleTabChange}
                        textColor="primary"
                        value={currentTabValue}
                    >
                        {tabs.map((tab, index) => (
                            <Tab
                                data-testid={`${cardId}-tab${index}-heading`}
                                id={`${cardId}-tab${index}-heading`}
                                key={`${cardId}-tab${index}-heading`}
                                label={tab.title}
                                value={`${index}`}
                            />
                        ))}
                    </Tabs>
                    {tabs.map((tab, index) => (
                        <TabContainer
                            currentTab={currentTabValue}
                            key={`${cardId}-tab${index}-content`}
                            tabbed
                            value={`${index}`}
                        >
                            <StandardCard
                                noHeader
                                squareTop
                                standardCardId={`${cardId}-${titleToId(tab.title)}-section`}
                            >
                                {contentRenderer(tab.content, `${cardId}-tab${index}`)}
                            </StandardCard>
                        </TabContainer>
                    ))}
                </Grid>
            </Grid>
        </StandardCard>
    );
};

TabbedCard.propTypes = {
    cardId: PropTypes.string,
    cardTitle: PropTypes.string,
    common: PropTypes.array,
    contentRenderer: PropTypes.func,
    tabs: PropTypes.array,
};

export default TabbedCard;
