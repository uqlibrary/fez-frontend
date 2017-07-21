import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';

const thompsonIcon = require('images/thomson_icon.svg');
const scopusIcon = require('images/scopus_icon.svg');
const googleScholarIcon = require('images/googlescholar_icon.svg');
const altmetricIcon = require('images/altmetric_icon.svg');

export default class CitationCounts extends Component {

    static propTypes = {
        publication: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        const counts = {
            thomson: this.props.publication.rek_thomson_citation_count ? this.props.publication.rek_thomson_citation_count : null,
            scopus: this.props.publication.rek_scopus_citation_count ? this.props.publication.rek_scopus_citation_count : null,
            google: this.props.publication.rek_gs_citation_count ? this.props.publication.rek_gs_citation_count : null,
            altmetric: this.props.publication.rek_altmetric_score ? this.props.publication.rek_altmetric_score : null,
            downloads: this.props.publication.rek_file_downloads ? this.props.publication.rek_file_downloads : null
        };
        return (
            <div className="citationCounts">
                {
                    !!counts.thomson && counts.thomson > 0 &&
                    <span className="citationCount">
                        <img src={thompsonIcon}
                             alt="Thomson Routers"
                             data-tip="Thomson Routers Web of Science citation count"
                             title="Thomson Routers Web of Science citation count"
                             data-place="bottom"
                             className="citationCountIcon"
                        />
                        <span className="citationCountNumber">{counts.thomson}</span>
                    </span>
                }
                {
                    !!counts.scopus && counts.scopus > 0 &&
                    <span className="citationCount">
                        <img src={scopusIcon}
                             alt="Scopus"
                             data-tip="Scopus citation count"
                             title="Scopus citation count"
                             data-for="claimTooltips"
                             className="citationCountIcon"
                        />
                        <span className="citationCountNumber">{counts.scopus}</span>
                    </span>
                }
                {
                    !!counts.google && counts.google > 0 &&
                    <span className="citationCount">
                        <img src={googleScholarIcon}
                             alt="Google Scholar"
                             data-tip="Google Scholar citation count"
                             title="Google Scholar citation count"
                             data-for="claimTooltips"
                             className="citationCountIcon"
                        />
                        <span className="citationCountNumber">{counts.google}</span>
                    </span>
                }
                {
                    !!counts.altmetric && counts.altmetric > 0 &&
                    <span className="citationCount">
                        <img src={altmetricIcon}
                             alt="Altmetric" data-tip="Altmetric score"
                             title="Altmetric score"
                             data-for="claimTooltips"
                             className="citationCountIcon"
                        />
                        <span className="citationCountNumber">{counts.altmetric}</span>
                    </span>
                }
                {
                    !!counts.downloads && counts.downloads > 0 &&
                    <span className="citationCount">
                        <FontIcon className="material-icons citationCountIcon"
                                  data-tip="Downloads"
                                  title="Downloads"
                                  data-for="claimTooltips"
                                  data-place="bottom"
                        >file_download</FontIcon>
                        <span className="citationCountNumber">{counts.downloads}</span>
                    </span>
                }
            </div>
        );
    }
}
