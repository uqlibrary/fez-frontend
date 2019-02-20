import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {ExternalLink} from 'modules/SharedComponents/ExternalLink';
import Typography from '@material-ui/core/Typography';
import {Link} from 'react-router-dom';

import {locale} from 'locale';

export default class WhatIsEspace extends PureComponent {
    static propTypes = {
        details: PropTypes.object
    };

    render() {
        let txt;
        // values are only passed in for test, so really really, you can only do this if the data is all there...
        if (!!this.props.details && !!this.props.details.title && !!this.props.details.text && !!this.props.details.readMoreLink && !!this.props.details.readMoreTitle && !!this.props.details.readMoreLabel) {
            txt = this.props.details;
        } else {
            txt = locale.components.whatIsEspace;
        }
        return (
            <StandardCard title={txt.title} darkHeader>
                <Typography variant={'body2'}>
                    {txt.text}
                    {
                        txt.readMoreLink.indexOf('http') === -1 &&
                        <Link to={txt.readMoreLink}>{txt.readMoreLabel}</Link>
                    }
                    {
                        txt.readMoreLink.indexOf('http') >= 0 &&
                        <ExternalLink href={txt.readMoreLink} title={txt.readMoreTitle} aria-label={txt.readMoreTitle}>
                            {txt.readMoreLabel}
                        </ExternalLink>
                    }
                </Typography>
            </StandardCard>
        );
    }
}
