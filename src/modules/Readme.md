# Code format for content cards/pages..
##### Using bulma columns>column grid layouts

    import {PropTypes} from 'prop-types';
    import {Card, CardText, CardHeader} from 'material-ui/Card';
    import {HelpIcon} from 'uqlibrary-react-toolbox';
---
    <div className="layout-fill">
        
        <h1 className="page-title headline">{title ? title : 'This is the page title'}</h1>

            <Card className="layout-card">
                <CardHeader className="card-header">
                    <div className="columns is-gapless is-mobile">
                        
                        <div className="column">
                            <h2 className="title">{title ? title : 'This is the card title'}</h2>
                        </div>
                        
                        <div className="column is-narrow is-helpicon">
                            {help && (
                                <HelpIcon
                                    title={help.title}
                                    text={help.text}
                                    buttonLabel={help.button}
                                    />
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CardText className="body-1">
                    <div>
                        {text ? text : 'This is the default card content'}
                    </div>
                </CardText>

            </Card>
        </div>
---
        Browse.propTypes = {
            title: PropTypes.string,
            text: PropTypes.string,
            help: PropTypes.object
        };

#### Speak to Ky if you get lost.