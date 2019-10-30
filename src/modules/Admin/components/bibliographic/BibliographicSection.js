import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { Section } from '../common/Section';

import { useRecordContext } from 'context';
import { adminInterfaceConfig } from 'config/admin';

export const BibliographicSection = ({ disabled = false }) => {
    const { record } = useRecordContext();
    const cards = useRef(
        adminInterfaceConfig[record.rek_display_type].bibliographic(
            record.fez_record_search_key_language &&
                (record.fez_record_search_key_language.length > 1 ||
                    (record.fez_record_search_key_language.length === 1 &&
                        record.fez_record_search_key_language[0].rek_language !== 'eng')),
        ),
    );

    return <Section cards={cards} disabled={disabled} />;
};

BibliographicSection.propTypes = {
    disabled: PropTypes.bool,
};

export default React.memo(BibliographicSection);
