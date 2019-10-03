import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { Section } from '../common/Section';
import { useRecordContext } from 'context';
import { adminInterfaceConfig } from 'config/admin';

export const IdentifiersSection = ({ disabled = false }) => {
    const { record } = useRecordContext();
    const cards = useRef(adminInterfaceConfig[record.rek_display_type].identifiers());

    return <Section cards={cards} disabled={disabled} />;
};

IdentifiersSection.propTypes = {
    disabled: PropTypes.bool,
};

export default React.memo(IdentifiersSection);
