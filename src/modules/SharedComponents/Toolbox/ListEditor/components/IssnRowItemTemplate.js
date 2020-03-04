import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import { default as globalLocale } from 'locale/global';

export const styles = () => ({
    romeoColour: {
        display: 'inline-block',
        width: '1em',
        height: '1em',
        outline: '1px solid #333',
        marginLeft: '0.5em',
        marginRight: '0.3em',
        bottom: '-0.1em',
        position: 'relative',

        '&.green': {
            background: '#D0F9D2',
        },
        '&.blue': {
            background: '#D3ECFA',
        },
        '&.yellow': {
            background: '#FFFF99',
        },
        '&.white': {
            background: '#FFFFFF',
        },

        '&.none::after': {
            content: '" "',
            width: '1.4em',
            height: '1.5em',
            borderBottom: '1px solid #333',
            transform: 'translateY(-0.85em) translateX(0.3em) rotate(45deg)',
            position: 'absolute',
        },
    },
});

export const IssnRowItemTemplate = ({ actions, classes, item, sherpaRomeo, ulrichs }) => {
    const convertItem = theItem =>
        !!theItem.key
            ? theItem
            : {
                key: theItem,
                value: {
                    sherpaRomeo: {
                        link: '',
                    },
                    ulrichs: {
                        link: '',
                    },
                },
            };

    const [issn, setIssn] = React.useState(convertItem(item));

    React.useEffect(() => {
        if ((item.key || item) !== issn.key) {
            setIssn(convertItem(item));
        }
    }, [issn, item]);

    React.useEffect(() => {
        if (!issn.value || !issn.value.sherpaRomeo || !issn.value.sherpaRomeo.link) {
            if (sherpaRomeo) {
                setIssn({
                    ...issn,
                    value: {
                        ...issn.value,
                        sherpaRomeo,
                    },
                });
            } else {
                actions.getSherpaFromIssn(issn.key);
            }
        }
    }, [actions, issn, sherpaRomeo]);

    React.useEffect(() => {
        if (!issn.value || !issn.value.ulrichs || !issn.value.ulrichs.link) {
            if (ulrichs) {
                setIssn({
                    ...issn,
                    value: {
                        ...issn.value,
                        ulrichs,
                    },
                });
            } else {
                actions.getUlrichsFromIssn(issn.key);
            }
        }
    }, [actions, issn, ulrichs]);

    return (
        <React.Fragment>
            <Typography variant="body2" component={'span'}>
                <span>{issn.key}</span>{' '}
                {!!issn.value && !!issn.value.sherpaRomeo && !!issn.value.sherpaRomeo.link && (
                    <ExternalLink
                        href={issn.value.sherpaRomeo.link}
                        aria-label={globalLocale.global.sherpaRomeoLink.ariaLabel}
                        title={globalLocale.global.sherpaRomeoLink.title}
                    >
                        {issn.value.sherpaRomeo.colour && (
                            <span
                                className={`${classes.romeoColour} ${issn.value.sherpaRomeo.colour}`}
                                title={globalLocale.global.sherpaRomeoLink.colourTitle[issn.value.sherpaRomeo.colour]}
                            />
                        )}
                        {globalLocale.global.sherpaRomeoLink.externalLinktext}
                    </ExternalLink>
                )}
                {!!issn.value &&
                    !!issn.value.sherpaRomeo &&
                    !!issn.value.sherpaRomeo.link &&
                    !!issn.value.ulrichs &&
                    !!issn.value.ulrichs.link && <span> &nbsp;</span>}
                {!!issn.value && !!issn.value.ulrichs && !!issn.value.ulrichs.link && (
                    <ExternalLink
                        href={issn.value.ulrichs.link}
                        aria-label={globalLocale.global.ulrichsLink.ariaLabel}
                        title={issn.value.ulrichs.title}
                    >
                        {globalLocale.global.ulrichsLink.externalLinktext}
                    </ExternalLink>
                )}
            </Typography>
        </React.Fragment>
    );
};

IssnRowItemTemplate.propTypes = {
    actions: PropTypes.object,
    classes: PropTypes.object,
    item: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    sherpaRomeo: PropTypes.object,
    ulrichs: PropTypes.object,
};

export default withStyles(styles)(IssnRowItemTemplate);
