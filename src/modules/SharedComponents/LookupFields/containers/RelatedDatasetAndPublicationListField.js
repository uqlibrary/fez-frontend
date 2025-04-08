import React from 'react';
import { LookupListEditor } from 'modules/SharedComponents/Toolbox/ListEditor';
import { TitleOrPidField } from './TitleOrPidField';

export const RelatedDatasetAndPublicationListField = fieldProps => {
    return (
        <LookupListEditor
            inputField={TitleOrPidField}
            errorText={fieldProps.meta ? fieldProps.meta.error : null}
            transformFunction={(searchKey, item, index) => ({
                [searchKey.value]: item.id,
                [searchKey.order]: index + 1,
            })}
            {...fieldProps}
        />
    );
};
