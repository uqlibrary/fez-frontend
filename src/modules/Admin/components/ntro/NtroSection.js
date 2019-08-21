import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { Section } from '../common/Section';
import { useRecordContext } from 'context';
import { adminInterfaceConfig } from 'config/adminInterface';

// import Immutable from 'immutable';
// import Grid from '@material-ui/core/Grid';
// import Typography from '@material-ui/core/Typography';
// import MenuItem from '@material-ui/core/MenuItem';

// import { SelectField } from 'modules/SharedComponents/Toolbox/SelectField';
// import { RichEditorField } from 'modules/SharedComponents/RichEditor';
// import { TextField as GenericTextField } from 'modules/SharedComponents/Toolbox/TextField';

// import { refereedsources, openaccess, qindex } from '../MockData';
// import { validation } from 'config';
// import locale from 'locale/components';
// import { languages } from '../MockData';

export const NtroSection = ({ disabled = false }) => {
    const { record } = useRecordContext();
    const cards = useRef(adminInterfaceConfig[record.rek_display_type].ntro());

    return <Section cards={cards} disabled={disabled} />;
};
/* istanbul ignore next */
// export const AdminSection = ({ disabled }) => (
//     <Grid container spacing={8}>
//         <Grid item xs={12} sm={12}>
//             <Typography variant="body2" component="p">
// 				Some explanatory text might go here. It may not. Time will tell.
//             </Typography>
//         </Grid>
//         <Grid item xs={12} sm={4}>
//             <Field
//                 component={SelectField}
//                 name="refsource"
//                 label="Refereed Source"
//                 required
//                 placeholder=""
//                 disabled={disabled}
//             >
//                 <MenuItem value="" disabled>
// 					Please select a source
//                 </MenuItem>
//                 {refereedsources.map((item, index) => {
//                     return (
//                         <MenuItem key={index} value={item.value}>
//                             {item.label}
//                         </MenuItem>
//                     );
//                 })}
//             </Field>
//         </Grid>
//         <Grid item xs={12} sm={4}>
//             <Field
//                 component={SelectField}
//                 name="openaccessstatus"
//                 label="Open access status"
//                 required
//                 placeholder=""
//                 disabled={disabled}
//             >
//                 <MenuItem value="" disabled>
// 					Please select a status
//                 </MenuItem>
//                 {openaccess.map((item, index) => {
//                     return (
//                         <MenuItem key={index} value={item.value}>
//                             {item.label}
//                         </MenuItem>
//                     );
//                 })}
//             </Field>
//         </Grid>

//         <Grid item xs={12} sm={4}>
//             <Field
//                 component={GenericTextField}
//                 disabled={disabled}
//                 name="succeeds"
//                 fullWidth
//                 label="Succeeds"
//                 placeholder="PID of succeeded record"
//             />
//         </Grid>
//         <Grid item xs={12} sm={4}>
//             <Field
//                 component={SelectField}
//                 disabled={disabled}
//                 name="qindexcode"
//                 label="Research Code (Q-Index code)"
//                 required
//                 placeholder=""
//             >
//                 <MenuItem value="" disabled>
// 					Please select a code
//                 </MenuItem>
//                 {qindex.map((item, index) => {
//                     return (
//                         <MenuItem key={index} value={item.value}>
//                             {item.label}
//                         </MenuItem>
//                     );
//                 })}
//             </Field>
//         </Grid>
//         <Grid item xs={12} sm={4}>
//             <Field
//                 component={SelectField}
//                 disabled={disabled}
//                 name="qindexcodestatus"
//                 label="Research Code status"
//                 required
//                 placeholder=""
//             >
//                 <MenuItem value="" disabled>
// 					Please select a status
//                 </MenuItem>
//                 <MenuItem value={1}>Confirmed code</MenuItem>
//                 <MenuItem value={2}>Provisional code</MenuItem>
//             </Field>
//         </Grid>
//         <Grid item xs={12} sm={4}>
//             <Field
//                 component={SelectField}
//                 disabled={disabled}
//                 name="inststatus"
//                 label="Institutional status"
//                 placeholder=""
//             >
//                 <MenuItem value="" disabled>
// 					Please select a status
//                 </MenuItem>
//                 <MenuItem value={1}>UQ</MenuItem>
//                 <MenuItem value={2}>Non-UQ</MenuItem>
//                 <MenuItem value={3}>Unknown</MenuItem>
//             </Field>
//         </Grid>
//         <Grid item xs={12}>
//             <Typography variant="caption" component="span" style={{ opacity: 0.66 }}>
// 				Additional notes
//             </Typography>
//             <Field
//                 component={RichEditorField}
//                 disabled={disabled}
//                 name="notes"
//                 height={100}
//                 format={(value) => Immutable.Map(value)}
//                 validate={[validation.required]}
//             />
//         </Grid>
//         <Grid item xs={12}>
//             <Typography variant="caption" component="span" style={{ opacity: 0.66 }}>
// 				Internal notes
//             </Typography>
//             <Field
//                 component={RichEditorField}
//                 disabled={disabled}
//                 name="internalnotes"
//                 format={(value) => Immutable.Map(value)}
//                 height={100}
//                 validate={[validation.required]}
//             />
//         </Grid>
//     </Grid>
// );

// NtroSection.propTypes = {
//     disabled: PropTypes.bool
// };

// export default React.memo(NtroSection);

NtroSection.propTypes = {
    disabled: PropTypes.bool,
};

export default React.memo(NtroSection);
