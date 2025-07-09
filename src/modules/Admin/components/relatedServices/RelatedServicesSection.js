import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { Section } from '../common/Section';
import { useRecordContext } from 'context';
import { adminInterfaceConfig } from 'config/admin';

export const RelatedServicesSection = ({ disabled = false }) => {
    const { record } = useRecordContext();
    const cards = useRef(adminInterfaceConfig[record.rek_display_type].relatedServices());

    return <Section cards={cards.current} disabled={disabled} />;
};

RelatedServicesSection.propTypes = {
    disabled: PropTypes.bool,
};

export default React.memo(RelatedServicesSection);
