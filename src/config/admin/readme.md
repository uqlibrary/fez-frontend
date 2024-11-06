# Fez frontend Admin section notes

The Admin section of Fez is highly abstracted and can take an inordinate amount of time for new devs to work out the various parts fit together.
This document has been created in order to shed some light on certain parts of the Admin section, and should be considered a living document as more devs discover more details and add them here.

- eSpace production admin example URL <https://espace.library.uq.edu.au/admin/edit/UQ:af8e762>

## Preamble

The Admin Edit section is abstracted in to a hierarchy loosely fitting the below:

- `src/modules/Admin/containers/Admin.js` - high level functions for loading record data and where form values are assigned
- `src/modules/Admin/components/AdminContainer.js` - defines the overall JSX structure of an Admin page and the order of the Tabs within, and provides functions for moving around the UI
- `src/modules/Admin/components/AdminInterface.js` - renders the tabbed interface component and handles UI updates for submission of the form and the resulting success/failure state

## Anatomy of an Admin Edit page

An Admin Edit page is constructed using of one or more fields available in the folder `src/modules/Admin/fields`. Each new "page" is defined by a config file that the dev creates to describe the fields they want to see, for example:

`src/config/admin/fields/collectionFields.js`

```
import commonFields from './commonFields';

export default {
    ...commonFields,
    bibliographic: () => [
        {
            title: 'Collection Title',
            groups: [['rek_title']],
        },
        {
            title: 'Collection Description',
            groups: [['rek_description']],
        },
        {
            title: 'Keyword(s)',
            groups: [['fez_record_search_key_keywords']],
        },
    ],
    notes: () => [
        {
            title: 'Additional notes',
            groups: [['additionalNotes']],
        },
        {
            title: 'Internal notes',
            groups: [['internalNotes']],
        },
    ],
    admin: () => [
        {
            title: 'Member of Communities',
            groups: [['communities']],
        },
    ],
};

export const validateCollection = () => ({});
```

Here we see a config file for a collection of fields that will define the appearance of an Admin Edit page.
At the top we import `commonFields`. This file includes several sections of a typical admin page in a similar structure to the above, and is meant as a time saver for common UI functionality (NB: it is not necessary to _always_ include this file if it's not required - see `src/config/admin/fields/communityFields.js` for an example).

After `commonFields` we define the specific sections we'd like to have on our page. It's important to note here that the tab names ("bibliographical", "notes", "admin") are keys and therefore have to match exactly what the system expects. There are more key sections beyond what is shown here as can be seen in `src/modules/Admin/components/AdminContainer.js` in the `AdminInterface` component's `tab` property.
Also important to recognise is that each section is a function - code elsewhere will attempt to call each section as a function so this structure must be adhered to.

Within each tab section we define the order of fields/components to show in our page. Of particular note here is the `groups` property, whose values directly map to definitions in `src/config/admin/fieldConfig.js`. Thus, if you are creating a new field type, you must define the field in fieldConfig.js in order for it to be useable in a page config structure as shown above. See more on [groups](#groups) below.

Each collection of fields as per above should define a validation function (`validateCollection`) at the end. It is not always necessary - as here - to define anything within the function if you expect most validation to happen organically with the fields you are using, however if you have a particularly complicated page structure where one component's value may depend upon another’s then you will need to use the validation function in order to ensure this relationship.

Now that you have a definition for how the Admin Edit page should look, be sure to check the tabs defined in `src/modules/Admin/components/AdminContainer.js` and confirm or update any conditional statements around each tab type so that your particular _record type_ that you intend to edit will be considered. Typically a record type of `RECORD_TYPE_RECORD` will be included without further work but study the code, as there are expectations that you should be aware of. All Record types can be found in `src/config/general.js`.

If you were to check your new Admin Edit page now you should see your fields appearing as expected, however if you've created new fields there's a good chance there'll be no values pre-populating from your record. 
To fix this, head to `src/config/admin/valueExtractor.js` and create a definition for the name of your new field ensuring the names match. This file defines the relationship between a field and the actual Record key/value and it's here where `src/modules/Admin/containers/Admin.js` (`getInitialValues` function) will populate your field. Also be sure to check `src/modules/Admin/containers/Admin.js`, specifically the `getInitialFormValues` function, as it is from here where `valueExtractor` is called.

Finally, if you're _not_ using the commonField sections, or if you only required a subsection, you may discover your Admin Edit page is showing an error message referring to fields you aren't using. This is because certain sections were hard coded in to the system as requiring validation and as such, all new Admin Edit pages will likely run afoul of this issue.
To fix, open up `src/config/admin/validate.js` and include a new section in the main `switch` block for your field. For example the record type `RECORD_TYPE_COMMUNITY_ID` did not require an admin section or a `files` section, and so these were deleted from the general validation object in the `switch` block to remove the error messages. Remember to include your record type if it's not already available, and your page config's `validation<Name>` method.


### Groups

It's important to understand how the naming of groups affects the data being sent to an API.

Here's an example section declaration for an admin form:

```
notes: () => [
    {
        title: 'Reason for Edit',
        groups: [['reasonForEdit']],
    },
],
```

The `groups` value in this example has been named as `reasonForEdit`, and this corresponds directly to a definition in the `fieldConfig.js` file as previously discussed:

```
reasonForEdit: {
    component: GenericTextField,
    componentProps: {
        textFieldId: 'reasonForEdit',
        name: 'notesSection.reasonForEdit',
        fullWidth: true,
        label: 'Reason for Edit (optional - will be added to object history)',
        placeholder: 'Reason for Edit',
    },
},
```
It's important to note that the value used in the group `reasonForEdit` not only must have a corresponding field declaration, but also that this value will be used as the key name in the data value sent to an API.

In the field declaration be sure to accurately enter the `name` field. In the above example we have `notesSection.reasonForEdit`, and the first part `notesSection` corresponds to one of the standard keys for an admin section. A misspelling here will result in a new key being entered in to the API object, and potentially introducing bugs in your code.

For example, a slight misspelling could result in a data structure such as the following:

```
noteSection: {
    reasonForEdit: "this is a reason"
},
notesSection: {
    internalNotes: {plainText: undefined, htmlText: undefined}, reasonForEdit: ""
}
```
when what you wanted was:

```
notesSection: {
    internalNotes: {plainText: undefined, htmlText: undefined},
    reasonForEdit: "this is a reason"
}
```
Finally, be mindful of the second part of your field's name. In the example above it is notesSection.`reasonForEdit`, however a misspelling here will also result in an undesirable data structure:

```
notesSection: {
    internalNotes: {plainText: undefined, htmlText: undefined},
    reason-edit: "this is a reason",
    reasonForEdit: ""
```



## Submitting to an API

Currently all Admin Edit form requests are channeled through a single `submitHandler` found in `src/modules/Admin/submitHandler/index.js`. If you are working with a record type that is not the default `RECORD_TYPE_RECORD` then you will likely need to look at this file, in particular the switch statement within.

Ultimately the `submitHandler` will fire a function you have created in `src/actions/records.js` via a Redux action that you have defined in `src/actions/actionTypes.js`, to handle the actual submission to the API point; be sure to add your new route to `src/repositories/routes.js` in order for the API call to succeed.

### Note ###
Before your submit request is fired, all data being sent will be passed through a _transformer_ function that will take the data provided and transform it in to a version of the data that the API will accept. The call originates in the `src/actions/records.js` file, with the exact name/location depending upon the section you are working on e.g. if _updating_ a record through the admin interface, the `adminUpdate` will be called and from here `getAdminRecordRequest`; this latter function being responsible for calling the actual transformers.

Transformers are defined in the `src/actions/transformers.js` file, and if you are using non-standard names for your components/fields then you'll want to update this file in order to transform the name you are using to a name the API is expecting.

In the above example:

```
reasonForEdit: {
    component: GenericTextField,
    componentProps: {
        textFieldId: 'reasonForEdit',
        name: 'notesSection.reasonForEdit',
        fullWidth: true,
        label: 'Reason for Edit (optional - will be added to object history)',
        placeholder: 'Reason for Edit',
    },
},
```

the name of the field in the API request would take the name of the component, here `reasonForEdit`. Using a transformer function this can be changed to suit the API:

```
export const getReasonSectionSearchKeys = (data = {}) => {
    const { reasonForEdit } = data;
    return {
        ...(!!reasonForEdit ? { reason: reasonForEdit } : {}),
    };
};
```

where the actual name of the data being sent has been transformed to `reason`.
Likewise if you add a new field to an existing selection, e.g. `adminSection`, be sure to update the appropriate transformer function (e.g. `getAdminSectionSearchKeys`) to handle the desired data mapping.
