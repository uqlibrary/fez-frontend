import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { Section } from '../common/Section';
import { useRecordContext } from 'context';
import { adminInterfaceConfig } from 'config/admin';
import { PUBLICATION_TYPE_DATA_COLLECTION } from 'config/general';

export const FilesSection = ({ disabled = false }) => {
    const { record } = useRecordContext();
    const cards = useRef(
        adminInterfaceConfig[record.rek_display_type].files({
            isDataset: record.rek_display_type === PUBLICATION_TYPE_DATA_COLLECTION,
        }),
    );

    return <Section cards={cards.current} disabled={disabled} />;
};

FilesSection.propTypes = {
    disabled: PropTypes.bool,
};

export default React.memo(FilesSection);
