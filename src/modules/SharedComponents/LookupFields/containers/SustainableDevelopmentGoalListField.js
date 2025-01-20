import React from 'react';
import { LookupListEditor } from '../../Toolbox/ListEditor';
import SustainableDevelopmentGoalField from './SustainableDevelopmentGoalField';

export const SustainableDevelopmentGoalListField = fieldProps => {
    return (
        <LookupListEditor
            hideReorder
            listEditorId="sustainable-development-goal"
            inputField={SustainableDevelopmentGoalField}
            error={!!fieldProps.meta.error}
            errorText={fieldProps.meta.error}
            // inputNormalizer={item => {
            //     console.log('inputNormalizer', item);
            //     return item;
            // }}
            onChange={fieldProps.input?.onChange}
            // transformOutput={values => {
            //     console.log('transformOutput', values);
            //     return values;
            //     // return [
            //     //     ...values.sort((a, b) => {
            //     //         dd(
            //     //             `${a.rek_value.sdgCVOId} > ${b.rek_value.sdgCVOId} ? ${a.rek_value.sdgCVOId >
            //     //                 b.rek_value.sdgCVOId}`,
            //     //         );
            //     //         return a.rek_value.sdgCVOId > b.rek_value.sdgCVOId;
            //     //     }),
            //     // ];
            // }}
            {...fieldProps}
        />
    );
};
