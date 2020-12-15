import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import TabContainer from 'modules/Admin/components/TabContainer';

const titleToId = title =>
    title
        .replace(/[^a-z0-9]/gi, '')
        .toLowerCase()
        .replace(/ /g, '-');

const TabbedCard = ({ cardId, cardTitle, tabs, common, contentRenderer }) => {
    const [currentTabValue, setCurrentTabValue] = React.useState('0');
    const handleTabChange = (event, value) => setCurrentTabValue(value);

    if (!Array.isArray(common) || common.length === 0) {
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
                        value={currentTabValue}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        {tabs.map((tab, index) => (
                            <Tab
                                label={tab.title}
                                key={`${cardId}-tab-${index}-heading`}
                                data-testid={`${cardId}-tab-${index}-heading`}
                                value={`${index}`}
                            />
                        ))}
                    </Tabs>
                    {tabs.map((tab, index) => (
                        <TabContainer
                            value={`${index}`}
                            key={`${cardId}-tab-${index}-content`}
                            tabbed
                            currentTab={currentTabValue}
                        >
                            <StandardCard
                                standardCardId={`${cardId}-${titleToId(tab.title)}-section`}
                                squareTop
                                noHeader
                            >
                                {contentRenderer(tab.content, `${cardId}-tab-${index}`)}
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
