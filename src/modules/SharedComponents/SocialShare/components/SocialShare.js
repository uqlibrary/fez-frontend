import React from 'react';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import { APP_URL } from 'config';
import { PrintIcon, ResearchGateIcon, MendeleyIcon } from './Icons';
import { EmailIcon, FacebookIcon, TwitterIcon, LinkedinIcon } from 'react-share';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';

export const SocialShare = ({ publication, size, spaceBetween, services, round }) => {
    const printPage = () => window.print();
    const locale = {
        facebook: {
            id: 'facebook',
            link: {
                href: `https://www.facebook.com/sharer/sharer.php?u=${APP_URL}view/${publication.rek_pid}`,
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
                href: `https://twitter.com/share?url=${APP_URL}view/${publication.rek_pid}&text=${publication.rek_title} - `,
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
                href: `https://linkedin.com/shareArticle?url=${APP_URL}view/${publication.rek_pid}`,
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
                href: `https://www.researchgate.net/go.Share.html?url=${APP_URL}view/${publication.rek_pid}&title=${publication.rek_title}`,
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
                href: `https://profitquery.com/add-to/mendeley/?url=${APP_URL}view/${publication.rek_pid}`,
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
                href: `mailto:?subject=${publication.rek_title}&body=Please review this record in UQ eSpace: ${APP_URL}view/${publication.rek_pid}`,
                title: 'Share this record via Email',
                openInNewIcon: false,
            },
            icon: EmailIcon,
        },
        print: {
            id: 'print',
            link: {
                href: '#',
                onClick: printPage,
                target: '',
                title: 'Print this record',
                openInNewIcon: false,
            },
            icon: PrintIcon,
        },
    };
    return (
        <Grid container spacing={0} id="social-share">
            {services &&
                services.length > 0 &&
                services.map((item, index) => {
                    const Icon = locale[item].icon;
                    return (
                        <Grid item id={item.id} key={index} style={{ marginRight: spaceBetween }}>
                            <ExternalLink
                                {...locale[item].link}
                                id={locale[item].id}
                                data-testid={`social-share-${locale[item].id}-link`}
                            >
                                <Icon size={size} round={round} />
                            </ExternalLink>
                        </Grid>
                    );
                })}
        </Grid>
    );
};

SocialShare.propTypes = {
    publication: PropTypes.object.isRequired,
    size: PropTypes.number,
    spaceBetween: PropTypes.number,
    services: PropTypes.array.isRequired,
    round: PropTypes.bool,
};

SocialShare.defaultProps = {
    publication: {},
    size: 24,
    spaceBetween: 4,
    services: [],
    round: true,
};
