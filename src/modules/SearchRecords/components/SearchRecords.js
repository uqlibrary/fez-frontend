import React, {PureComponent} from 'react';

import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';

class SearchRecords extends PureComponent {
    render() {
        return (
            <StandardPage className="page-search-records" title={'Search results'}>
                <StandardCard>
                    <p>
                        XXXXX Total results found...
                    </p>
                </StandardCard>
                <div className="columns">
                    <div className="column">
                        <StandardCard>
                            <p>
                                Paging, sorting...
                            </p>
                        </StandardCard>
                        <StandardCard>
                            <p>
                                Search results publications list...
                            </p>
                        </StandardCard>
                    </div>
                    <div className="column is-4">
                        <StandardCard title={'Refine'}>
                            <p>
                                Filter results...
                            </p>
                        </StandardCard>
                    </div>
                </div>
            </StandardPage>
        );
    }
}
export default SearchRecords;
