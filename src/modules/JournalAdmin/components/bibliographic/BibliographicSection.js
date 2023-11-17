import React from 'react';
import PropTypes from 'prop-types';

import { Section } from '../common/Section';

import { useJournalContext, useFormValuesContext } from 'context';
import { adminInterfaceConfig } from 'config/journalAdmin';
import { bibliographicParams } from 'modules/JournalAdmin/helpers';

export const BibliographicSection = ({ disabled = false }) => {
    const { journal, jnlDisplayType } = useJournalContext();
    const { formValues } = useFormValuesContext();

    const cards = adminInterfaceConfig[jnlDisplayType].bibliographic(bibliographicParams(journal, formValues));

    return <Section cards={cards} disabled={disabled} />;
};

BibliographicSection.propTypes = {
    disabled: PropTypes.bool,
};

export default React.memo(BibliographicSection);
