import React from 'react';
import {default as components} from './locale.components';

export default {
    forms: {
        publicationForm: {
            cancel: 'Abandon and search again',
            submit: 'Submit for approval',
            publicationType: {
                title: 'Publication type',
                inputLabelText: 'Select publication type',
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
                authors: components.authors,
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
                            hintText: 'Please add any additional information'
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
                authors: components.authors,
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
                authors: components.authors,
                editors: components.editors,
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
                authors: components.authors,
                editors: components.editors,
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
                authors: components.authors,
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
                            hintText: 'Please, type title of research report'
                        },
                        publicationPlace: {
                            floatingLabelText: 'Place of publication',
                            hintText: 'Please, type the place of publication'
                        },
                        publisher: {
                            floatingLabelText: 'Publisher',
                            hintText: 'Please, type the name of the publisher'
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
                            hintText: 'Please, type total number of pages in the publication'
                        }
                    }
                },
                authors: components.authors,
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
                            hintText: 'Please, provide an abstract or summary of the work'
                        },
                        notes: {
                            floatingLabelText: 'Notes (not publicly viewable)',
                            hintText: 'Please, add any additional information here'
                        },
                        url: {
                            floatingLabelText: 'Link',
                            hintText: 'Please, type URL for this publication'
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
                                <p><b>Place of publication:</b> Please enter the geographical location for the
                                    publisher
                                    or producer of the work, i.e. city, country</p>
                                <p><b>Publication date:</b> Please enter the date recorded on the work, where
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
                            hintText: 'Please enter the name of the publisher or producer of the work.'
                        },
                        abstract: {
                            floatingLabelText: 'Abstract',
                            hintText: 'Please provide an abstract or summary of the work.'
                        },
                        date: {
                            title: 'Publication date',
                            day: 'Day',
                            month: 'Month',
                            year: 'Year'
                        },
                    }
                },
                creator: components.creators,
                contributor: components.contributors,
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
                            hintText: 'Please add any additional information here.',
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
                authors: components.creators,
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
                authors: components.authors,
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
                            hintText: 'Please, add any additional information here',
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
                            hintText: 'Thesis title'
                        },
                        orgName: {
                            floatingLabelText: 'Institution name',
                            hintText: ''
                        },
                        orgUnitName: {
                            floatingLabelText: 'School, Institute or Centre',
                            hintText: ''
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
                            floatingLabelText: 'Author name',
                            hintText: ''
                        }
                    }
                },
                supervisors: components.supervisors,
                fieldOfResearch: {
                    title: 'Field of research',
                    help: {
                        title: 'Optional information help',
                        text: 'Some help',
                        buttonLabel: 'OK'
                    },
                    description: 'Select up to 3 Field of Research (FoR) codes'
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
                            hintText: 'Provide an abstract or summary of the work'
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
                authors: components.authors,
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
                            hintText: 'Please add any additional information here'
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
                            hintText: 'Please provide an abstract or summary of the work.'
                        }
                    }
                },
                authors: components.authors,
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
                            hintText: 'Please add any additional information here.',
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
                                <p><b>Place of publication:</b> Please enter the geographical location for the
                                    publisher
                                    or producer of the work, i.e. city, country</p>
                                <p><b>Publication date:</b> Please enter the date recorded on the work, where
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
                            hintText: 'Please enter the name of the publisher or producer of the work.'
                        },
                        abstract: {
                            floatingLabelText: 'Abstract',
                            hintText: 'Please provide an abstract or summary of the work.'
                        },
                        date: {
                            title: 'Publication date',
                            day: 'Day',
                            month: 'Month',
                            year: 'Year'
                        },
                    }
                },
                creator: components.creators,
                contributor: components.contributors,
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
                            hintText: 'Please add any additional information here.',
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
                            hintText: 'Please provide an abstract or summary of the work.'
                        },
                    },
                },
                creator: components.creators,
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
                            hintText: 'Please add any additional information here.',
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
                            hintText: 'Please provide a summary/description of the project.'
                        },
                        placeOfPublication: {
                            floatingLabelText: 'Place of publication',
                            hintText: 'Please enter the geographical location for the publisher.'
                        },
                        publisher: {
                            floatingLabelText: 'Publisher',
                            hintText: 'Please enter the name of the publisher.'
                        },
                        location: {
                            floatingLabelText: 'Location',
                            hintText: 'Please enter the geographical location for the design itself.'
                        },
                        date: {
                            title: 'Publication date',
                            day: 'Day',
                            month: 'Month',
                            year: 'Year'
                        },
                    }
                },
                authors: components.designers,
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
                            hintText: 'Please add any additional information here.',
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
                authors: components.authors,
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
                            hintText: 'Please, add any additional information here'
                        },
                        url: {
                            floatingLabelText: 'Link',
                            hintText: 'Please, type URL for this publication'
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
                            hintText: 'Please, type total number of pages in the publication'
                        },
                        abstract: {
                            floatingLabelText: 'Abstract',
                            hintText: 'Please provide an abstract or summary of the work.'
                        }
                    }
                },
                authors: components.authors,
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
                            hintText: 'Please, add any additional information here'
                        },
                        url: {
                            floatingLabelText: 'Link',
                            hintText: 'Please, type URL for this publication'
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
                            hintText: 'Please provide an abstract or summary of the work.'
                        }
                    }
                },
                authors: components.authors,
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
                            hintText: 'Please, add any additional information here'
                        },
                        url: {
                            floatingLabelText: 'Link',
                            hintText: 'Please, type URL for this publication'
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
                            hintText: 'Please, type the name of conference'
                        },
                        conferenceLocation: {
                            floatingLabelText: 'Conference location',
                            hintText: 'Please, type the place of conference'
                        },
                        conferenceDates: {
                            floatingLabelText: 'Conference dates (eg 13-15 December 2011)',
                            hintText: 'Please, type the dates of conference'
                        },
                        proceedingsTitle: {
                            floatingLabelText: 'Proceedings title',
                            hintText: 'Please, type the title of proceedings'
                        },
                        publicationPlace: {
                            floatingLabelText: 'Place of publication',
                            hintText: 'Please, type the place of publication'
                        },
                        publisher: {
                            floatingLabelText: 'Publisher',
                            hintText: 'Please, type the name of the publisher'
                        },
                        date: {
                            title: 'Publication date',
                            day: 'Day',
                            month: 'Month',
                            year: 'Year'
                        }
                    }
                },
                editors: components.editors,
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
                            hintText: 'Please add any additional information'
                        },
                        link: {
                            floatingLabelText: 'Link (URL)',
                            hintText: 'Enter URL for this publication'
                        }
                    }
                }
            },
            fileUpload: {
                title: 'Files',
                help: {
                    title: 'Files',
                    text: 'file help...',
                    buttonLabel: 'OK'
                }
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
                message: 'Form cannot be submitted until all fields are valid. Please, review all input fields.'
            },
            errorAlert: {
                type: 'error_outline',
                title: 'Error',
                message: (message) => (`Error has occurred during request and request cannot be processed. ${message} Please, contact eSpace administrators or try again later.`),
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
            }
        },
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
                text: 'We were unable to automatically detect who you are from the list of authors on this publication. Please, select your name from the list below: ',
                help: {
                    title: 'Author linking',
                    text: '...',
                    buttonLabel: 'OK'
                }
            },
            contributorLinking: {
                title: 'Editor linking',
                text: 'We were unable to automatically detect who you are from the list of editors on this publication. Please, select your name from the list below: ',
                help: {
                    title: 'Editor linking',
                    text: '...',
                    buttonLabel: 'OK'
                }
            },
            comments: {
                title: 'Please, suggest changes and/or upload additional files below',
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
                title: 'Upload additional files',
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
                successConfirmationMessage: (<p>Your item will be referred to a UQ eSpace Staging staff member
                    for editing, prior to being moved into a publicly viewable collection.</p>),
                fileFailConfirmationMessage: (<p>
                    Your item will be referred to a UQ eSpace Staging staff member
                    for editing, prior to being moved into a publicly viewable collection.<br/><br/>
                    <strong>
                        Please note, file upload has failed.
                        Retry uploading files via "Fix record" screen or contact eSpace administrators.
                    </strong>
                </p>),
                cancelButtonLabel: 'Claim more publications',
                addRecordButtonLabel: 'Add another missing record',
                confirmButtonLabel: 'Go to my research'
            },
            validationAlert: {
                type: 'warning',
                title: 'Validation',
                message: 'Form cannot be submitted until all fields are valid. Please, review all input fields.'
            },
            errorAlert: {
                type: 'error_outline',
                title: 'Error',
                message: (message) => (`Error has occurred during request and request cannot be processed. ${message} Please, contact eSpace administrators or try again later.`)
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
            }
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
                confirmationMessage: (
                    <p>Your request will be referred to a UQ eSpace staff member for review/action.</p>),
                cancelButtonLabel: 'Go to my dashboard',
                confirmButtonLabel: 'Go to my research'
            },
            validationAlert: {
                type: 'warning',
                title: 'Validation',
                message: 'Form cannot be submitted until all fields are valid. Please, review all input fields.'
            },
            errorAlert: {
                type: 'error_outline',
                title: 'Error',
                message: (message) => (`Error has occurred during request and request cannot be processed. ${message} Please, contact eSpace administrators or try again later.`)
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
            }
        }
    }
};
