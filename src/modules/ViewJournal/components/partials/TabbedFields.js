import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import TabContainer from 'modules/Admin/components/TabContainer';

import { JournalDetailsContext } from '../JournalDataContext';
import ViewRow from './ViewRow';

const TabbedFields = ({ tabId, tabTitle, tabContent: contentConfig, data }) => {
    const [currentTabValue, setCurrentTabValue] = React.useState('0');
    const handleTabChange = (event, value) => setCurrentTabValue(value);

    return (
        <Grid container style={{ marginTop: 8 }}>
            <Grid item xs={12}>
                <Tabs indicatorColor="primary" onChange={handleTabChange} textColor="primary" value={currentTabValue}>
                    {data.map((tab, index) => (
                        <Tab
                            data-testid={`${tabId}-${index}-heading`}
                            id={`${tabId}-${index}-heading`}
                            key={`${tabId}-${index}`}
                            label={tab[tabTitle]}
                            value={String(index)}
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
                            <JournalDetailsContext.Provider
                                value={{
                                    journalDetails: tab,
                                }}
                            >
                                {contentConfig.rows.map((field, index) => {
                                    return <ViewRow key={`${tabId}-${index}`} fields={field} />;
                                })}
                            </JournalDetailsContext.Provider>
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
};

export default TabbedFields;
