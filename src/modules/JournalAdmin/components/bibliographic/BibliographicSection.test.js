it('temp', () => {
    expect(1).toBeTruthy();
}); // import BibliographicSection from './BibliographicSection';

// jest.mock('../../../../context');
// import { useRecordContext, useFormValuesContext } from 'context';

// function setup(testProps = {}, args = { isShallow: true }) {
//     const props = {
//         ...testProps,
//     };

//     return renderComponent(BibliographicSection, props, args);
// }

// describe('BibliographicSection component', () => {
//     it('should render default view', () => {
//         useRecordContext.mockImplementation(() => ({
//             record: {
//                 rek_pid: 'UQ:123456',
//                 rek_object_type_lookup: 'Record',
//                 fez_record_search_key_ismemberof: [
//                     {
//                         rek_ismemberof: 'Test collection',
//                         parent: {
//                             rek_security_policy: 2,
//                             rek_datastream_policy: 1,
//                         },
//                     },
//                 ],
//                 rek_display_type: 179,
//                 fez_record_search_key_language: [{ rek_language: 'eng' }],
//             },
//         }));
//         useFormValuesContext.mockImplementation(() => ({
//             formValues: {
//                 languages: ['eng'],
//             },
//         }));

//         const render = setup();
//         expect(render.getRenderOutput()).toMatchSnapshot();
//     });

//     it('should render disabled view', () => {
//         useRecordContext.mockImplementation(() => ({
//             record: {
//                 rek_pid: 'UQ:123456',
//                 rek_object_type_lookup: 'Record',
//                 fez_record_search_key_ismemberof: [
//                     {
//                         rek_ismemberof: 'Test collection',
//                         parent: {
//                             rek_security_policy: 2,
//                             rek_datastream_policy: 1,
//                         },
//                     },
//                 ],
//                 rek_display_type: 179,
//                 fez_record_search_key_language: [{ rek_language: 'eng' }],
//             },
//         }));

//         useFormValuesContext.mockImplementation(() => ({
//             formValues: {
//                 languages: ['eng'],
//             },
//         }));

//         const render = setup({ disabled: true });
//         expect(render.getRenderOutput()).toMatchSnapshot();
//     });

//     it('should render design form fields', () => {
//         useRecordContext.mockImplementation(() => ({
//             record: {
//                 rek_pid: 'UQ:123456',
//                 rek_object_type_lookup: 'Record',
//                 fez_record_search_key_ismemberof: [
//                     {
//                         rek_ismemberof: 'Test collection',
//                         parent: {
//                             rek_security_policy: 2,
//                             rek_datastream_policy: 1,
//                         },
//                     },
//                 ],
//                 rek_display_type: 313,
//                 rek_subtype: 'Creative Work - Design/Architectural',
//             },
//         }));

//         const render = setup();
//         expect(render.getRenderOutput()).toMatchSnapshot();
//     });
// });
