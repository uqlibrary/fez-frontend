import React from 'react';
import {default as txt} from './components';

export default {
    cancel: 'Abandon and search again',
    submit: 'Submit for approval',
    publicationType: {
        title: 'Publication type',
        inputLabelText: 'Publication type',
        hintText: 'Select a publication type from the dropdown list',
        // help: {
        //     title: 'Publication type',
        //     text: 'Help about publication types, eg journal article, book, conference paper etc',
        //     buttonLabel: 'OK'
        // }
    },
    generic: {
        information: {
            title: 'Generic document information',
            // help: {
            //     title: 'General document information',
            //     text: 'Text...',
            //     buttonLabel: 'OK'
            // },
            fieldLabels: {
                documentTitle: {
                    label: 'Title',
                    placeholder: 'Title of generic document'
                },
                publicationPlace: {
                    label: 'Place of publication',
                    placeholder: ''
                },
                publisher: {
                    label: 'Publisher',
                    placeholder: ''
                },
                abstract: {
                    label: 'Abstract',
                    placeholder: 'Add a full article abstract here.'
                },
                date: {
                    title: 'Publication date',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year'
                }
            }
        },
        authors: txt.components.authors,
        optional: {
            title: 'Optional information',
            // help: {
            //     title: 'Optional Information',
            //     text: 'Text...',
            //     buttonLabel: 'OK'
            // },
            fieldLabels: {
                notes: {
                    label: 'Notes (not publicly viewable)',
                    placeholder: 'Add any additional information'
                },
                url: {
                    label: 'Link',
                    placeholder: 'Enter URL for this publication'
                }
            }

        }
    },
    journalArticle: {
        information: {
            title: 'Journal article information',
            // help: {
            //     title: 'Journal article information',
            //     text: 'some help',
            //     buttonLabel: 'OK'
            // },
            fieldLabels: {
                documentTitle: {
                    label: 'Title',
                    placeholder: 'Title of journal article'
                },
                journalTitle: {
                    label: 'Journal name',
                    placeholder: ''
                },
                date: {
                    title: 'Publication date',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year'
                },
                subtype: 'Publication subtype'
            }
        },
        authors: txt.components.authors,
        optional: {
            title: 'Optional publication details',
            // help: {
            //     title: 'Optional publication details',
            //     text: 'some help',
            //     buttonLabel: 'OK'
            // },
            fieldLabels: {
                volume: 'Volume',
                issue: 'Issue',
                startPage: 'Start page',
                endPage: 'End page',
                articleNumber: 'Article number',
                notes: 'Notes (not publicly viewable)',
                url: 'Link (URL)'
            }
        }
    },
    book: {
        information: {
            title: 'Book information',
            // help: {
            //     title: 'Book information',
            //     text: 'some help',
            //     buttonLabel: 'OK'
            // },
            fieldLabels: {
                bookTitle: 'Book title',
                subtype: 'Publication subtype',
                publicationPlace: 'Place of publication',
                publisher: 'Publisher',
                date: {
                    title: 'Date published',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year'
                }
            }
        },
        authors: txt.components.authors,
        editors: txt.components.editors,
        optional: {
            title: 'Optional publication details',
            // help: {
            //     title: 'Optional publication details',
            //     text: 'some help',
            //     buttonLabel: 'OK'
            // },
            fieldLabels: {
                articleNumber: 'Article number',
                notes: 'Notes (not publicly viewable)',
                url: 'Link (URL)'
            }
        }
    },
    bookChapter: {
        information: {
            title: 'Book chapter information',
            // help: {
            //     title: 'Book chapter information',
            //     text: 'some help',
            //     buttonLabel: 'OK'
            // },
            fieldLabels: {
                bookChapterTitle: 'Book chapter title',
                bookTitle: 'Book title',
                subtype: 'Publication subtype',
                publicationPlace: 'Place of publication',
                publisher: 'Publisher',
                date: {
                    title: 'Date published',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year'
                }
            }
        },
        authors: txt.components.authors,
        editors: txt.components.editors,
        other: {
            title: 'Other publication details',
            // help: {
            //     title: 'Other publication details',
            //     text: 'some help',
            //     buttonLabel: 'OK'
            // },
            fieldLabels: {
                edition: 'Edition',
                startPage: 'Start page',
                endPage: 'End page',
                notes: 'Notes (not publicly viewable)',
                url: 'Link (URL)'
            }
        }
    },
    conferencePaper: {
        information: {
            title: 'Conference paper information',
            // help: {
            //     title: 'Conference paper information',
            //     text: 'some help',
            //     buttonLabel: 'OK'
            // },
            fieldLabels: {
                title: 'Title of paper',
                conferenceName: 'Conference name',
                conferenceLocation: 'Conference location',
                conferenceDates: 'Conference dates (eg 13-15 December 2011)',
                proceedingsTitle: 'Proceedings title',
                subtype: 'Publication subtype',
                publicationPlace: 'Place of publication',
                publisher: 'Publisher',
                journalName: 'Journal name',
                date: {
                    title: 'Publication date',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year'
                }
            }
        },
        authors: txt.components.authors,
        other: {
            title: 'Other publication details',
            // help: {
            //     title: 'Other publication details',
            //     text: 'some help',
            //     buttonLabel: 'OK'
            // },
            fieldLabels: {
                startPage: 'Start page',
                endPage: 'End page',
                notes: 'Notes (not publicly viewable)',
                url: 'Link (URL)'
            }
        }
    },
    researchReport: {
        information: {
            title: 'Research report information',
            // help: {
            //     title: 'Research report information',
            //     text: 'some help',
            //     buttonLabel: 'OK'
            // },
            fieldLabels: {
                documentTitle: {
                    label: 'Title',
                    placeholder: 'Type title of research report'
                },
                publicationPlace: {
                    label: 'Place of publication',
                    placeholder: 'Type the place of publication'
                },
                publisher: {
                    label: 'Publisher',
                    placeholder: 'Type the name of the publisher'
                },
                date: {
                    title: 'Date published',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year'
                },
                series: {
                    floatingLabelText: 'Series title',
                    hintText: 'Enter title of series'
                },
                totalPages: {
                    label: 'Total pages',
                    placeholder: 'Type total number of pages in the publication'
                }
            }
        },
        authors: txt.components.authors,
        other: {
            title: 'Other publication details',
            // help: {
            //     title: 'Other publication details',
            //     text: 'some help',
            //     buttonLabel: 'OK'
            // },
            fieldLabels: {
                abstract: {
                    label: 'Abstract',
                    placeholder: 'Type an abstract or summary of the work'
                },
                notes: {
                    label: 'Notes (not publicly viewable)',
                    placeholder: 'Add any additional information here'
                },
                url: {
                    label: 'Link',
                    placeholder: 'Type URL for this publication'
                }
            }
        }
    },
    audioDocument: {
        information: {
            title: 'Audio document information',
            help: {
                title: 'Audio document information',
                text: (
                    <div>
                        <p><b>Place of publication:</b> Provide the geographical location for the
                            publisher
                            or producer of the work, i.e. city, country</p>
                        <p><b>Publication date:</b> Provide the date recorded on the work, where
                            available.
                            For online recordings or broadcasts, provide the date first publicly presented or
                            released. </p>
                    </div>
                ),
                buttonLabel: 'OK'
            },
            fieldLabels: {
                documentTitle: {
                    label: 'Title',
                    placeholder: 'Title of work'
                },
                publicationPlace: {
                    label: 'Place of publication',
                    placeholder: 'City, Country'
                },
                publisher: {
                    label: 'Publisher',
                    placeholder: 'Type the name of the publisher or producer of the work.'
                },
                abstract: {
                    label: 'Abstract',
                    placeholder: 'Provide an abstract or summary of the work.'
                },
                date: {
                    title: 'Publication date',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year'
                },
            }
        },
        creator: txt.components.creators,
        contributor: txt.components.contributors,
        optional: {
            title: 'Optional information',
            // help: {
            //     title: 'Optional information',
            //     text: 'help...',
            //     buttonLabel: 'OK'
            // },
            fieldLabels: {
                notes: {
                    label: 'Notes (not publicly viewable)',
                    placeholder: 'Add any additional information here.',
                },
                url: {
                    label: 'Link',
                    placeholder: 'Enter URL for this work.',
                }
            }
        },
    },
    patent: {
        information: {
            title: 'Patent information',
            // help: {
            //     title: 'Patent information',
            //     text: 'some help',
            //     buttonLabel: 'OK'
            // },
            fieldLabels: {
                title: 'Title of patent',
                patentNumber: 'Patent number',
                countryOfOrigin: 'Country of origin',
                date: {
                    title: 'Date patent issued',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year'
                },
                patentOwner: 'Patent owner'
            }
        },
        authors: txt.components.creators,
        other: {
            title: 'Other patent details',
            // help: {
            //     title: 'Other patent details',
            //     text: 'some help',
            //     buttonLabel: 'OK'
            // },
            fieldLabels: {
                notes: 'Notes (not publicly viewable)',
                url: 'Enter URL for this patent'
            }
        },
    },
    seminarPaper: {
        information: {
            title: 'Seminar paper information',
            // help: {
            //     title: 'Seminar paper information',
            //     text: 'Some help',
            //     buttonLabel: 'OK'
            // },
            fieldLabels: {
                documentTitle: {
                    label: 'Title',
                    placeholder: 'Title of paper',
                },
                orgUnitName: {
                    floatingLabelText: 'School, department or centre',
                    hintText: ''
                },
                orgName: {
                    floatingLabelText: 'Institution',
                    hintText: ''
                },
                series: {
                    floatingLabelText: 'Series',
                    hintText: 'Enter seminar series'
                },
                seminarDate: {
                    title: 'Seminar date',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year'
                }
            }
        },
        authors: txt.components.authors,
        optional: {
            title: 'Optional information',
            // help: {
            //     title: 'Optional information help',
            //     text: 'Some help',
            //     buttonLabel: 'OK'
            // },
            fieldLabels: {
                notes: {
                    label: 'Notes (not publicly viewable)',
                    placeholder: 'Add any additional information here',
                },
                url: {
                    label: 'Link',
                    placeholder: 'Enter a valid URL for this publication'
                }
            }
        },
    },
    thesis: {
        information: {
            title: 'Thesis information',
            // help: {
            //     title: 'Thesis information',
            //     text: 'Some help',
            //     buttonLabel: 'OK'
            // },
            fieldLabels: {
                documentTitle: {
                    label: 'Title',
                    placeholder: 'Thesis title'
                },
                orgName: {
                    floatingLabelText: 'Institution name',
                    hintText: ''
                },
                orgUnitName: {
                    floatingLabelText: 'Enrolling unit',
                    hintText: 'Enrolling unit, eg. School of Business'
                },
                date: {
                    title: 'Publication date',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year'
                },
                thesisType: {
                    label: 'Thesis type'
                },
                author: {
                    label: 'Author name',
                    placeholder: ''
                }
            }
        },
        supervisors: {
            ...txt.components.supervisors
        },
        fieldOfResearch: {
            title: 'Field of research',
            // help: {
            //     title: 'Field of research help',
            //     text: 'Some help',
            //     buttonLabel: 'OK'
            // },
            description: 'Select up to 3 Field of Research (FoR) codes'
        },
        keywords: {
            title: 'Keywords',
            // help: {
            //     title: 'Optional information help',
            //     text: 'Some help',
            //     buttonLabel: 'OK'
            // },
            description: 'Add up to 10 keywords that describe the content of the thesis'
        },
        optional: {
            title: 'Optional information',
            // help: {
            //     title: 'Optional information help',
            //     text: 'Some help',
            //     buttonLabel: 'OK'
            // },
            fieldLabels: {
                doi: {
                    label: 'DOI',
                    placeholder: ''
                },
                totalPages: {
                    label: 'Total pages',
                    placeholder: ''
                },
                abstract: {
                    label: 'Abstract',
                    placeholder: 'Provide an abstract or summary of the work'
                },
                notes: {
                    label: 'Notes (not publicly viewable)',
                    placeholder: 'Provide any additional information',
                }
            }
        },
    },
    preprint: {
        information: {
            title: 'Preprint information',
            // help: {
            //     title: 'Preprint information',
            //     text: 'Help...',
            //     buttonLabel: 'OK'
            // },
            fieldLabels: {
                documentTitle: {
                    label: 'Title',
                    placeholder: 'Title of report'
                },
                date: {
                    title: 'Preprint date',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year'
                }
            }
        },
        authors: txt.components.authors,
        optional: {
            title: 'Optional publication details',
            // help: {
            //     title: 'Optional publication details',
            //     text: 'some help',
            //     buttonLabel: 'OK'
            // },
            fieldLabels: {
                notes: {
                    label: 'Notes (not publicly viewable)',
                    placeholder: 'Add any additional information here'
                },
                url: {
                    label: 'Link (URL)',
                    placeholder: 'Enter URL for this publication'
                }
            }
        }
    },
    creativeWork: {
        information: {
            title: 'Creative work information',
            // help: {
            //     title: 'Creative work information',
            //     text: 'some help',
            //     buttonLabel: 'OK'
            // },
            fieldLabels: {
                articleTitle: {
                    label: 'Title',
                    placeholder: 'Title of creative work'
                },
                placeOfPublication: {
                    label: 'Place of publication',
                    placeholder: 'City, country'
                },
                publisher: {
                    label: 'Publisher',
                    placeholder: ''
                },
                date: {
                    title: 'Publication date',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year'
                },
                abstract: {
                    label: 'Abstract',
                    placeholder: 'Provide an abstract or summary of the work.'
                }
            }
        },
        authors: txt.components.authors,
        optional: {
            title: 'Optional information',
            // help: {
            //     title: 'Optional information',
            //     text: 'Help...',
            //     buttonLabel: 'OK'
            // },
            fieldLabels: {
                notes: {
                    label: 'Notes (not publicly viewable)',
                    placeholder: 'Add any additional information here.',
                },
                url: {
                    label: 'Link',
                    placeholder: 'Enter URL for this work.',
                }
            }
        },
    },
    video: {
        information: {
            title: 'Video information',
            help: {
                title: 'Video information',
                text: (
                    <div>
                        <p><b>Place of publication:</b> Type the geographical location for the
                            publisher
                            or producer of the work, i.e. city, country</p>
                        <p><b>Publication date:</b> Type the date recorded on the work, where
                            available.
                            For online recordings or broadcasts, enter the date first publicly presented or
                            released. </p>
                    </div>
                ),
                buttonLabel: 'OK'
            },
            fieldLabels: {
                documentTitle: {
                    label: 'Title',
                    placeholder: 'Title of work'
                },
                publicationPlace: {
                    label: 'Place of publication',
                    placeholder: 'City, Country'
                },
                publisher: {
                    label: 'Publisher',
                    placeholder: 'Type the name of the publisher or producer of the work.'
                },
                abstract: {
                    label: 'Abstract',
                    placeholder: 'Provide an abstract or summary of the work.'
                },
                date: {
                    title: 'Publication date',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year'
                },
            }
        },
        creator: txt.components.creators,
        contributor: txt.components.contributors,
        optional: {
            title: 'Optional information',
            // help: {
            //     title: 'Optional information',
            //     text: 'text...',
            //     buttonLabel: 'OK'
            // },
            fieldLabels: {
                notes: {
                    label: 'Notes (not publicly viewable)',
                    placeholder: 'Add any additional information here.',
                },
                url: {
                    label: 'Link',
                    placeholder: 'Enter URL for this work.',
                }
            }
        },
    },
    imageDocument: {
        information: {
            title: 'Image information',
            // help: {
            //     title: 'Image information',
            //     text: 'Some text.',
            //     buttonLabel: 'OK'
            // },
            fieldLabels: {
                documentTitle: {
                    label: 'Title',
                    placeholder: 'Title of image'
                },
                date: {
                    title: 'Date created',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year'
                },
                abstract: {
                    label: 'Abstract',
                    placeholder: 'Provide an abstract or summary of the work.'
                },
            },
        },
        creator: txt.components.creators,
        optional: {
            title: 'Optional information',
            // help: {
            //     title: 'Optional information',
            //     text: 'Text...',
            //     buttonLabel: 'OK'
            // },
            fieldLabels: {
                notes: {
                    label: 'Notes (not publicly viewable)',
                    placeholder: 'Add any additional information here.',
                },
                url: {
                    label: 'Link',
                    placeholder: 'Enter URL for this work.',
                }
            }
        },
    },
    design: {
        information: {
            title: 'Design information',
            // help: {
            //     title: 'Design information',
            //     text: 'some help',
            //     buttonLabel: 'OK'
            // },
            fieldLabels: {
                articleTitle: {
                    label: 'Title',
                    placeholder: 'Title of design'
                },
                projectName: {
                    label: 'Project name',
                    placeholder: 'Title of project'
                },
                projectDescription: {
                    label: 'Project description',
                    placeholder: 'Provide a summary/description of the project.'
                },
                placeOfPublication: {
                    label: 'Place of publication',
                    placeholder: 'Type the geographical location for the publisher.'
                },
                publisher: {
                    label: 'Publisher',
                    placeholder: 'Type the name of the publisher.'
                },
                location: {
                    label: 'Location',
                    placeholder: 'Type the geographical location for the design itself.'
                },
                date: {
                    title: 'Publication date',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year'
                },
            }
        },
        authors: txt.components.designers,
        optional: {
            title: 'Optional information',
            // help: {
            //     title: 'Optional information',
            //     text: 'text...',
            //     buttonLabel: 'OK'
            // },
            fieldLabels: {
                notes: {
                    label: 'Notes (not publicly viewable)',
                    placeholder: 'Add any additional information here.',
                },
                url: {
                    label: 'Link',
                    placeholder: 'Enter URL for this work.',
                }
            }
        },
    },
    newspaperArticle: {
        information: {
            title: 'Newspaper article information',
            // help: {
            //     title: 'Newspaper article information',
            //     text: 'some help',
            //     buttonLabel: 'OK'
            // },
            fieldLabels: {
                documentTitle: {
                    label: 'Title',
                    placeholder: 'Enter article title'
                },
                newspaperName: {
                    floatingLabelText: 'Newspaper name',
                    hintText: 'Enter title of the journal'
                },
                date: {
                    title: 'Publication Date',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year'
                },
                startPage: {
                    label: 'Start page',
                    placeholder: ''
                },
                endPage: {
                    label: 'End page',
                    placeholder: ''
                }
            }
        },
        authors: txt.components.authors,
        optional: {
            title: 'Optional publication details',
            // help: {
            //     title: 'Optional publication details',
            //     text: 'some help',
            //     buttonLabel: 'OK'
            // },
            fieldLabels: {
                notes: {
                    label: 'Notes (not publicly viewable)',
                    placeholder: 'Add any additional information here'
                },
                url: {
                    label: 'Link',
                    placeholder: 'Type URL for this publication'
                }
            }
        }
    },
    departmentTechnicalReport: {
        information: {
            title: 'Department technical report information',
            // help: {
            //     title: 'Department technical report information',
            //     text: 'some help',
            //     buttonLabel: 'OK'
            // },
            fieldLabels: {
                documentTitle: {
                    label: 'Title',
                    placeholder: 'Title of report'
                },
                orgName: {
                    floatingLabelText: 'Institution name',
                    hintText: ''
                },
                orgUnitName: {
                    floatingLabelText: 'School, Institute or Centre',
                    hintText: ''
                },
                series: {
                    floatingLabelText: 'Series',
                    placeholder: ''
                },
                reportNumber: {
                    floatingLabelText: 'Report number',
                    hintText: ''
                },
                date: {
                    title: 'Date published',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year'
                },
                totalPages: {
                    label: 'Total pages',
                    placeholder: 'Type total number of pages in the publication'
                },
                abstract: {
                    label: 'Abstract',
                    placeholder: 'Provide an abstract or summary of the work.'
                }
            }
        },
        authors: txt.components.authors,
        other: {
            title: 'Other publication details',
            // help: {
            //     title: 'Other publication details',
            //     text: 'some help',
            //     buttonLabel: 'OK'
            // },
            fieldLabels: {
                notes: {
                    label: 'Notes (not publicly viewable)',
                    placeholder: 'Add any additional information here'
                },
                url: {
                    label: 'Link',
                    placeholder: 'Type URL for this publication'
                }
            }
        }
    },
    workingPaper: {
        information: {
            title: 'Working paper information',
            // help: {
            //     title: 'Working paper information',
            //     text: 'some help',
            //     buttonLabel: 'OK'
            // },
            fieldLabels: {
                documentTitle: {
                    label: 'Title',
                    placeholder: 'Title of paper'
                },
                orgUnitName: {
                    floatingLabelText: 'School, Institute or Centre ',
                    hintText: ''
                },
                orgName: {
                    floatingLabelText: 'Institution',
                    hintText: ''
                },
                date: {
                    title: 'Publication date',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year'
                },
                series: {
                    floatingLabelText: 'Series',
                    hintText: ''
                },
                paperNumber: {
                    floatingLabelText: 'Paper number',
                    hintText: ''
                },
                totalPages: {
                    label: 'Total pages',
                    placeholder: 'Enter total number of pages in the paper.'
                },
                abstract: {
                    label: 'Abstract',
                    placeholder: 'Provide an abstract or summary of the work.'
                }
            }
        },
        authors: txt.components.authors,
        other: {
            title: 'Other publication details',
            // help: {
            //     title: 'Other publication details',
            //     text: 'some help',
            //     buttonLabel: 'OK'
            // },
            fieldLabels: {
                notes: {
                    label: 'Notes (not publicly viewable)',
                    placeholder: 'Add any additional information here'
                },
                url: {
                    label: 'Link',
                    placeholder: 'Type URL for this publication'
                }
            }
        }
    },
    conferenceProceedings: {
        information: {
            title: 'Conference proceedings information',
            // help: {
            //     title: 'Conference proceedings information',
            //     text: 'some help',
            //     buttonLabel: 'OK'
            // },
            fieldLabels: {
                title: {
                    label: 'Title',
                    placeholder: 'Proceedings title'
                },
                conferenceName: {
                    label: 'Conference name',
                    placeholder: 'Type the name of conference'
                },
                conferenceLocation: {
                    label: 'Conference location',
                    placeholder: 'Type the place of conference'
                },
                conferenceDates: {
                    label: 'Conference dates (eg 13-15 December 2011)',
                    placeholder: 'Type the dates of conference'
                },
                proceedingsTitle: {
                    label: 'Proceedings title',
                    placeholder: 'Type the title of proceedings'
                },
                publicationPlace: {
                    label: 'Place of publication',
                    placeholder: 'Type the place of publication'
                },
                publisher: {
                    label: 'Publisher',
                    placeholder: 'Type the name of the publisher'
                },
                date: {
                    title: 'Publication date',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year'
                }
            }
        },
        editors: txt.components.editors,
        other: {
            title: 'Other publication details',
            // help: {
            //     title: 'Other publication details',
            //     text: 'some help',
            //     buttonLabel: 'OK'
            // },
            fieldLabels: {
                notes: {
                    label: 'Notes (not publicly viewable)',
                    placeholder: 'Add any additional information'
                },
                link: {
                    label: 'Link (URL)',
                    placeholder: 'Enter URL for this publication'
                }
            }
        }
    },
    fileUpload: {
        title: 'Upload files',
        // help: {
        //     title: 'Upload files',
        //     text: 'file help...',
        //     buttonLabel: 'OK'
        // }
    },
    cancelWorkflowConfirmation: {
        confirmationTitle: 'Abandon workflow',
        confirmationMessage: 'Are you sure you want to abandon workflow?',
        cancelButtonLabel: 'No',
        confirmButtonLabel: 'Yes'
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
        message: 'Creating new publication is in progress.',
        showLoader: true
    },
    successAlert: {
        type: 'done',
        title: 'Success',
        message: 'New publication has been saved successfully.'
    },
    thesisSubmission: {
        hdrTitle: 'Higher degree by research thesis deposit',
        sbsTitle: 'Professional doctorate deposit',
        text: (<span>Required fields are marked with <span className="requiredField"><label>&nbsp;</label></span></span>),
        fileUpload: {
            title: 'Upload files',
            // help: {
            //     title: 'Upload files',
            //     text: 'file help...',
            //     buttonLabel: 'OK'
            // },
            locale: {
                instructions: '',
                accessTermsAndConditions: 'I understand that the files indicated above as open access will be submitted as open access and will be made publicly available immediately or will be made available on the indicated embargo date.  All other files submitted will be accessible by UQ eSpace administrators.',
                validation: {
                    ['notFiles']: 'Invalid files ([fileNames])',
                    ['invalidFileNames']: 'File(s) ([fileNames]) have invalid file name',
                    ['tooBigFiles']: 'File(s) ([fileNames]) exceed maximum allowed upload file size',
                    ['tooManyFiles']: 'Maximum number of files ([maxNumberOfFiles]) has been exceeded. File(s) ([fileNames]) will not be uploaded',
                    ['duplicateFiles']: 'File(s) ([fileNames]) are duplicates and have been ignored'
                },
                successTitle: 'Success',
                successMessage: 'Successfully added [numberOfFiles] file(s) to upload queue.',
                errorTitle: 'Upload Errors',
                fileUploadRestrictionHeading: (<h3><span className="requiredField"><label>&nbsp;</label></span>File upload restrictions</h3>),
                fileUploadRestrictions: (
                    <div>
                        Maximum file size is 5Gb. <br/>
                        PDF files must be saved using the following naming structure <b>&lt;student number&gt;_&lt;degree type&gt;_&lt;document name&gt;.pdf</b>.
                        Document name could be thesis, abstract, and etc.
                        For example:
                        <ul>
                            <li>s1234567_phd_thesis.pdf</li>
                            <li>s1234567_phd_abstract.pdf</li>
                        </ul>
                        Supplementary audio files are to be in MP 3 format. <br />
                        Supplementary video files are to be in WMV or AVI format. <br />
                    </div>
                ),
                fileUploadInstruction: (
                    <p>Click here to select files, or drag files into this area to upload</p>
                )
            },
            text: (
                <div>
                    <span className="requiredField"><label>&nbsp;</label></span>
                </div>
            )
        },
        cancelLink: 'https://my.uq.edu.au/information-and-services/higher-degree-research/my-thesis/2-thesis-submission',
        cancel: 'Cancel',
        submit: 'Deposit your thesis',
        afterSubmitLink: 'https://my.uq.edu.au/information-and-services/higher-degree-research/my-thesis/2-thesis-submission',
        afterSubmit: 'Return to the Graduate School website',
        afterSubmitText: (<p>Your thesis has been deposited. You will receive an email confirming your thesis deposit shortly.</p>),
        depositConfirmation: {
            confirmationTitle: 'Thesis deposit',
            confirmationMessage: 'You are about to deposit your thesis with attached files. Are you sure you want to proceed?',
            cancelButtonLabel: 'No, continue editing',
            confirmButtonLabel: 'Yes, deposit thesis'
        },
        sessionExpiredConfirmation: {
            confirmationTitle: 'Session Expired',
            confirmationMessage: 'Your session has expired and you will now be redirected to the login page and then redeposit your thesis.',
            cancelButtonLabel: 'Cancel',
            confirmButtonLabel: 'Redirect to login'
        },
        depositFailedMessage: () => ('Error has occurred during request and request cannot be processed. Check your internet connection and TRY AGAIN or contact UQ Graduate School administrators.')
    }
};
