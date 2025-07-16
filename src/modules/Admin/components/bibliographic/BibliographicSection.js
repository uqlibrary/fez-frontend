import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';

import { Section } from '../common/Section';

import { useRecordContext } from 'context';
import { adminInterfaceConfig } from 'config/admin';
import { bibliographicParams } from 'modules/Admin/helpers';

export const BibliographicSection = ({ disabled = false }) => {
    const { record } = useRecordContext();
    const methods = useFormContext();
    const formValues = methods.getValues('bibliographicSection');
    const cards = useRef(
        adminInterfaceConfig[record.rek_display_type].bibliographic(bibliographicParams(record, formValues)),
    );

    return <Section cards={cards.current} disabled={disabled} />;
};

BibliographicSection.propTypes = {
    disabled: PropTypes.bool,
};

export default React.memo(BibliographicSection);
