import React from 'react';

export default {
    forms: {
        claimPublicationForm: {
            title: 'Claim a publication',
            cancel: 'Cancel this claim',
            submit: 'Claim this publication',
            claimingInformation: {
                title: 'You are claiming to be an author for the following item:',
                help: {
                    title: 'Claiming a publication',
                    text: 'Enter the text that will help people here',
                    buttonLabel: 'OK'
                }
            },
            authorLinking: {
                title: 'Author linking',
                text: 'We were unable to automatically detect who you are from the list of authors on this publication. Please select your name from the list below: ',
                help: {
                    title: 'Author linking',
                    text: '...',
                    buttonLabel: 'OK'
                }
            },
            contributorLinking: {
                title: 'Editor linking',
                text: 'We were unable to automatically detect who you are from the list of editors on this publication. Please select your name from the list below: ',
                help: {
                    title: 'Editor linking',
                    text: '...',
                    buttonLabel: 'OK'
                }
            },
            comments: {
                title: 'Optional: Suggest changes or add links to this record',
                help: {
                    title: 'Additional information',
                    text: '...',
                    buttonLabel: 'OK'
                },
                fieldLabels: {
                    comments: 'Type edits/changes/comments here',
                    url: 'Link (URL)'
                }
            },
            fileUpload: {
                title: 'Optional: Upload additional files',
                help: {
                    title: 'Files',
                    text: '...',
                    buttonLabel: 'OK'
                }
            },
            cancelWorkflowConfirmation: {
                confirmationTitle: 'Cancel claiming a publication',
                confirmationMessage: 'Are you sure you want to cancel claiming this publication?',
                cancelButtonLabel: 'No',
                confirmButtonLabel: 'Yes'
            },
            successWorkflowConfirmation: {
                confirmationTitle: 'Claim has been submitted',
                successConfirmationMessage: (
                    <p>
                        Your item will be referred to a UQ eSpace Staging staff member for editing, prior to being moved into a publicly viewable collection.
                    </p>),
                fileFailConfirmationAlert: {
                    title: 'File upload failed',
                    message: 'Retry uploading files via "Fix record" screen or contact eSpace administrators.',
                    type: 'info'
                },
                cancelButtonLabel: 'Claim more publications',
                addRecordButtonLabel: 'Add another missing record',
                confirmButtonLabel: 'Go to my research'
            },
            validationAlert: {
                type: 'warning',
                title: 'Validation',
                message: 'Form cannot be submitted until all fields are valid. Please review all input fields.'
            },
            errorAlert: {
                type: 'error_outline',
                title: 'Error',
                message: (message) => (`Error has occurred during request and request cannot be processed. ${message} Please contact eSpace administrators or try again later.`)
            },
            progressAlert: {
                type: 'info_outline',
                title: 'Saving',
                message: 'Claim publication is being processed.'
            },
            successAlert: {
                type: 'done',
                title: 'Success',
                message: 'Publication claim has been submitted successfully.'
            },
            alreadyClaimedAlert: {
                type: 'error',
                title: 'Error',
                message: 'This record has been assigned to you already.  If you feel this is incorrect, please notify the eSpace admin team at espace.admin@email.com.au'
            },
        },
        unclaimPublicationForm: {
            title: 'Remove this record from my profile',
            description: (<div>
                Some explanation about what this means etc, lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Morbi at neque eros. In et ligula quam.
                Etiam porttitor gravida tortor, eget ultrices duidolor sit amet, consectetur adipiscing elit. Morbi
                at neque eros. In et ligula quam. Etiam porttitor gravida tortor,
                eget ultrices dui onsectetur adipiscing elit. Morbi at neque eros. In et ligula quam. Etiam
                porttitor gravida tortor, eget ultrices dui scelerisque a.
            </div>),
            help: {
                title: 'Unclaim a record',
                text: 'Enter the text that will help people here',
                buttonLabel: 'OK'
            },
            successWorkflowConfirmation: {
                confirmationTitle: 'Unclaim a record',
                confirmationMessage: 'You have unclaimed record successfully',
                cancelButtonLabel: 'Go to my dashboard',
                confirmButtonLabel: 'Go to my research'
            },
            alert: {
                type: 'warning',
                title: 'WARNING',
                message: 'You are about to remove this publication from your eSpace profile.'
            }
        },
        fixPublicationForm: {
            comments: {
                title: 'Suggest a correction',
                help: {
                    title: 'Request a change',
                    text: '...',
                    buttonLabel: 'OK'
                },
                fieldLabels: {
                    comments: 'Describe the problem with this record, eg record is a duplicate, or suggested changes',
                    url: 'Link (URL)'
                }
            },
            fileUpload: {
                title: 'Upload files',
                description: (<div>
                    Upload an Open Access file, HERDC evidence or an NTRO Research Statement
                </div>),
                help: {
                    title: 'Upload files',
                    text: '...',
                    buttonLabel: 'OK'
                }
            },
            cancelWorkflowConfirmation: {
                confirmationTitle: 'Cancel request',
                confirmationMessage: 'Are you sure you want to cancel this request?',
                cancelButtonLabel: 'No',
                confirmButtonLabel: 'Yes'
            },
            successWorkflowConfirmation: {
                confirmationTitle: 'Your request has been submitted',
                confirmationMessage: (<p>Your request will be referred to a UQ eSpace staff member for review/action.</p>),
                fileFailConfirmationAlert: {
                    title: 'File upload failed',
                    message: 'Retry uploading files via "Fix record" screen or contact eSpace administrators.',
                    type: 'info'
                },
                cancelButtonLabel: 'Go to my dashboard',
                confirmButtonLabel: 'Go to my research'
            },
            validationAlert: {
                type: 'warning',
                title: 'Validation',
                message: 'Form cannot be submitted until all fields are valid. Please review all input fields.'
            },
            errorAlert: {
                type: 'error_outline',
                title: 'Error',
                message: (message) => (`Error has occurred during request and request cannot be processed. ${message} Please contact eSpace administrators or try again later.`)
            },
            progressAlert: {
                type: 'info_outline',
                title: 'Saving',
                message: 'Request is being processed.'
            },
            successAlert: {
                type: 'done',
                title: 'Success',
                message: 'Fix record request has been submitted successfully.'
            },
            failedAlert: {
                type: 'error',
                title: 'Failed',
                message: 'Fix record request has failed. Please try again, or contact the eSpace administrator.'
            }
        }
    }
};
