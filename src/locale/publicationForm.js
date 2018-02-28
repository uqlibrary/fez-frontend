import React from 'react';
import {default as txt} from './components';

export default {
    cancel: 'Abandon and search again',
    submit: 'Submit for approval',
    publicationType: {
        title: 'Publication type',
        inputLabelText: 'Publication type',
        hintText: 'Select a publication type from the dropdown list',
        help: {
            title: 'Publication type',
            text: 'Help about publication types, eg journal article, book, conference paper etc',
            buttonLabel: 'OK'
        }
    },
    generic: {
        information: {
            title: 'Generic document information',
            help: {
                title: 'General document information',
                text: 'Text...',
                buttonLabel: 'OK'
            },
            fieldLabels: {
                documentTitle: {
                    floatingLabelText: 'Title',
                    hintText: 'Title of generic document'
                },
                publicationPlace: {
                    floatingLabelText: 'Place of publication',
                    hintText: ''
                },
                publisher: {
                    floatingLabelText: 'Publisher',
                    hintText: ''
                },
                abstract: {
                    floatingLabelText: 'Abstract',
                    hintText: 'Add a full article abstract here.'
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
            help: {
                title: 'Optional Information',
                text: 'Text...',
                buttonLabel: 'OK'
            },
            fieldLabels: {
                notes: {
                    floatingLabelText: 'Notes (not publicly viewable)',
                    hintText: 'Add any additional information'
                },
                url: {
                    floatingLabelText: 'Link',
                    hintText: 'Enter URL for this publication'
                }
            }

        }
    },
    journalArticle: {
        information: {
            title: 'Journal article information',
            help: {
                title: 'Journal article information',
                text: 'some help',
                buttonLabel: 'OK'
            },
            fieldLabels: {
                documentTitle: {
                    floatingLabelText: 'Title',
                    hintText: 'Title of journal article'
                },
                journalTitle: {
                    floatingLabelText: 'Journal name',
                    hintText: ''
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
            help: {
                title: 'Optional publication details',
                text: 'some help',
                buttonLabel: 'OK'
            },
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
            help: {
                title: 'Book information',
                text: 'some help',
                buttonLabel: 'OK'
            },
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
            help: {
                title: 'Optional publication details',
                text: 'some help',
                buttonLabel: 'OK'
            },
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
            help: {
                title: 'Book chapter information',
                text: 'some help',
                buttonLabel: 'OK'
            },
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
            help: {
                title: 'Other publication details',
                text: 'some help',
                buttonLabel: 'OK'
            },
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
            help: {
                title: 'Conference paper information',
                text: 'some help',
                buttonLabel: 'OK'
            },
            fieldLabels: {
                title: 'Title of paper',
                conferenceName: 'Conference name',
                conferenceLocation: 'Conference location',
                conferenceDates: 'Conference dates (eg 13-15 December 2011)',
                proceedingsTitle: 'Proceedings title',
                subtype: 'Publication subtype',
                publicationPlace: 'Place of publication',
                publisher: 'Publisher',
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
            help: {
                title: 'Other publication details',
                text: 'some help',
                buttonLabel: 'OK'
            },
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
            help: {
                title: 'Research report information',
                text: 'some help',
                buttonLabel: 'OK'
            },
            fieldLabels: {
                documentTitle: {
                    floatingLabelText: 'Title',
                    hintText: 'Type title of research report'
                },
                publicationPlace: {
                    floatingLabelText: 'Place of publication',
                    hintText: 'Type the place of publication'
                },
                publisher: {
                    floatingLabelText: 'Publisher',
                    hintText: 'Type the name of the publisher'
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
                    floatingLabelText: 'Total pages',
                    hintText: 'Type total number of pages in the publication'
                }
            }
        },
        authors: txt.components.authors,
        other: {
            title: 'Other publication details',
            help: {
                title: 'Other publication details',
                text: 'some help',
                buttonLabel: 'OK'
            },
            fieldLabels: {
                abstract: {
                    floatingLabelText: 'Abstract',
                    hintText: 'Type an abstract or summary of the work'
                },
                notes: {
                    floatingLabelText: 'Notes (not publicly viewable)',
                    hintText: 'Add any additional information here'
                },
                url: {
                    floatingLabelText: 'Link',
                    hintText: 'Type URL for this publication'
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
                    floatingLabelText: 'Title',
                    hintText: 'Title of work'
                },
                publicationPlace: {
                    floatingLabelText: 'Place of publication',
                    hintText: 'City, Country'
                },
                publisher: {
                    floatingLabelText: 'Publisher',
                    hintText: 'Type the name of the publisher or producer of the work.'
                },
                abstract: {
                    floatingLabelText: 'Abstract',
                    hintText: 'Provide an abstract or summary of the work.'
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
            help: {
                title: 'Optional information',
                text: 'help...',
                buttonLabel: 'OK'
            },
            fieldLabels: {
                notes: {
                    floatingLabelText: 'Notes (not publicly viewable)',
                    hintText: 'Add any additional information here.',
                },
                url: {
                    floatingLabelText: 'Link',
                    hintText: 'Enter URL for this work.',
                }
            }
        },
    },
    patent: {
        information: {
            title: 'Patent information',
            help: {
                title: 'Patent information',
                text: 'some help',
                buttonLabel: 'OK'
            },
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
            help: {
                title: 'Other patent details',
                text: 'some help',
                buttonLabel: 'OK'
            },
            fieldLabels: {
                notes: 'Notes (not publicly viewable)',
                url: 'Enter URL for this patent'
            }
        },
    },
    seminarPaper: {
        information: {
            title: 'Seminar paper information',
            help: {
                title: 'Seminar paper information',
                text: 'Some help',
                buttonLabel: 'OK'
            },
            fieldLabels: {
                documentTitle: {
                    floatingLabelText: 'Title',
                    hintText: 'Title of paper',
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
            help: {
                title: 'Optional information help',
                text: 'Some help',
                buttonLabel: 'OK'
            },
            fieldLabels: {
                notes: {
                    floatingLabelText: 'Notes (not publicly viewable)',
                    hintText: 'Add any additional information here',
                },
                url: {
                    floatingLabelText: 'Link',
                    hintText: 'Enter a valid URL for this publication'
                }
            }
        },
    },
    thesis: {
        information: {
            title: 'Thesis information',
            help: {
                title: 'Thesis information',
                text: 'Some help',
                buttonLabel: 'OK'
            },
            fieldLabels: {
                documentTitle: {
                    floatingLabelText: 'Title',
                    hintText: 'Thesis title',
                    errorMessage: 'Thesis title is required'
                },
                orgName: {
                    floatingLabelText: 'Institution name',
                    hintText: '',
                    errorMessage: 'Institution name is required'
                },
                orgUnitName: {
                    floatingLabelText: 'Enrolling unit',
                    hintText: 'Enrolling unit, eg. School of Business',
                    errorMessage: 'Enrolling unit is required'
                },
                date: {
                    title: 'Publication date',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year',
                    errorMessage: 'Publication date is required'
                },
                thesisType: {
                    label: 'Thesis type',
                    errorMessage: 'Thesis type is required'
                },
                author: {
                    floatingLabelText: 'Author name',
                    hintText: '',
                    errorMessage: 'Author name is required'
                }
            }
        },
        supervisors: {
            ...txt.components.supervisors,
            errorMessage: 'Supervisors are required'
        },
        fieldOfResearch: {
            title: 'Field of research',
            help: {
                title: 'Field of research help',
                text: 'Some help',
                buttonLabel: 'OK'
            },
            description: 'Select up to 3 Field of Research (FoR) codes',
            errorMessage: 'Field of research (FoR) is required'
        },
        keywords: {
            title: 'Keywords',
            help: {
                title: 'Optional information help',
                text: 'Some help',
                buttonLabel: 'OK'
            },
            description: 'Add up to 10 keywords that describe the content of the thesis',
            errorMessage: 'Keywords are required'
        },
        optional: {
            title: 'Optional information',
            help: {
                title: 'Optional information help',
                text: 'Some help',
                buttonLabel: 'OK'
            },
            fieldLabels: {
                doi: {
                    floatingLabelText: 'DOI',
                    hintText: ''
                },
                totalPages: {
                    floatingLabelText: 'Total pages',
                    hintText: ''
                },
                abstract: {
                    floatingLabelText: 'Abstract',
                    hintText: 'Provide an abstract or summary of the work',
                    errorMessage: 'Abstract is required'
                },
                notes: {
                    floatingLabelText: 'Notes (not publicly viewable)',
                    hintText: 'Provide any additional information',
                }
            }
        },
    },
    preprint: {
        information: {
            title: 'Preprint information',
            help: {
                title: 'Preprint information',
                text: 'Help...',
                buttonLabel: 'OK'
            },
            fieldLabels: {
                documentTitle: {
                    floatingLabelText: 'Title',
                    hintText: 'Title of report'
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
            help: {
                title: 'Optional publication details',
                text: 'some help',
                buttonLabel: 'OK'
            },
            fieldLabels: {
                notes: {
                    floatingLabelText: 'Notes (not publicly viewable)',
                    hintText: 'Add any additional information here'
                },
                url: {
                    floatingLabelText: 'Link (URL)',
                    hintText: 'Enter URL for this publication'
                }
            }
        }
    },
    creativeWork: {
        information: {
            title: 'Creative work information',
            help: {
                title: 'Creative work information',
                text: 'some help',
                buttonLabel: 'OK'
            },
            fieldLabels: {
                articleTitle: {
                    floatingLabelText: 'Title',
                    hintText: 'Title of creative work'
                },
                placeOfPublication: {
                    floatingLabelText: 'Place of publication',
                    hintText: 'City, country'
                },
                publisher: {
                    floatingLabelText: 'Publisher',
                    hintText: ''
                },
                date: {
                    title: 'Publication date',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year'
                },
                abstract: {
                    floatingLabelText: 'Abstract',
                    hintText: 'Provide an abstract or summary of the work.'
                }
            }
        },
        authors: txt.components.authors,
        optional: {
            title: 'Optional information',
            help: {
                title: 'Optional information',
                text: 'Help...',
                buttonLabel: 'OK'
            },
            fieldLabels: {
                notes: {
                    floatingLabelText: 'Notes (not publicly viewable)',
                    hintText: 'Add any additional information here.',
                },
                url: {
                    floatingLabelText: 'Link',
                    hintText: 'Enter URL for this work.',
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
                    floatingLabelText: 'Title',
                    hintText: 'Title of work'
                },
                publicationPlace: {
                    floatingLabelText: 'Place of publication',
                    hintText: 'City, Country'
                },
                publisher: {
                    floatingLabelText: 'Publisher',
                    hintText: 'Type the name of the publisher or producer of the work.'
                },
                abstract: {
                    floatingLabelText: 'Abstract',
                    hintText: 'Provide an abstract or summary of the work.'
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
            help: {
                title: 'Optional information',
                text: 'text...',
                buttonLabel: 'OK'
            },
            fieldLabels: {
                notes: {
                    floatingLabelText: 'Notes (not publicly viewable)',
                    hintText: 'Add any additional information here.',
                },
                url: {
                    floatingLabelText: 'Link',
                    hintText: 'Enter URL for this work.',
                }
            }
        },
    },
    imageDocument: {
        information: {
            title: 'Image information',
            help: {
                title: 'Image information',
                text: 'Some text.',
                buttonLabel: 'OK'
            },
            fieldLabels: {
                documentTitle: {
                    floatingLabelText: 'Title',
                    hintText: 'Title of image'
                },
                date: {
                    title: 'Date created',
                    day: 'Day',
                    month: 'Month',
                    year: 'Year'
                },
                abstract: {
                    floatingLabelText: 'Abstract',
                    hintText: 'Provide an abstract or summary of the work.'
                },
            },
        },
        creator: txt.components.creators,
        optional: {
            title: 'Optional information',
            help: {
                title: 'Optional information',
                text: 'Text...',
                buttonLabel: 'OK'
            },
            fieldLabels: {
                notes: {
                    floatingLabelText: 'Notes (not publicly viewable)',
                    hintText: 'Add any additional information here.',
                },
                url: {
                    floatingLabelText: 'Link',
                    hintText: 'Enter URL for this work.',
                }
            }
        },
    },
    design: {
        information: {
            title: 'Design information',
            help: {
                title: 'Design information',
                text: 'some help',
                buttonLabel: 'OK'
            },
            fieldLabels: {
                articleTitle: {
                    floatingLabelText: 'Title',
                    hintText: 'Title of design'
                },
                projectName: {
                    floatingLabelText: 'Project name',
                    hintText: 'Title of project'
                },
                projectDescription: {
                    floatingLabelText: 'Project description',
                    hintText: 'Provide a summary/description of the project.'
                },
                placeOfPublication: {
                    floatingLabelText: 'Place of publication',
                    hintText: 'Type the geographical location for the publisher.'
                },
                publisher: {
                    floatingLabelText: 'Publisher',
                    hintText: 'Type the name of the publisher.'
                },
                location: {
                    floatingLabelText: 'Location',
                    hintText: 'Type the geographical location for the design itself.'
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
            help: {
                title: 'Optional information',
                text: 'text...',
                buttonLabel: 'OK'
            },
            fieldLabels: {
                notes: {
                    floatingLabelText: 'Notes (not publicly viewable)',
                    hintText: 'Add any additional information here.',
                },
                url: {
                    floatingLabelText: 'Link',
                    hintText: 'Enter URL for this work.',
                }
            }
        },
    },
    newspaperArticle: {
        information: {
            title: 'Newspaper article information',
            help: {
                title: 'Newspaper article information',
                text: 'some help',
                buttonLabel: 'OK'
            },
            fieldLabels: {
                documentTitle: {
                    floatingLabelText: 'Title',
                    hintText: 'Enter article title'
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
                    floatingLabelText: 'Start page',
                    hintText: ''
                },
                endPage: {
                    floatingLabelText: 'End page',
                    hintText: ''
                }
            }
        },
        authors: txt.components.authors,
        optional: {
            title: 'Optional publication details',
            help: {
                title: 'Optional publication details',
                text: 'some help',
                buttonLabel: 'OK'
            },
            fieldLabels: {
                notes: {
                    floatingLabelText: 'Notes (not publicly viewable)',
                    hintText: 'Add any additional information here'
                },
                url: {
                    floatingLabelText: 'Link',
                    hintText: 'Type URL for this publication'
                }
            }
        }
    },
    departmentTechnicalReport: {
        information: {
            title: 'Department technical report information',
            help: {
                title: 'Department technical report information',
                text: 'some help',
                buttonLabel: 'OK'
            },
            fieldLabels: {
                documentTitle: {
                    floatingLabelText: 'Title',
                    hintText: 'Title of report'
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
                    hintText: ''
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
                    floatingLabelText: 'Total pages',
                    hintText: 'Type total number of pages in the publication'
                },
                abstract: {
                    floatingLabelText: 'Abstract',
                    hintText: 'Provide an abstract or summary of the work.'
                }
            }
        },
        authors: txt.components.authors,
        other: {
            title: 'Other publication details',
            help: {
                title: 'Other publication details',
                text: 'some help',
                buttonLabel: 'OK'
            },
            fieldLabels: {
                notes: {
                    floatingLabelText: 'Notes (not publicly viewable)',
                    hintText: 'Add any additional information here'
                },
                url: {
                    floatingLabelText: 'Link',
                    hintText: 'Type URL for this publication'
                }
            }
        }
    },
    workingPaper: {
        information: {
            title: 'Working paper information',
            help: {
                title: 'Working paper information',
                text: 'some help',
                buttonLabel: 'OK'
            },
            fieldLabels: {
                documentTitle: {
                    floatingLabelText: 'Title',
                    hintText: 'Title of paper'
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
                    floatingLabelText: 'Total pages',
                    hintText: 'Enter total number of pages in the paper.'
                },
                abstract: {
                    floatingLabelText: 'Abstract',
                    hintText: 'Provide an abstract or summary of the work.'
                }
            }
        },
        authors: txt.components.authors,
        other: {
            title: 'Other publication details',
            help: {
                title: 'Other publication details',
                text: 'some help',
                buttonLabel: 'OK'
            },
            fieldLabels: {
                notes: {
                    floatingLabelText: 'Notes (not publicly viewable)',
                    hintText: 'Add any additional information here'
                },
                url: {
                    floatingLabelText: 'Link',
                    hintText: 'Type URL for this publication'
                }
            }
        }
    },
    conferenceProceedings: {
        information: {
            title: 'Conference proceedings information',
            help: {
                title: 'Conference proceedings information',
                text: 'some help',
                buttonLabel: 'OK'
            },
            fieldLabels: {
                title: {
                    floatingLabelText: 'Title',
                    hintText: 'Title of conference'
                },
                conferenceName: {
                    floatingLabelText: 'Conference name',
                    hintText: 'Type the name of conference'
                },
                conferenceLocation: {
                    floatingLabelText: 'Conference location',
                    hintText: 'Type the place of conference'
                },
                conferenceDates: {
                    floatingLabelText: 'Conference dates (eg 13-15 December 2011)',
                    hintText: 'Type the dates of conference'
                },
                proceedingsTitle: {
                    floatingLabelText: 'Proceedings title',
                    hintText: 'Type the title of proceedings'
                },
                publicationPlace: {
                    floatingLabelText: 'Place of publication',
                    hintText: 'Type the place of publication'
                },
                publisher: {
                    floatingLabelText: 'Publisher',
                    hintText: 'Type the name of the publisher'
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
            help: {
                title: 'Other publication details',
                text: 'some help',
                buttonLabel: 'OK'
            },
            fieldLabels: {
                notes: {
                    floatingLabelText: 'Notes (not publicly viewable)',
                    hintText: 'Add any additional information'
                },
                link: {
                    floatingLabelText: 'Link (URL)',
                    hintText: 'Enter URL for this publication'
                }
            }
        }
    },
    fileUpload: {
        title: 'Upload files',
        help: {
            title: 'Upload files',
            text: 'file help...',
            buttonLabel: 'OK'
        },
        errorMessage: 'File submission is mandatory'
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
        message: (message) => (`Error has occurred during request and request cannot be processed. ${message} Please contact eSpace administrators or try again later.`),
        createRecordMessage: 'Error has occurred during request and adding new publication cannot be processed.',
        fileUploadMessage: 'Error has occurred while uploading files.',
    },
    progressAlert: {
        type: 'info_outline',
        title: 'Saving',
        message: 'Creating new publication is in progress.'
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
            help: {
                title: 'Upload files',
                text: 'file help...',
                buttonLabel: 'OK'
            },
            locale: {
                instructions: '',
                accessTermsAndConditions: 'I understand that the files indicated above as open access will be submitted as open access and will be made publicly available immediately or will be made available on the indicated embargo date.  All other files submitted will be accessible by UQ eSpace administrators.',
                validation: {
                    ['folder']: 'Invalid file(s) ([filenames])',
                    ['fileName']: 'File(s) ([filenames]) have invalid file name',
                    ['maxFileSize']: 'File(s) ([filenames]) exceed maximum allowed upload file size',
                    ['maxFiles']: 'Maximum number of files ([maxNumberOfFiles]) has been exceeded. File(s) ([filenames]) will not be uploaded',
                },
                successTitle: 'Success',
                successMessage: 'Successfully added [numberOfFiles] file(s) to upload queue.',
                errorTitle: 'Upload Errors',
                fileUploadRestrictionHeading: (<h3><span className="requiredField"><label>&nbsp;</label></span>File upload restrictions</h3>),
                fileUploadRestrictions: (
                    <div>
                        File submission is mandatory. Maximum file size is 5Gb. <br/>
                        PDF files must be saved using the following naming structure <b>&lt;student number&gt;_&lt;degree type&gt;_&lt;stage examination&gt;.pdf</b>.
                        Stages of examination are: submission, or correctedthesis, or finalthesis.
                        Please refer to <a href="http://ppl.app.uq.edu.au/content/4.60.08-higher-degree-research-examination" target="_blank">HDR submission guidelines</a> for file naming conventions.
                        For example:
                        <ul>
                            <li>s1234567_phd_thesis.pdf</li>
                            <li>s1234567_phd_abstract.pdf</li>
                        </ul>
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
        afterSubmitText: (<p>Your thesis has been deposited. You will receive an email confirming your thesis deposit shortly.</p>)
    }
};
