import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { Section } from '../common/Section';
import { useRecordContext } from 'context';
import { adminInterfaceConfig } from 'config/admin';

export const NtroSection = ({ disabled = false }) => {
    const { record } = useRecordContext();
    const cards = useRef(adminInterfaceConfig[record.rek_display_type].ntro());

    return <Section cards={cards} disabled={disabled} />;
};

NtroSection.propTypes = {
    disabled: PropTypes.bool,
};

export default React.memo(NtroSection);
