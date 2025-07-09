import React from 'react';
import PropTypes from 'prop-types';

import { Section } from '../common/Section';

import { useRecordContext, useFormValuesContext } from 'context';
import { adminInterfaceConfig } from 'config/admin';
import { bibliographicParams } from 'modules/Admin/helpers';

export const BibliographicSection = ({ disabled = false }) => {
    const { record } = useRecordContext();
    const { formValues } = useFormValuesContext();

    const cards = adminInterfaceConfig[record.rek_display_type].bibliographic(bibliographicParams(record, formValues));

    return <Section cards={cards} disabled={disabled} />;
};

BibliographicSection.propTypes = {
    disabled: PropTypes.bool,
};

export default React.memo(BibliographicSection);
