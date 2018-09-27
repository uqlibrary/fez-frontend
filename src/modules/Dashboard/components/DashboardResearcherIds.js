import React from 'react';
import PropTypes from 'prop-types';
import {ExternalLink} from 'modules/SharedComponents/ExternalLink';
import locale from 'locale/pages';
import {pathConfig} from 'config/routes';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';

const styles = theme =>({
    researcherIDlink: {
        '&:hover': {
            cursor: 'pointer'
        },
        '& .error': {
            '-webkit-filter': 'grayscale(1)',
            filter: 'grayscale(1)'
        }
    },
    orcidLink: {
        color: theme.palette.white.main
    }
});

export class DashboardResearcherIds extends React.Component {
    static propTypes = {
        values: PropTypes.shape({
            publons: PropTypes.string,
            researcher: PropTypes.string,
            scopus: PropTypes.string,
            google_scholar: PropTypes.string,
            orcid: PropTypes.string
        }),
        authenticated: PropTypes.shape({
            publons: PropTypes.bool,
            researcher: PropTypes.bool,
            scopus: PropTypes.bool,
            google_scholar: PropTypes.bool,
            orcid: PropTypes.bool
        }),
        history: PropTypes.object.isRequired,
        classes: PropTypes.object
    };

    render() {
        const {values, authenticated, classes} = this.props;
        const txt = locale.pages.dashboard.header.dashboardResearcherIds;
        const link = {
            linkedUrl: {
                publons: 'https://publons.com/author/',
                scopus: 'http://www.scopus.com/authid/detail.url?authorId=',
                researcher: 'http://www.researcherid.com/rid/',
                google_scholar: 'https://scholar.google.com.au/citations?user=',
                orcid: 'https://orcid.org/'
            },
            notLinkedUrl: {
                publons: 'http://guides.library.uq.edu.au/for-researchers/researcher-identifier/researcher-identifier',
                scopus: 'http://guides.library.uq.edu.au/for-researchers/researcher-identifier/researcher-identifier',
                researcher: 'http://guides.library.uq.edu.au/for-researchers/researcher-identifier/researcher-identifier',
                google_scholar: 'http://guides.library.uq.edu.au/for-researchers/researcher-identifier/researcher-identifier',
                // google_scholar: pathConfig.authorIdentifiers.googleScholar.link,
                orcid: pathConfig.authorIdentifiers.orcid.link
            }
        };
        const navigateToRoute = (event, item) => {
            this.props.history.push(link.notLinkedUrl[item]);
        };
        return (
            <Grid container spacing={8} alignItems={'center'} style={{marginTop: 12}}>
                {values && Object.keys(values).map((item, index) => (
                    <Grid item key={index}>
                        {/* external URL's */}
                        {((values[item] && link.linkedUrl[item].indexOf('http') !== -1) || (!values[item] && link.notLinkedUrl[item].indexOf('http') !== -1)) &&
                        <ExternalLink openInNewIcon={false} className={classes.researcherIDlink}
                            href={values[item] ? link.linkedUrl[item] + values[item] : link.notLinkedUrl[item]}
                            title={values[item] ? txt.researcherIsLinked.replace('[resource]', txt.titles[item]).replace('[id]', values[item]) : txt.researcherIsNotLinked.replace('[resource]', txt.titles[item])}>
                            <div
                                title={!!values[item] ? (txt.researcherIsLinked.replace('[resource]', txt.titles[item]).replace('[id]', values[item])) : (txt.researcherIsNotLinked.replace('[resource]', txt.titles[item]))}
                                className={'fez-icon ' + item + (values[item] && authenticated[item] ? ' ok' : ' error')}
                                style={{width: 32, height: 32, borderRadius: 32}}
                            />
                        </ExternalLink>
                        }

                        {/* Internal URL's - will be non-linked ID's only */}
                        {!values[item] && link.notLinkedUrl[item].indexOf('http') === -1 &&
                        <a tabIndex="0" onClick={(event) => navigateToRoute(event, item)}
                            className={classes.researcherIDlink}
                            onKeyPress={(event) => navigateToRoute(event, item)}
                            title={txt.researcherIsNotLinked.replace('[resource]', txt.titles[item])}>
                            <div title={txt.researcherIsNotLinked.replace('[resource]', txt.titles[item])}
                                className={'fez-icon ' + item + ' dashboard ' + (values[item] && authenticated[item] ? ' ok' : ' error')}/>
                        </a>
                        }
                    </Grid>)
                )}

                {values.orcid &&
                <Grid item>
                    <a href={txt.orcidUrlPrefix + values.orcid}
                        target="_blank"
                        aria-label={txt.orcidlinkLabel}
                        title={txt.orcidlinkLabel}
                        tabIndex="0" >
                        <Typography variant={'caption'} className={classes.orcidLink} >{txt.orcidLinkPrefix}{values.orcid}</Typography>
                    </a>
                </Grid>
                }
            </Grid>
        );
    }
}

export default withStyles(styles, { withTheme: true })(DashboardResearcherIds);
