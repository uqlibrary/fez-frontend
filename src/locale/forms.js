import React from 'react';

export default {
    forms: {
        claimPublicationForm: {
            title: 'Claim a work',
            cancel: 'Cancel this claim',
            submit: 'Claim this work',
            publicationLoading: 'Loading work to claim',
            claimingInformation: {
                title: 'You are claiming to be an author for the following work:',
            },
            authorLinking: {
                title: 'Author linking',
                text:
                    'We were unable to automatically detect who you are from the list of authors ' +
                    'on this work. Please select your name from the list below: ',
            },
            contributorLinking: {
                title: 'Editor linking',
                text:
                    'We were unable to automatically detect who you are from the list of editors ' +
                    'on this work. Please select your name from the list below: ',
            },
            contentIndicators: {
                help: {
                    title: 'Content Indicators',
                    text: (
                        <p>
                            For more information about content indicators, click{' '}
                            <a
                                style={{ fontWeight: 700 }}
                                target="_blank"
                                rel="noreferrer"
                                href="https://guides.library.uq.edu.au/research-and-teaching-staff/uqespace-publications-datasets/content-indicators"
                            >
                                here
                            </a>
                        </p>
                    ),
                    buttonLabel: 'CLOSE',
                },
                title: 'Optional: Content Indicators',
                description:
                    'If relevant to your work, you can select multiple content indicators to ' +
                    'add more information about your work, but you cannot remove indicators already selected. ' +
                    'To amend existing information, Suggest changes above.',
                label: 'Add any relevant indicator(s).',
            },
            comments: {
                title: 'Optional: Suggest changes or add links to this work',
                fieldLabels: {
                    comments: 'Type changes or comments here',
                    url: 'Link (URL)',
                },
            },
            fileUpload: {
                title: 'Optional: Upload additional files',
            },
            cancelWorkflowConfirmation: {
                confirmationTitle: 'Cancel claiming a work',
                confirmationMessage: 'Are you sure you want to cancel claiming this work?',
                cancelButtonLabel: 'No',
                confirmButtonLabel: 'Yes',
            },
            successWorkflowConfirmation: {
                confirmationTitle: 'Claim has been submitted',
                successConfirmationMessage: (
                    <span style={{ display: 'block', margin: '1em 0' }}>
                        Your item will be referred to a UQ eSpace Staging staff member for editing, prior to being moved
                        into a publicly viewable collection.
                    </span>
                ),
                fileFailConfirmationAlert: {
                    title: 'File upload and/or edits/changes/comments post failed',
                    message: 'Retry via "Fix work" screen or contact eSpace administrators.',
                    type: 'warning',
                },
                cancelButtonLabel: 'Claim more works',
                addRecordButtonLabel: 'Add another missing work',
                confirmButtonLabel: 'Go to my works',
                alternateActionButtonLabel: 'Fix work',
            },
            validationAlert: {
                type: 'warning',
                title: 'Validation',
                message: 'Form cannot be submitted until all fields are valid. Please review all input fields.',
            },
            errorAlert: {
                type: 'error_outline',
                title: 'Error',
                message: message => (
                    <>
                        Error has occurred during request and request cannot be processed.
                        <p>
                            {message.split('\n').map((item, key) => {
                                return (
                                    <span key={key}>
                                        {item}
                                        <br />
                                    </span>
                                );
                            })}
                        </p>
                        <p>Please contact eSpace administrators or try again later if applicable.</p>
                    </>
                ),
                incompleteData:
                    'The selected source has incomplete data. You will need to ADD A MISSING ' +
                    'RECORD and enter the information manually.',
            },
            progressAlert: {
                type: 'info_outline',
                title: 'Saving',
                message: 'Claim publication is being processed.',
                showLoader: true,
            },
            successAlert: {
                type: 'done',
                title: 'Success',
                message: 'Publication claim has been submitted successfully.',
            },
            alreadyClaimedAlert: {
                type: 'error',
                title: 'Error',
                message: (
                    <span>
                        This work has been assigned to you already. If you feel this is incorrect, please notify the
                        eSpace admin team at <a href="mailto:espace@library.uq.edu.au">espace@library.uq.edu.au</a>
                    </span>
                ),
            },
        },
        unclaimPublicationForm: {
            title: 'Remove this work from my profile',
            description: '',
            successWorkflowConfirmation: {
                confirmationTitle: 'Unclaim a work',
                confirmationMessage: 'You have unclaimed this work successfully',
                cancelButtonLabel: 'Go to my dashboard',
                confirmButtonLabel: 'Go to my works',
            },
            alert: {
                type: 'warning',
                title: 'WARNING',
                message: 'You are about to remove this work from your eSpace profile.',
            },
        },
        fixPublicationForm: {
            contentIndicators: {
                help: {
                    title: 'Content Indicators',
                    text: (
                        <p>
                            For more information about content indicators, click{' '}
                            <a
                                style={{ fontWeight: 700 }}
                                target="_blank"
                                rel="noreferrer"
                                href="https://guides.library.uq.edu.au/research-and-teaching-staff/uqespace-publications-datasets/content-indicators"
                            >
                                here
                            </a>
                        </p>
                    ),
                    buttonLabel: 'CLOSE',
                },
                title: 'Optional: Content Indicators',
                description:
                    'If relevant to your work, you can select multiple content indicators to add more ' +
                    'information about your work, but you cannot remove indicators already selected. ' +
                    'To amend existing information, Suggest a correction above.',
                label: 'Add any relevant indicator(s).',
            },
            comments: {
                title: 'Suggest a correction',
                fieldLabels: {
                    comments: 'Type changes or comments here',
                    url: 'Link (URL)',
                },
            },
            fileUpload: {
                title: 'Upload files',
                description: <div>Upload an Open Access file, HERDC evidence or an NTRO Research Statement</div>,
            },
            cancelWorkflowConfirmation: {
                confirmationTitle: 'Cancel request',
                confirmationMessage: 'Are you sure you want to cancel this request?',
                cancelButtonLabel: 'No',
                confirmButtonLabel: 'Yes',
            },
            successWorkflowConfirmation: {
                confirmationTitle: 'Your request has been submitted',
                confirmationMessage: (
                    <span style={{ display: 'block', margin: '1em 0' }}>
                        Your request will be referred to a UQ eSpace staff member for review/action.
                    </span>
                ),
                fileFailConfirmationAlert: {
                    title: 'File upload failed',
                    message: 'Retry via "Fix work" screen or contact eSpace administrators.',
                    type: 'info',
                },
                cancelButtonLabel: 'Go to my dashboard',
                confirmButtonLabel: 'Go to my works',
            },
            validationAlert: {
                type: 'warning',
                title: 'Validation',
                message: 'Form cannot be submitted until all fields are valid. Please review all input fields.',
            },
            errorAlert: {
                type: 'error_outline',
                title: 'Error',
                message: message =>
                    `Error has occurred during request and request cannot be processed. ${message} Please contact eSpace administrators or try again later.`,
            },
            progressAlert: {
                type: 'info_outline',
                title: 'Saving',
                message: 'Request is being processed.',
                showLoader: true,
            },
            successAlert: {
                type: 'done',
                title: 'Success',
                message: 'Fix work request has been submitted successfully.',
            },
        },
        deleteRecordForm: {
            reason: {
                title: isDeleted => (
                    <>
                        Describe the reason to {isDeleted ? 'update' : 'delete'} this work
                        <div style={{ fontSize: '60%' }}>
                            (visible to admins only, displayed under view record page's history)
                        </div>
                    </>
                ),
                label: isDeleted =>
                    `Please enter a reason why you are ${isDeleted ? 'updating' : 'deleting'} this work`,
            },
            doiResolutionUrl: {
                title: (
                    <>
                        New Location
                        <div style={{ fontSize: '60%' }}>
                            (default to https://web.library.uq.edu.au/record-unavailable if left blank)
                        </div>
                    </>
                ),
                label: 'Please enter the URL to which the DOI would resolve to',
                placeholder: 'Enter a valid URL (e.g. https://espace.library.uq.edu.au/view/UQ:12345)',
            },
            newDoi: {
                title: (
                    <>
                        New DOI
                        <div style={{ fontSize: '60%' }}>(displayed on the records deleted page)</div>
                    </>
                ),
                label: 'Please enter the DOI to which the record moved to',
                placeholder: 'Enter a valid DOI (e.g. 10.123/456)',
            },
            notes: {
                title: (
                    <>
                        Deletion Notes
                        <div style={{ fontSize: '60%' }}>(displayed on the records deleted page)</div>
                    </>
                ),
                label: 'Please enter deletion notes',
            },
            cancelWorkflowConfirmation: {
                confirmationTitle: 'Cancel delete',
                confirmationMessage: 'Are you sure you want to cancel delete this work?',
                cancelButtonLabel: 'No',
                confirmButtonLabel: 'Yes',
            },
            successWorkflowConfirmation: {
                confirmationTitle: 'Work has been deleted',
                confirmationMessage: <span style={{ display: 'block', margin: '1em 0' }} />,
                cancelButtonLabel: 'Go to search page',
                confirmButtonLabel: 'Go back to view page',
            },
            uqDoiAlert: {
                message: pid =>
                    `This pid ${pid} cannot be deleted because it has a UQ DOI attached. Remove the DOI from this work first before deleting. If this work is the original source of the DOI, it must also be be de-activated on Crossref.`,
            },
            validationAlert: {
                type: 'warning',
                title: 'Validation',
                message: 'Form cannot be submitted until all fields are valid. Please review all input fields.',
            },
            errorAlert: {
                type: 'error_outline',
                title: 'Error',
                message: message =>
                    `Error has occurred during request and request cannot be processed. ${message}. Please contact eSpace administrators or try again later.`,
            },
            errorCustom: {
                communityCollection: [
                    {
                        httpStatus: 409,
                        message: rekType =>
                            `Error occurred during request and request cannot be processed. The ${rekType} contains ${
                                rekType === 'Community' ? 'Collections' : 'records'
                            } that must be manually unlinked first.`,
                    },
                ],
            },
            progressAlert: {
                type: 'info_outline',
                title: 'Deleting',
                message: 'Request is being processed.',
                showLoader: true,
            },
            successAlert: {
                type: 'done',
                title: 'Success',
                message: 'Work has been deleted',
            },
        },
        feedbackRecord: {
            introduction: (
                <span>
                    <p>Thank you for contributing more information about this collection item.</p>
                    <p>
                        This form is part of our commitment to{' '}
                        <a
                            target="_blank"
                            href={
                                'https://web.library.uq.edu.au/find-and-borrow/collections-overview/using-culturally-sensitive-collections'
                            }
                        >
                            culturally sensitive collections
                        </a>
                        {'.'}
                    </p>
                </span>
            ),
            feedbackTypes: {
                title: 'I would like to',
                options: [
                    { label: 'Provide feedback / suggestion /information for this record', value: 'feedback' },
                    { label: 'Share a story about this material', value: 'story' },
                    { label: 'Advise of cultural sensitivity / make a takedown request', value: 'takedown' },
                ],
            },
            details: {
                title: 'Your Details',
                firstName: 'First Name',
                lastName: 'Last Name',
                contactDetail: 'Contact Detail (Email or Contact Number)',
                community: 'Community',
                shareDetails: {
                    options: [
                        { label: 'I’d like to share my details with UQ Library', value: '1' },
                        { label: 'I’d like to share my feedback anonymously', value: '0' },
                    ],
                    default: '1',
                },
            },
            indigenousIdentity: {
                title: 'Do you identify as an Aboriginal and / or Torres Strait Islander person?',
                options: [
                    { label: 'Yes, Aboriginal', value: 'aboriginal' },
                    { label: 'Yes, Torres Strait Islander', value: 'islander' },
                    { label: 'Both, Aboriginal and Torres Strait Islander', value: 'both' },
                    { label: 'No', value: 'no' },
                ],
            },
            hasKinshipConnection: {
                title: 'Do you have a kinship connection to this item?',
                options: [
                    { label: 'Yes', value: '1' },
                    { label: 'No', value: '0' },
                ],
            },
            isICIPHolder: {
                title: 'Are you the Indigenous Cultural Intellectual Property (ICIP) rightsholders for the item?',
                options: [
                    { label: 'Yes', value: '1' },
                    { label: 'No', value: '0' },
                ],
                helpPanel: {
                    title: 'Indigenous Cultural and Intellectual Property (ICIP)',
                    text: (
                        <>
                            <p>
                                ICIP includes all aspects of cultural practices, traditional knowledge, resources, and
                                knowledge systems developed by Aboriginal and Torres Strait Islander peoples as part of
                                their Indigenous Identity. (
                                <a target={'_blank'} href={'https://www.terrijanke.com.au/icip'}>
                                    Terri Janke and Company (2022)
                                </a>
                                {')'}
                            </p>
                        </>
                    ),
                    buttonLabel: 'Close',
                },
            },
            communityParticipant: {
                title:
                    'Do you consent to your name being included as a Community Participant in the UQ Library Aboriginal and Torres Strait Islander Community Feedback database?',
                options: [
                    { label: 'Yes', value: '1' },
                    { label: 'No, I would like to remain anonymous', value: '0' },
                ],
            },
            communityInfo: {
                title: 'Do you have more information on this item?',
                subTitle: 'This may include Country, Community, or Language, found in the item.',
            },
            relatedPeople: {
                title: 'Have you identified any people, language and/or place in this item?',
                subTitle: 'If yes, please provide their name and any known information.',
            },
            story: {
                title: 'Would you like to share a story or provide more context about this item?',
            },
            culturalInfo: {
                title: 'Does the item contain cultural information that is secret/sacred or sensitive?',
                options: [
                    { label: 'Mens Business', value: 'mensBusiness' },
                    { label: 'Womens Business', value: 'womensBusiness' },
                    { label: 'Sacred sites', value: 'sacredSites' },
                    { label: 'Ceremonies', value: 'ceremonies' },
                    { label: 'Other', value: 'other', appendTextField: true },
                ],
            },
            specialCare: {
                title: 'Does the item need to be managed with special care?',
                options: [
                    { label: 'No - The item does not contain sensitive material', value: 'no' },
                    { label: 'Yes - A warning should be added', value: 'requireWarning' },
                    { label: 'Yes - Only Men should view', value: 'menOnly' },
                    { label: 'Yes - Only Women should view', value: 'womenOnly' },
                    { label: 'Yes - Community must approve access to view this item', value: 'communityApproval' },
                    { label: 'Other', value: 'other', appendTextField: true },
                ],
            },
            acknowledgement: {
                title: 'UQ Library is grateful for your assistance in caring for our collections',
                subTitle: 'If attributing your contribution, how would you like to be acknowledged:',
                options: [
                    { label: 'Public Acknowledgement of my name on the record', value: 'public' },
                    { label: 'Private Acknowledgement of my name in the Library’s records', value: 'private' },
                    { label: 'Anonymous information provided by a guest', value: 'anonymous' },
                ],
                disclaimer:
                    'The personal information on this form is requested in order to obtain your consent for the use as outlined above. The information will be used by UQ for the purpose of verifying that proper consent has been provided in accordance with the Information Privacy Act 2009 and UQ’s Privacy Management Policy and Procedures (PPL1.60.02). ',
            },
            validationAlert: {
                type: 'warning',
                title: 'Validation',
                message: 'Form cannot be submitted until all fields are valid. Please review all input fields.',
            },
            errorAlert: {
                type: 'error_outline',
                title: 'Error',
                message: message =>
                    `Error has occurred during request and request cannot be processed. ${message} Please contact eSpace administrators or try again later.`,
            },
            progressAlert: {
                type: 'info_outline',
                title: 'Saving',
                message: 'Request is being processed.',
                showLoader: true,
            },
            successAlert: {
                type: 'done',
                title: 'Success',
                message: 'Feedback has been submitted successfully.',
            },
            cancelWorkflowConfirmation: {
                confirmationTitle: 'Cancel request',
                confirmationMessage: 'Are you sure you want to cancel this request?',
                cancelButtonLabel: 'No',
                confirmButtonLabel: 'Yes',
            },
            successWorkflowConfirmation: {
                confirmationTitle: 'Your feedback has been submitted',
                confirmationMessage: (
                    <span style={{ display: 'block', margin: '1em 0' }}>
                        Thank you for submitting information about this record. A team member will action this as soon
                        as possible.
                    </span>
                ),
                confirmButtonLabel: 'Go to my dashboard',
                guestConfirmationButtonLabel: 'Go to homepage',
                cancelButtonLabel: 'Go back to view page',
            },
            cancel: 'Cancel',
            submit: 'Submit',
        },
    },
};
