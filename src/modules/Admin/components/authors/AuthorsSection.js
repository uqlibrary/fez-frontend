import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';

import { Section } from '../common/Section';
import { useRecordContext } from 'context';
import { adminInterfaceConfig } from 'config/admin';
import { authorsParams } from 'modules/Admin/helpers';
import { NTRO_SUBTYPES } from 'config/general';

export const AuthorsSection = ({ disabled = false }) => {
    const { record } = useRecordContext();

    const { getValues } = useFormContext();
    const subtype = getValues('adminSection.rek_subtype');

    const isNtro = NTRO_SUBTYPES.includes(subtype);

    const cards = useRef(adminInterfaceConfig[record.rek_display_type].authors?.(authorsParams(record, isNtro)));

    return <Section cards={cards.current} disabled={disabled} isNtro={isNtro} />;
};

AuthorsSection.propTypes = {
    disabled: PropTypes.bool,
};

export default React.memo(AuthorsSection);
