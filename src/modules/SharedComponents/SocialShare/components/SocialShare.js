import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { APP_URL } from 'config';
import {
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon, ResearchGateIcon, MendeleyIcon,
    EmailIcon,
    PrintIcon,
} from './Icons';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import PropTypes from 'prop-types';

export class SocialShare extends Component {
    static propTypes = {
        publication: PropTypes.object.isRequired,
        size: PropTypes.number,
        spaceBetween: PropTypes.number,
        services: PropTypes.array,
        round: PropTypes.bool,
    };

    static contextTypes = {
        isMobile: PropTypes.bool,
    };

    static defaultProps = {
        size: 24,
        round: true,
        spaceBetween: 4,
    };

    printPage = () => {
        window.print();
    };

    render() {
        const pub = this.props.publication;
        const locale = {
            facebook: {
                id: 'facebook',
                link: {
                    href: `https://www.facebook.com/sharer/sharer.php?u=${APP_URL}/view/${pub.rek_pid}`,
                    width: 500,
                    height: 500,
                    title: 'Share this record on Facebook',
                    openInNewIcon: false,
                },
                icon: FacebookIcon,
            },
            twitter: {
                id: 'twitter',
                link: {
                    href: `https://twitter.com/share?url=${APP_URL}/view/${pub.rek_pid}&text=${pub.rek_title} - `,
                    width: 500,
                    height: 300,
                    title: 'Share this record on Twitter',
                    openInNewIcon: false,
                },
                icon: TwitterIcon,
            },
            linkedin: {
                id: 'linkedin',
                link: {
                    href: `https://linkedin.com/shareArticle?url=${APP_URL}/view/${pub.rek_pid}`,
                    width: 500,
                    height: 500,
                    title: 'Share this record on LinkedIn',
                    openInNewIcon: false,
                },
                icon: LinkedinIcon,
            },
            researchgate: {
                id: 'researchgate',
                link: {
                    href: `https://www.researchgate.net/go.Share.html?url=${APP_URL}/view/${pub.rek_pid}&title=${pub.rek_title}`,
                    width: 500,
                    height: 600,
                    title: 'Share this record on Research Gate',
                    openInNewIcon: false,
                },
                icon: ResearchGateIcon,
            },
            mendeley: {
                id: 'mendeley',
                link: {
                    href: `https://profitquery.com/add-to/mendeley/?url=${APP_URL}/view/${pub.rek_pid}`,
                    width: 500,
                    height: 500,
                    title: 'Share this record on Mendeley',
                    openInNewIcon: false,
                },
                icon: MendeleyIcon,
            },
            email: {
                id: 'email',
                link: {
                    href: `mailto:?subject=${pub.rek_title}&body=Please review this record in UQ eSpace: ${APP_URL}/view/${pub.rek_pid}`,
                    title: 'Share this record via Email',
                    openInNewIcon: false,
                },
                icon: EmailIcon,
            },
            print: {
                id: 'print',
                link: {
                    href: '#',
                    onClick: this.printPage,
                    target: '',
                    title: 'Print this record',
                    openInNewIcon: false,
                },
                icon: PrintIcon,
            },
        };
        return (
            <Grid container spacing={0} id="social-share">
                {this.props.services && this.props.services.length > 0 && this.props.services.map((item, index) => {
                    const Icon = locale[item].icon;
                    return (
                        <Grid item id={item.id} key={index} style={{ marginRight: this.props.spaceBetween }}>
                            <ExternalLink {...locale[item].link} >
                                <Icon
                                    size={this.context.isMobile ? this.props.size * 1.5 : this.props.size}
                                    round={this.props.round}
                                />
                            </ExternalLink>
                        </Grid>
                    );
                })}
            </Grid>
        );
    }
}

export default SocialShare;
