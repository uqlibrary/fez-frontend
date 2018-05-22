import React, {PureComponent} from 'react';

import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';
import {TopCitedPublications} from 'modules/TopCitedPublications';
import {NewsFeed} from 'modules/SharedComponents/NewsFeed';
import {WhatIsEspace} from 'modules/SharedComponents/WhatIsEspace';

class Index extends PureComponent {
    render() {
        return (
            <StandardPage className="page-index">
                <div className="columns">
                    <div className="column">
                        <TopCitedPublications/>
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
