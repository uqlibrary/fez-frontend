import React, {PureComponent} from 'react';

import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';
import {default as locale} from 'locale/pages';

class Index extends PureComponent {
    render() {
        const whatIsEspaceLocale = locale.pages.index.whatIsEspace;
        return (
            <StandardPage className="page-index">
                <StandardCard title={'eSpace search'}>
                    <p>
                        eSpace search goes here... or on app tool bar?
                    </p>
                </StandardCard>
                <div className="columns">
                    <div className="column">
                        <StandardCard title={'Most cited publications/Trending publications'}>
                            <p>
                                publications list...
                            </p>
                        </StandardCard>
                    </div>
                    <div className="column is-4">
                        {
                            whatIsEspaceLocale.text &&
                            <StandardCard title={whatIsEspaceLocale.title} className="primaryHeader">
                                {whatIsEspaceLocale.text}
                                {
                                    whatIsEspaceLocale.readMoreLink && whatIsEspaceLocale.readMoreTitle &&
                                    <a href={whatIsEspaceLocale.readMoreLink}>{whatIsEspaceLocale.readMoreTitle}</a>
                                }
                            </StandardCard>
                        }
                        <StandardCard title={'Latest news'} className="primaryHeader">
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
