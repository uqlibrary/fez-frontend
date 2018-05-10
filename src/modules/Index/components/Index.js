import React, {PureComponent} from 'react';

import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {NewsFeed} from 'modules/SharedComponents/NewsFeed';

class Index extends PureComponent {
    render() {
        return (
            <StandardPage className="page-index">
                <div className="columns">
                    <div className="column">
                        <StandardCard title={'Most cited publications/Trending publications'}>
                            <p>
                                publications list...
                            </p>
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
                        <NewsFeed />
                    </div>
                </div>
            </StandardPage>
        );
    }
}
export default Index;
