import React from 'react';
import PropTypes from 'prop-types';

import { Section } from '../common/Section';

import { useRecordContext, useFormValuesContext } from 'context';
import { adminInterfaceConfig } from 'config/admin';

export const BibliographicSection = ({ disabled = false }) => {
    const { record } = useRecordContext();
    const { formValues } = useFormValuesContext();
    const isLote =
        formValues.languages &&
        (formValues.languages.length > 1 || (formValues.languages.length === 1 && formValues.languages[0] !== 'eng'));

    const cards = adminInterfaceConfig[record.rek_display_type].bibliographic(isLote);
    return <Section cards={cards} disabled={disabled} />;
};

BibliographicSection.propTypes = {
    disabled: PropTypes.bool,
};

export default React.memo(BibliographicSection);
