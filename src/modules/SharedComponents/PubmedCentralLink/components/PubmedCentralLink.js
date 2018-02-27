import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {locale} from 'locale';
import {ExternalLink} from 'modules/SharedComponents/ExternalLink';

export default class PubmedCentralLink extends PureComponent {
    static propTypes = {
        pubmedCentralId: PropTypes.string
    };

    render() {
        if (!this.props.pubmedCentralId) {
            return (<span className="pubmedCentralLinkUrl empty"/>);
        }

        const txt = locale.global.pubmedCentralLink;
        return (
            <ExternalLink
                className="pubmedCentralLinkUrl"
                href={txt.externalUrl.replace('[id]', this.props.pubmedCentralId)}
                title={txt.ariaLabel}
                aria-label={txt.ariaLabel}>
                {txt.prefix + this.props.pubmedCentralId}
            </ExternalLink>
        );
    }
}
