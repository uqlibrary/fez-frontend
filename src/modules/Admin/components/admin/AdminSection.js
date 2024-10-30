import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';

import { Section } from '../common/Section';
import { useRecordContext } from 'context';
import { adminInterfaceConfig } from 'config/admin';
import { NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK } from 'config/general';

export const AdminSection = ({ disabled = false }) => {
    const { record } = useRecordContext();
    const methods = useFormContext();

    const cards = useRef(
        adminInterfaceConfig[record.rek_display_type].admin(
            methods.getValues('adminSection.rek_subtype') === NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK,
        ),
    );

    return <Section cards={cards.current} disabled={disabled} />;
};

AdminSection.propTypes = {
    disabled: PropTypes.bool,
};

export default React.memo(AdminSection);
