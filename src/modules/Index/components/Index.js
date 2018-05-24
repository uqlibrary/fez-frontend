import React, {PureComponent} from 'react';

import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {NewsFeed} from 'modules/SharedComponents/NewsFeed';
import {WhatIsEspace} from 'modules/SharedComponents/WhatIsEspace';

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
                        <WhatIsEspace />
                        <NewsFeed />
                    </div>
                </div>
            </StandardPage>
        );
    }
}
export default Index;
