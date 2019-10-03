import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { Section } from '../common/Section';
import { useRecordContext } from 'context';
import { adminInterfaceConfig } from 'config/admin';

export const AdditionalInformationSection = ({ disabled = false }) => {
    const { record } = useRecordContext();
    const cards = useRef(adminInterfaceConfig[record.rek_display_type].additionalInformation());

    return <Section cards={cards} disabled={disabled} />;
};

AdditionalInformationSection.propTypes = {
    disabled: PropTypes.bool,
};

export default React.memo(AdditionalInformationSection);
