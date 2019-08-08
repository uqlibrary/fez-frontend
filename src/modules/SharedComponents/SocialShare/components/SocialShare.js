import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
// import { APP_URL } from 'config';
import {
    // FacebookShareButton,
    // LinkedinShareButton,
    // TwitterShareButton,
    // WhatsappShareButton,
    // RedditShareButton,
    // EmailShareButton,
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    // WhatsappIcon,
    // RedditIcon,
    // EmailIcon,

} from './Icons';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import PropTypes from 'prop-types';

export class SocialShare extends Component {
    static propTypes = {
        publication: PropTypes.object.isRequired,
        size: PropTypes.number,
        sharers: PropTypes.array,
        round: PropTypes.bool,
    };

    static defaultProps = {
        publication: {
            rek_title: 'Test',
            rek_pid: 'UQ:26a32ac',
        },
        size: 24,
        round: true,
        sharers: ['facebook', 'twitter', 'linkedin'],
    };

    render() {
        const APP_URL = 'http://espace.library.uq.edu.au';
        const pub = this.props.publication;
        const locale = {
            facebook: {
                id: 'facebook',
                link: {
                    href: `https://www.facebook.com/sharer/sharer.php?u=${APP_URL}/view/${pub.rek_pid}`,
                    title: 'Share this record on Facebook',
                    openInNewIcon: false,
                },
                icon: FacebookIcon,
            },
            twitter: {
                id: 'twitter',
                link: {
                    href: `https://twitter.com/share?url=${APP_URL}/view/${pub.rek_pid}&text=${pub.rek_title} - `,
                    title: 'Share this record on Twitter',
                    openInNewIcon: false,
                },
                icon: TwitterIcon,
            },
            linkedin: {
                id: 'linkedin',
                link: {
                    href: `https://twitter.com/share?url=${APP_URL}/view/${pub.rek_pid}&text=${pub.rek_title} - `,
                    title: 'Share this record on LinkedIn',
                    openInNewIcon: false,
                },
                icon: LinkedinIcon,
            },
        };

        return (
            <Grid container spacing={8} style={{ marginTop: 6, marginBottom: 6 }} id="social-share">
                {this.props.sharers.map((item, index) => {
                    const Icon = locale[item].icon;
                    return (
                        <Grid item id={item.id} key={index}>
                            <ExternalLink {...locale[item].link} >
                                <Icon size={this.props.size} round={this.props.round}/>
                            </ExternalLink>
                        </Grid>
                    );
                })}
            </Grid>
        );
    }
}

export default SocialShare;
