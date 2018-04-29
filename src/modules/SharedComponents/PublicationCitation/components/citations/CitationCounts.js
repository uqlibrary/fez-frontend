import React from 'react';
import PropTypes from 'prop-types';
import {locale} from 'locale';
import {ExternalLink} from 'modules/SharedComponents/ExternalLink';
import OpenAccessIcon from 'modules/SharedComponents/Partials/OpenAccessIcon';
import * as Partials from './partials';

export default class CitationCounts extends React.PureComponent {
    static propTypes = {
        publication: PropTypes.object.isRequired,
    };

    getTitle = (title) => (locale.components.publicationCitation.linkWillOpenInNewWindow.replace('[destination]', title));

    render() {
        const txt = locale.components.publicationCitation.citationCounts;
        const {sources} = locale.global;
        const {publication} = this.props;
        const counts = {
            wos: publication.rek_thomson_citation_count ? publication.rek_thomson_citation_count : null,
            scopus: publication.rek_scopus_citation_count ? publication.rek_scopus_citation_count : null,
            google: publication.rek_gs_citation_count ? publication.rek_gs_citation_count : null,
            altmetric: publication.rek_altmetric_score ? publication.rek_altmetric_score : null
        };

        return (
            <div className="citationCounts columns is-gapless is-marginless is-multiline">
                <div className="column is-narrow-tablet is-12-mobile citationIcons">
                    {
                        !!counts.wos && counts.wos > 0 && !!publication.fez_record_search_key_isi_loc
                        && !!publication.fez_record_search_key_isi_loc.rek_isi_loc &&
                        <Partials.CitationCountView
                            source="wos"
                            count={counts.wos}
                            link={sources.wos.externalUrl.replace('[id]', publication.fez_record_search_key_isi_loc.rek_isi_loc)}
                            title={this.getTitle(sources.wos.title)}
                        />
                    }
                    {
                        !!counts.scopus && counts.scopus > 0
                        && !!publication.fez_record_search_key_scopus_id && !!publication.fez_record_search_key_scopus_id.rek_scopus_id &&
                        <Partials.CitationCountView
                            source="scopus"
                            count={counts.scopus}
                            link={sources.scopus.externalUrl.replace('[id]', publication.fez_record_search_key_scopus_id.rek_scopus_id)}
                            title={this.getTitle(sources.scopus.title)}
                        />
                    }
                    {
                        !!counts.altmetric && counts.altmetric > 0 && !!publication.rek_altmetric_id &&
                        <Partials.CitationCountView
                            source="altmetric"
                            count={counts.altmetric}
                            link={txt.altmetric.externalUrl.replace('[id]', publication.rek_altmetric_id)}
                            title={this.getTitle(txt.altmetric.title)}
                        />
                    }
                    {
                        !!publication.rek_pid &&
                        <Partials.CitationCountView
                            source="google"
                            count={counts.google}
                            link={txt.google.externalUrl + encodeURI(publication.rek_title)}
                            title={this.getTitle(txt.google.title)}
                        />
                    }
                </div>
                <div className="column is-narrow">
                    <OpenAccessIcon {...(this.props.publication.calculateOpenAccess ? this.props.publication.calculateOpenAccess() : {})} />
                    {
                        !!publication.rek_pid && (counts.wos || counts.scopus) &&
                        <ExternalLink href={`https://app.library.uq.edu.au/#/authors/view/${publication.rek_pid}`} title={publication.rek_title}>
                            {txt.statsLabel}
                        </ExternalLink>
                    }
                </div>
                <div className="column is-hidden-mobile" />
            </div>
        );
    }
}
