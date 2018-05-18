import React, {PureComponent} from 'react';

import {locale} from 'locale';
import {Tabs, Tab} from 'material-ui/Tabs';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';
import {TopCitedPublications} from 'modules/TopCitedPublications';
import {TopAltmetricCitedPublications} from 'modules/TopAltmetricCitedPublications';
import {NewsFeed} from 'modules/SharedComponents/NewsFeed';
import {WhatIsEspace} from 'modules/SharedComponents/WhatIsEspace';

class Index extends PureComponent {
    render() {
        return (
            <StandardPage className="page-index">
                <div className="columns">
                    <div className="column">
                        <StandardCard className="card-paddingless">
                            <Tabs className="publicationTabs" inkBarStyle={{height: '4px', marginTop: '-4px'}}>
                                {
                                    <Tab label={locale.components.topCitedPublications.altmetric.title} value="topAltmetricCitedPublications" className="publicationTabs">
                                        <div className="publicationTabContent">
                                            <TopAltmetricCitedPublications/>
                                        </div>
                                    </Tab>
                                }
                                {
                                    <Tab label={locale.components.topCitedPublications.scopus.title} value="topScopusCitedPublications" className="publicationTabs">
                                        <div className="publicationTabContent">
                                            <TopCitedPublications source={'scopus'}/>
                                        </div>
                                    </Tab>
                                }
                                {
                                    <Tab label={locale.components.topCitedPublications.thomson.title} value="topThomsonCitedPublications" className="publicationTabs">
                                        <div className="publicationTabContent">
                                            <TopCitedPublications source={'thomson'}/>
                                        </div>
                                    </Tab>
                                }
                            </Tabs>
                        </StandardCard>
                    </div>
                    <div className="column is-4">
                        <WhatIsEspace />
                        <NewsFeed />
                    </div>
                </div>
            </StandardPage>
        );
    }
}
export default Index;
