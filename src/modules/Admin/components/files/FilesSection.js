import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { Section } from '../common/Section';
import { useRecordContext } from 'context';
import { adminInterfaceConfig } from 'config/adminInterface';

/* istanbul ignore next */
export const FilesSection = ({ disabled = false }) => {
    const { record } = useRecordContext();
    const cards = useRef(adminInterfaceConfig[record.rek_display_type].files());

    return <Section cards={cards} disabled={disabled} />;
};

FilesSection.propTypes = {
    disabled: PropTypes.bool,
};

export default React.memo(FilesSection);
