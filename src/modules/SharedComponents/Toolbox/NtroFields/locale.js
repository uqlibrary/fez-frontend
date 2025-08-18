import React from 'react';
import Typography from '@mui/material/Typography';

export default {
    contributionStatement: {
        title: 'Author/Creator research statement',
        fields: {
            scaleOfWork: {
                label: 'Scale/Significance of work',
                description: (
                    <span>
                        Select the option that best describes the significance of the work*
                        <span style={{ fontWeight: 700 }}> (not for public view)</span>
                    </span>
                ),
            },
            impactStatement: {
                label: (
                    <span>
                        Creator research statement*. Include Background, Contribution and Significance
                        <span style={{ fontWeight: 700 }}> (not for public view)</span>
                    </span>
                ),
                placeholder:
                    'Remember to include substantiation of your major or minor scale/significance claim above.',
            },
        },
        help: {
            title: 'Author/Creator research statement',
            text: (
                <React.Fragment>
                    <Typography component="h4" variant="h6">
                        Creator research statement
                    </Typography>
                    <p>
                        For more information about the research statement, click{' '}
                        <a
                            style={{ fontWeight: 700 }}
                            target="_blank"
                            href="https://guides.library.uq.edu.au/research-and-teaching-staff/uqespace-publications-datasets/submission-data-requirements#s-lg-box-20836548"
                        >
                            here
                        </a>
                    </p>
                </React.Fragment>
            ),
            buttonLabel: 'CLOSE',
        },
    },
    metadata: {
        title: 'NTRO data',
        fields: {
            abstract: {
                label: (
                    <span>
                        Abstract/Description* <span style={{ fontWeight: 700 }}>(for public view)</span>
                    </span>
                ),
                placeholder: 'Enter a brief description of the work - 800 character limit is no longer applicable',
            },
            series: {
                floatingLabelText: 'Series',
                hintText: 'Enter the name of publication, performance, recording, or event series',
            },
            volume: {
                label: 'Volume',
            },
            issue: {
                label: 'Issue',
            },
            startPage: {
                label: 'Start page',
            },
            endPage: {
                label: 'End page',
            },
            extent: {
                label: 'Total pages/Extent',
                placeholder: 'Total pages, size, or duration',
            },
            physicalDescription: {
                label: 'Physical description',
                placeholder: 'e.g Building, Exhibit, Performance',
            },
            audienceSize: {
                label: 'Audience size',
            },
            peerReviewActivity: {
                label: 'Quality indicators',
            },
            notes: {
                label: 'Notes',
            },
            language: {
                label: 'Language',
                selectPrompt: 'Please select languages as required',
            },
        },
    },
    grantEditor: {
        title: 'Grant details',
    },
};
