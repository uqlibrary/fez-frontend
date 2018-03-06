import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {locale} from 'locale';
import {ExternalLink} from 'modules/SharedComponents/ExternalLink';

export default class DoiLink extends PureComponent {
    static propTypes = {
        DoiId: PropTypes.string
    };

    render() {
        if (!this.props.DoiId) {
            return (<span className="DoiLinkUrl empty"/>);
        }

        const txt = locale.global.doiCitationLink;
        return (
            <ExternalLink
                className="pubmedCentralLinkUrl"
                href={txt.externalUrl.replace('[id]', this.props.DoiId)}
                title={txt.ariaLabel}
                aria-label={txt.ariaLabel}>
                {txt.prefix + this.props.DoiId}
            </ExternalLink>
        );
    }
}
