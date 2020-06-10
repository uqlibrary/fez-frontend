import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { Section } from '../common/Section';
import { useRecordContext } from 'context';
import { adminInterfaceConfig } from 'config/admin';
import {
    PUBLICATION_TYPE_AUDIO_DOCUMENT,
    PUBLICATION_TYPE_SEMINAR_PAPER,
    PUBLICATION_TYPE_BOOK,
    PUBLICATION_TYPE_BOOK_CHAPTER,
    PUBLICATION_TYPE_CONFERENCE_PAPER,
    PUBLICATION_TYPE_CONFERENCE_PROCEEDINGS,
    PUBLICATION_TYPE_JOURNAL,
    PUBLICATION_TYPE_JOURNAL_ARTICLE,
    PUBLICATION_TYPE_REFERENCE_ENTRY,
    PUBLICATION_TYPE_RESEARCH_REPORT,
    PUBLICATION_TYPE_DEPARTMENT_TECHNICAL_REPORT,
    NTRO_SUBTYPE_RRW_MUSIC_DANCE_THEATRE,
    NTRO_SUBTYPE_RRW_AUDIO_VISUAL_RECORDING,
    NTRO_SUBTYPE_RRW_DIGITAL_CREATIVE_WORKS,
    NTRO_SUBTYPE_RRW_INTERARTS,
    NTRO_SUBTYPE_RRW_WEBSITE_EXHIBITION,
    NTRO_SUBTYPE_RRW_OTHER,
    NTRO_SUBTYPE_CW_MUSICAL_COMPOSITION,
} from 'config/general';

export const IdentifiersSection = ({ disabled = false }) => {
    const { record } = useRecordContext();
    const cards = useRef(
        adminInterfaceConfig[record.rek_display_type].identifiers({
            displayAll: [
                PUBLICATION_TYPE_BOOK,
                PUBLICATION_TYPE_BOOK_CHAPTER,
                PUBLICATION_TYPE_CONFERENCE_PAPER,
                PUBLICATION_TYPE_CONFERENCE_PROCEEDINGS,
                PUBLICATION_TYPE_JOURNAL,
                PUBLICATION_TYPE_JOURNAL_ARTICLE,
                PUBLICATION_TYPE_REFERENCE_ENTRY,
                PUBLICATION_TYPE_RESEARCH_REPORT,
                PUBLICATION_TYPE_DEPARTMENT_TECHNICAL_REPORT,
            ].includes(record.rek_display_type),
            displayIdentifiers: PUBLICATION_TYPE_AUDIO_DOCUMENT === record.rek_display_type,
            displayLocation: [PUBLICATION_TYPE_AUDIO_DOCUMENT, PUBLICATION_TYPE_SEMINAR_PAPER].includes(
                record.rek_display_type,
            ),
            displayIsmn: [NTRO_SUBTYPE_CW_MUSICAL_COMPOSITION].includes(record.rek_subtype),
            displayIsrc: [
                NTRO_SUBTYPE_RRW_MUSIC_DANCE_THEATRE,
                NTRO_SUBTYPE_RRW_AUDIO_VISUAL_RECORDING,
                NTRO_SUBTYPE_RRW_DIGITAL_CREATIVE_WORKS,
                NTRO_SUBTYPE_RRW_INTERARTS,
                NTRO_SUBTYPE_RRW_WEBSITE_EXHIBITION,
                NTRO_SUBTYPE_RRW_OTHER,
            ].includes(record.rek_subtype),
        }),
    );
    return <Section cards={cards.current} disabled={disabled} />;
};

IdentifiersSection.propTypes = {
    disabled: PropTypes.bool,
};

export default React.memo(IdentifiersSection);
