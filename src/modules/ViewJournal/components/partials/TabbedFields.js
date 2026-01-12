import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/GridLegacy';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import TabContainer from 'modules/Admin/components/TabContainer';

import { JournalContext } from 'context';
import ViewRow from './ViewRow';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Typography from '@mui/material/Typography';

const TabbedFields = ({ tabId, tabTitle, tabContent: contentConfig, data, title }) => {
    const theme = useTheme();
    const isXsDown = useMediaQuery(theme.breakpoints.down('sm'));
    const isSmDown = useMediaQuery(theme.breakpoints.down('md'));
    const [currentTabValue, setCurrentTabValue] = React.useState('0');
    const handleTabChange = (event, value) => setCurrentTabValue(value);
    const multipleData = data.length > 1;
    const tabStyle = isSmDown && {
        // eslint-disable-next-line no-nested-ternary
        maxWidth: multipleData ? 'calc((100vw - 68px) * 0.67)' : isXsDown ? '100%' : '50%',
        width: '100%',
    };
    return (
        <Grid container style={{ marginBottom: 20 }}>
            {title && (
                <Grid item xs={12} style={{ marginTop: 20 }}>
                    <Typography
                        variant="subtitle1"
                        id={`${tabId}-header`}
                        data-testid={`${tabId}-header`}
                        sx={{ fontWeight: 400 }}
                    >
                        {title}
                    </Typography>
                </Grid>
            )}
            <Grid item xs={12}>
                <Tabs
                    indicatorColor="primary"
                    onChange={handleTabChange}
                    textColor="primary"
                    value={currentTabValue}
                    scrollButtons={data.length > 1 ? 'auto' : false}
                    variant={data.length > 1 ? 'scrollable' : 'standard'}
                    aria-label={`Navigate details for ${title}`}
                >
                    {data.map((tab, index) => (
                        <Tab
                            data-testid={`${tabId}-${index}-heading`}
                            id={`${tabId}-${index}-heading`}
                            key={`${tabId}-${index}`}
                            label={tab[tabTitle]}
                            value={String(index)}
                            style={{ ...tabStyle }}
                        />
                    ))}
                </Tabs>
                {data.map((tab, index) => (
                    <TabContainer
                        currentTab={currentTabValue}
                        key={`${tabId}-${index}-content`}
                        tabbed
                        value={String(index)}
                    >
                        <StandardCard noHeader>
                            <JournalContext.Provider
                                value={{
                                    journalDetails: tab,
                                }}
                            >
                                {contentConfig.rows.map((field, index) => {
                                    return (
                                        <ViewRow
                                            viewRowId={`${tabId}-view-row-${index}`}
                                            key={`${tabId}-${index}`}
                                            fields={field}
                                        />
                                    );
                                })}
                            </JournalContext.Provider>
                        </StandardCard>
                    </TabContainer>
                ))}
            </Grid>
        </Grid>
    );
};

TabbedFields.propTypes = {
    data: PropTypes.array,
    rows: PropTypes.array,
    tabContent: PropTypes.object,
    tabId: PropTypes.string,
    tabTitle: PropTypes.string,
    tabs: PropTypes.array,
    title: PropTypes.string,
};

export default TabbedFields;
