import React, {PureComponent} from 'react';

import {locale} from 'locale';
import {Tabs, Tab} from 'material-ui/Tabs';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';
import {TopCitedPublications} from 'modules/TopCitedPublications';

class Index extends PureComponent {
    render() {
        return (
            <StandardPage className="page-index">
                <StandardCard title={'eSpace search'}>
                    <p>
                        eSpace search goes here... or on app tool bar?
                    </p>
                </StandardCard>
                <div className="columns">
                    <div className="column">
                        <StandardCard className="card-paddingless">
                            <Tabs className="publicationTabs" inkBarStyle={{height: '4px', marginTop: '-4px'}}>
                                {
                                    <Tab label={locale.components.topCitedPublications.altmetric.title} value="trendingPublications" className="publicationTabs">
                                        <div className="publicationTabContent">
                                            <TopCitedPublications/>
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
                        <StandardCard title={'What is eSpace?'}>
                            <p>
                                UQ eSpace is the single authoritative source for
                                the research outputs and research data of the
                                staff and students of the University of
                                Queensland and is the archival home of UQ
                                Higher Degree by Research digital theses. UQ
                                eSpace raises the visibility and accessibility of
                                UQ publications to the wider world and provides
                                data for mandatory Government reporting
                                requirements... <a href="#">read more</a>
                            </p>
                        </StandardCard>
                        <StandardCard title={'Latest news'}>
                            <p>
                                <b>21 May 2018</b> Launch of new eSpace application. Sed ornare
                                suscipit lobortis. Suspendisse scelerisque
                                tempus risus quis vulputate. Donec eleifend
                                mi euismod, tincidunt lacus vel, accumsan
                                neque. Nulla diam lectus, interdum sed
                                varius sit amet, condimentum laoreet eros.
                                Nulla auctor at lectus ut euismod.
                                <a href="#">read more</a>
                            </p>
                            <p>
                                <b>20 May 2018</b> The end of the world is near
                                suscipit lobortis. Suspendisse scelerisque
                                tempus risus quis vulputate. Donec eleifend
                                mi euismod, tincidunt lacus vel, accumsan
                                neque. Nulla diam lectus, interdum sed
                                varius sit amet, condimentum laoreet eros.
                                Nulla auctor at lectus ut euismod.
                                <a href="#">read more</a>
                            </p>
                        </StandardCard>
                    </div>
                </div>
            </StandardPage>
        );
    }
}
export default Index;
