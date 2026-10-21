import React from 'react';
import PropTypes from 'prop-types';
import { default as globalLocale } from 'locale/global';
import { default as viewRecordLocale } from 'locale/viewRecord';
import { pathConfig } from 'config/pathConfig';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import { Link } from 'react-router';
import { getOpenPolicyFinderUrl } from 'config/general';

// fez_journal returns era data
export const getERAYears = matchedJournal => {
    const years = [];
    if (matchedJournal && matchedJournal.fez_journal && matchedJournal.fez_journal.fez_journal_era) {
        matchedJournal.fez_journal.fez_journal_era.map(journalEra => {
            if (journalEra.jnl_era_source_year && !years.includes(journalEra.jnl_era_source_year)) {
                years.push(journalEra.jnl_era_source_year);
            }
        });
    }

    return years;
};

export const getSherpaRomeo = issns => {
    const match = issns.find(item => item.fez_sherpa_romeo?.srm_source_id);

    return match
        ? {
              issn: match.rek_issn,
              url: getOpenPolicyFinderUrl(match.fez_sherpa_romeo.srm_source_id),
          }
        : null;
};

const JournalName = ({ publication }) => {
    const renderSherpaRomeo = issns => {
        const sherpaRomeoData = getSherpaRomeo(issns);
        let sherpaRomeoElement = <span />;
        if (sherpaRomeoData) {
            sherpaRomeoElement = (
                <span>
                    {' '}
                    <ExternalLink
                        href={sherpaRomeoData.url}
                        aria-label={globalLocale.global.sherpaRomeoLink.ariaLabel}
                        id="rek-journal-name-sherpa"
                    >
                        {viewRecordLocale.viewRecord.linkTexts.journalOpenAccessPolicyLink}
                    </ExternalLink>
                </span>
            );
        }

        return sherpaRomeoElement;
    };

    const renderJournalName = (journalName, matchedJournal) => {
        const eraYears = getERAYears(matchedJournal);
        const eraJournalListedText =
            eraYears && eraYears.length > 0
                ? viewRecordLocale.viewRecord.linkTexts.eraJournalListed.replace('[year]', eraYears.join(', '))
                : '';
        return (
            <span data-testid="rek-journal-name">
                <Link to={pathConfig.list.journalName(journalName)}>
                    <span>{journalName}</span>
                </Link>
                {eraJournalListedText && <span data-testid="era-year-listed"> {eraJournalListedText}</span>}
            </span>
        );
    };

    return (
        <span>
            {publication.fez_record_search_key_journal_name &&
                publication.fez_record_search_key_journal_name.rek_journal_name &&
                renderJournalName(
                    publication.fez_record_search_key_journal_name.rek_journal_name,
                    publication.fez_matched_journals,
                )}
            {publication.fez_record_search_key_journal_name &&
                publication.fez_record_search_key_issn &&
                renderSherpaRomeo(publication.fez_record_search_key_issn)}
        </span>
    );
};
JournalName.propTypes = {
    publication: PropTypes.object.isRequired,
};
export default JournalName;
