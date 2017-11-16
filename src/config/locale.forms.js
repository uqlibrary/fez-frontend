import React from 'react';

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
                        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a augue in nisl suscipit pellentesque eu ac arcu. Nulla dictum bibendum lorem, auctor fringilla justo mollis in. Donec sed fringilla odio. In et finibus eros, a porta enim. Curabitur luctus neque metus, ut bibendum ex venenatis a. Maecenas condimentum lorem mauris, at gravida nisl accumsan id. Donec imperdiet fermentum diam, vel dictum turpis lobortis eu. Quisque commodo pellentesque lorem, et pharetra lorem blandit a. Vestibulum posuere fringilla erat.',
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
                authors: {
                    title: 'Authors',
                    description: 'Enter authors in the order and form they appear on the published paper. Additional boxes will appear for more authors.',
                    help: {
                        title: 'Adding contributors',
                        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a augue in nisl suscipit pellentesque eu ac arcu. Nulla dictum bibendum lorem, auctor fringilla justo mollis in. Donec sed fringilla odio. In et finibus eros, a porta enim. Curabitur luctus neque metus, ut bibendum ex venenatis a. Maecenas condimentum lorem mauris, at gravida nisl accumsan id. Donec imperdiet fermentum diam, vel dictum turpis lobortis eu. Quisque commodo pellentesque lorem, et pharetra lorem blandit a. Vestibulum posuere fringilla erat.',
                        buttonLabel: 'OK'
                    },
                    field: {
                        form: {
                            locale: {
                                nameAsPublishedLabel: 'Author\'s name as published',
                                nameAsPublishedHint: 'Please type the name exactly as published',
                                identifierLabel: 'UQ identifier (if available)',
                                addButton: 'Add author'
                            }
                        },
                        header: {
                            locale: {
                                contributorAssignmentColumn: 'Select your name',
                                nameColumn: 'Author\'s name as published',
                                identifierColumn: 'UQ identifier',
                                reorderColumn: 'Reorder items',
                                deleteAll: 'Remove all items',
                                deleteAllConfirmation: {
                                    confirmationTitle: 'Delete all',
                                    confirmationMessage: 'Are you sure you want to delete all items?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        },
                        row: {
                            locale: {
                                suffix: ' listed author',
                                moveUpHint: 'Move item up the order',
                                moveDownHint: 'Move item down the order',
                                deleteHint: 'Remove this item',
                                ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
                                deleteRecordConfirmation: {
                                    confirmationTitle: 'Delete item',
                                    confirmationMessage: 'Are you sure you want to delete this item?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        }
                    }

                },
                optional: {
                    title: 'Optional information',
                    help: {
                        title: 'Optional Information',
                        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a augue in nisl suscipit pellentesque eu ac arcu. Nulla dictum bibendum lorem, auctor fringilla justo mollis in. Donec sed fringilla odio. In et finibus eros, a porta enim. Curabitur luctus neque metus, ut bibendum ex venenatis a. Maecenas condimentum lorem mauris, at gravida nisl accumsan id. Donec imperdiet fermentum diam, vel dictum turpis lobortis eu. Quisque commodo pellentesque lorem, et pharetra lorem blandit a. Vestibulum posuere fringilla erat.',
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
                authors: {
                    title: 'Authors',
                    help: {
                        title: 'Authors',
                        text: 'some help',
                        buttonLabel: 'OK'
                    },
                    field: {
                        form: {
                            locale: {
                                nameAsPublishedLabel: 'Author\'s name as published',
                                nameAsPublishedHint: 'Please type the name exactly as published',
                                identifierLabel: 'UQ identifier (if available)',
                                addButton: 'Add author'
                            }
                        },
                        header: {
                            locale: {
                                contributorAssignmentColumn: 'Select your name',
                                nameColumn: 'Author\'s name as published',
                                identifierColumn: 'UQ identifier',
                                reorderColumn: 'Reorder items',
                                deleteAll: 'Remove all items',
                                deleteAllConfirmation: {
                                    confirmationTitle: 'Delete all',
                                    confirmationMessage: 'Are you sure you want to delete all items?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        },
                        row: {
                            locale: {
                                suffix: ' listed author',
                                moveUpHint: 'Move item up the order',
                                moveDownHint: 'Move item down the order',
                                deleteHint: 'Remove this item',
                                ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
                                deleteRecordConfirmation: {
                                    confirmationTitle: 'Delete item',
                                    confirmationMessage: 'Are you sure you want to delete this item?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        }
                    }
                },
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
                authors: {
                    title: 'Authors',
                    help: {
                        title: 'Authors',
                        text: 'some help',
                        buttonLabel: 'OK'
                    },
                    description: 'Provide a list of authors for this publication and assign yourself as an author or an editor',
                    field: {
                        form: {
                            locale: {
                                nameAsPublishedLabel: 'Author\'s name as published',
                                nameAsPublishedHint: 'Please type the name exactly as published',
                                identifierLabel: 'UQ identifier (if available)',
                                addButton: 'Add author'
                            }
                        },
                        header: {
                            locale: {
                                contributorAssignmentColumn: 'Select your name',
                                nameColumn: 'Author\'s name as published',
                                identifierColumn: 'UQ identifier',
                                reorderColumn: 'Reorder items',
                                deleteAll: 'Remove all items',
                                deleteAllConfirmation: {
                                    confirmationTitle: 'Delete all',
                                    confirmationMessage: 'Are you sure you want to delete all items?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        },
                        row: {
                            locale: {
                                suffix: ' listed author',
                                moveUpHint: 'Move item up the order',
                                moveDownHint: 'Move item down the order',
                                deleteHint: 'Remove this item',
                                ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
                                deleteRecordConfirmation: {
                                    confirmationTitle: 'Delete item',
                                    confirmationMessage: 'Are you sure you want to delete this item?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        }
                    }
                },
                editors: {
                    title: 'Editors',
                    description: 'Provide a list of editors for this publication',
                    help: {
                        title: 'Editors',
                        text: 'some help',
                        buttonLabel: 'OK'
                    },
                    field: {
                        form: {
                            locale: {
                                nameAsPublishedLabel: 'Editor\'s name as published',
                                nameAsPublishedHint: 'Please type the name exactly as published',
                                identifierLabel: 'UQ identifier (if available)',
                                addButton: 'Add editor'
                            }
                        },
                        header: {
                            locale: {
                                contributorAssignmentColumn: 'Select your name (if applicable)',
                                nameColumn: 'Editor\'s name as published',
                                identifierColumn: 'UQ identifier',
                                reorderColumn: 'Reorder items',
                                deleteAll: 'Remove all items',
                                deleteAllConfirmation: {
                                    confirmationTitle: 'Delete all',
                                    confirmationMessage: 'Are you sure you want to delete all items?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        },
                        row: {
                            locale: {
                                suffix: ' listed editor',
                                moveUpHint: 'Move item up the order',
                                moveDownHint: 'Move item down the order',
                                deleteHint: 'Remove this item',
                                ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
                                deleteRecordConfirmation: {
                                    confirmationTitle: 'Delete item',
                                    confirmationMessage: 'Are you sure you want to delete this item?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        }
                    }
                },
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
                authors: {
                    title: 'Authors',
                    help: {
                        title: 'Authors',
                        text: 'some help',
                        buttonLabel: 'OK'
                    },
                    description: 'Provide a list of authors for this publication and assign yourself as an author',
                    field: {
                        form: {
                            locale: {
                                nameAsPublishedLabel: 'Author\'s name as published',
                                nameAsPublishedHint: 'Please type the name exactly as published',
                                identifierLabel: 'UQ identifier (if available)',
                                addButton: 'Add author'
                            }
                        },
                        header: {
                            locale: {
                                contributorAssignmentColumn: 'Select your name',
                                nameColumn: 'Author\'s name as published',
                                identifierColumn: 'UQ identifier',
                                reorderColumn: 'Reorder items',
                                deleteAll: 'Remove all items',
                                deleteAllConfirmation: {
                                    confirmationTitle: 'Delete all',
                                    confirmationMessage: 'Are you sure you want to delete all items?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        },
                        row: {
                            locale: {
                                suffix: ' listed author',
                                moveUpHint: 'Move item up the order',
                                moveDownHint: 'Move item down the order',
                                deleteHint: 'Remove this item',
                                ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
                                deleteRecordConfirmation: {
                                    confirmationTitle: 'Delete item',
                                    confirmationMessage: 'Are you sure you want to delete this item?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        }
                    }
                },
                editors: {
                    title: 'Editors',
                    description: 'Provide a list of editors for this publication',
                    help: {
                        title: 'Editors',
                        text: 'some help',
                        buttonLabel: 'OK'
                    },
                    field: {
                        form: {
                            locale: {
                                nameAsPublishedLabel: 'Editor\'s name as published',
                                nameAsPublishedHint: 'Please type the name exactly as published',
                                identifierLabel: 'UQ identifier (if available)',
                                addButton: 'Add editor'
                            }
                        },
                        header: {
                            locale: {
                                contributorAssignmentColumn: 'Select your name (if applicable)',
                                nameColumn: 'Editor\'s name as published',
                                identifierColumn: 'UQ identifier',
                                reorderColumn: 'Reorder items',
                                deleteAll: 'Remove all items',
                                deleteAllConfirmation: {
                                    confirmationTitle: 'Delete all',
                                    confirmationMessage: 'Are you sure you want to delete all items?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        },
                        row: {
                            locale: {
                                suffix: ' listed editor',
                                moveUpHint: 'Move item up the order',
                                moveDownHint: 'Move item down the order',
                                deleteHint: 'Remove this item',
                                ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
                                deleteRecordConfirmation: {
                                    confirmationTitle: 'Delete item',
                                    confirmationMessage: 'Are you sure you want to delete this item?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        }
                    }
                },
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
                authors: {
                    title: 'Authors',
                    help: {
                        title: 'Authors',
                        text: 'some help',
                        buttonLabel: 'OK'
                    },
                    description: 'Provide a list of authors for this publication and assign yourself as an author',
                    field: {
                        form: {
                            locale: {
                                nameAsPublishedLabel: 'Author\'s name as published',
                                nameAsPublishedHint: 'Please type the name exactly as published',
                                identifierLabel: 'UQ identifier (if available)',
                                addButton: 'Add author'
                            }
                        },
                        header: {
                            locale: {
                                contributorAssignmentColumn: 'Select your name',
                                nameColumn: 'Author\'s name as published',
                                identifierColumn: 'UQ identifier',
                                reorderColumn: 'Reorder items',
                                deleteAll: 'Remove all items',
                                deleteAllConfirmation: {
                                    confirmationTitle: 'Delete all',
                                    confirmationMessage: 'Are you sure you want to delete all items?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        },
                        row: {
                            locale: {
                                suffix: ' listed author',
                                moveUpHint: 'Move item up the order',
                                moveDownHint: 'Move item down the order',
                                deleteHint: 'Remove this item',
                                ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
                                deleteRecordConfirmation: {
                                    confirmationTitle: 'Delete item',
                                    confirmationMessage: 'Are you sure you want to delete this item?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        }
                    }
                },
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
                authors: {
                    title: 'Authors',
                    help: {
                        title: 'Authors',
                        text: 'some help',
                        buttonLabel: 'OK'
                    },
                    description: 'Enter authors in the order and form they appear on the published paper. Additional boxes will appear for more authors.',
                    field: {
                        form: {
                            locale: {
                                nameAsPublishedLabel: 'Author\'s name as published',
                                nameAsPublishedHint: 'Please, type the name exactly as published',
                                identifierLabel: 'UQ identifier (if available)',
                                addButton: 'Add author'
                            }
                        },
                        header: {
                            locale: {
                                contributorAssignmentColumn: 'Select your name',
                                nameColumn: 'Author\'s name as published',
                                identifierColumn: 'UQ identifier',
                                reorderColumn: 'Reorder items',
                                deleteAll: 'Remove all items',
                                deleteAllConfirmation: {
                                    confirmationTitle: 'Delete all',
                                    confirmationMessage: 'Are you sure you want to delete all items?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        },
                        row: {
                            locale: {
                                suffix: ' listed author',
                                moveUpHint: 'Move item up the order',
                                moveDownHint: 'Move item down the order',
                                deleteHint: 'Remove this item',
                                ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
                                deleteRecordConfirmation: {
                                    confirmationTitle: 'Delete item',
                                    confirmationMessage: 'Are you sure you want to delete this item?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        }
                    }
                },
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
                                <p><b>Place of publication:</b> Please enter the geographical location for the publisher
                                    or producer of the work, i.e. city, country</p>
                                <p><b>Publication date:</b> Please enter the date recorded on the work, where available.
                                    For online recordings or broadcasts, enter the date first publicly presented or released. </p>
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
                creator: {
                    title: 'Creators',
                    description: 'Provide a list of creators for this publication',
                    help: {
                        title: 'Creators',
                        text: 'This is the creator or creator of the work, e.g. interviewer, program co-ordinator or performer (if self-produced). Please enter creators in the order and form they appear on the work or associated material. Examples of associated material are programs or promotional material. Additional boxes will appear for more creators.',
                        buttonLabel: 'OK'
                    },
                    field: {
                        form: {
                            locale: {
                                nameAsPublishedLabel: 'Creator\'s name as published',
                                nameAsPublishedHint: 'Please type the name exactly as published',
                                identifierLabel: 'UQ identifier (if available)',
                                addButton: 'Add creator'
                            }
                        },
                        header: {
                            locale: {
                                contributorAssignmentColumn: 'Select your name',
                                nameColumn: 'creator\'s name as published',
                                identifierColumn: 'UQ identifier',
                                reorderColumn: 'Reorder items',
                                deleteAll: 'Remove all items',
                                deleteAllConfirmation: {
                                    confirmationTitle: 'Delete all',
                                    confirmationMessage: 'Are you sure you want to delete all items?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        },
                        row: {
                            locale: {
                                suffix: ' listed creator',
                                moveUpHint: 'Move item up the order',
                                moveDownHint: 'Move item down the order',
                                deleteHint: 'Remove this item',
                                ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
                                deleteRecordConfirmation: {
                                    confirmationTitle: 'Delete item',
                                    confirmationMessage: 'Are you sure you want to delete this item?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        },
                    }
                },
                contributor: {
                    title: 'Contributors',
                    description: 'Provide a list of contributors for this publication',
                    help: {
                        title: 'Contributors',
                        text: 'This is the contributor, and may be different to the creator, e.g. interviewee or performer (if not self-produced). Please enter contributors in the order and form they appear on the work or associated material. Examples of associated material are programs or promotional material. Additional boxes will appear for more contributors.',
                        buttonLabel: 'OK'
                    },
                    field: {
                        form: {
                            locale: {
                                nameAsPublishedLabel: 'Contributor\'s name as published',
                                nameAsPublishedHint: 'Please type the name exactly as published',
                                identifierLabel: 'UQ identifier (if available)',
                                addButton: 'Add contributor'
                            }
                        },
                        header: {
                            locale: {
                                contributorAssignmentColumn: 'Select your name',
                                nameColumn: 'Contributor\'s name as published',
                                identifierColumn: 'UQ identifier',
                                reorderColumn: 'Reorder items',
                                deleteAll: 'Remove all items',
                                deleteAllConfirmation: {
                                    confirmationTitle: 'Delete all',
                                    confirmationMessage: 'Are you sure you want to delete all items?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        },
                        row: {
                            locale: {
                                suffix: ' listed contributor',
                                moveUpHint: 'Move item up the order',
                                moveDownHint: 'Move item down the order',
                                deleteHint: 'Remove this item',
                                ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
                                deleteRecordConfirmation: {
                                    confirmationTitle: 'Delete item',
                                    confirmationMessage: 'Are you sure you want to delete this item?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        }
                    }
                },
                optional: {
                    title: 'Optional information',
                    help: {
                        title: 'Optional information',
                        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tempor, purus eget posuere fermentum, turpis magna auctor metus, in tincidunt est augue et orci.',
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
                authors: {
                    title: 'Creators',
                    help: {
                        title: 'Creators',
                        text: 'some help',
                        buttonLabel: 'OK'
                    },
                    description: 'Provide a list of creators for this patent and assign yourself as an creator',
                    field: {
                        form: {
                            locale: {
                                nameAsPublishedLabel: 'Creator\'s name as published',
                                nameAsPublishedHint: 'Please type the name exactly as published',
                                identifierLabel: 'UQ identifier (if available)',
                                addButton: 'Add creator'
                            }
                        },
                        header: {
                            locale: {
                                contributorAssignmentColumn: 'Select your name',
                                nameColumn: 'Creator\'s name as published',
                                identifierColumn: 'UQ identifier',
                                reorderColumn: 'Reorder items',
                                deleteAll: 'Remove all items',
                                deleteAllConfirmation: {
                                    confirmationTitle: 'Delete all',
                                    confirmationMessage: 'Are you sure you want to delete all items?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        },
                        row: {
                            locale: {
                                suffix: ' listed creator',
                                moveUpHint: 'Move item up the order',
                                moveDownHint: 'Move item down the order',
                                deleteHint: 'Remove this item',
                                ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
                                deleteRecordConfirmation: {
                                    confirmationTitle: 'Delete item',
                                    confirmationMessage: 'Are you sure you want to delete this item?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        }
                    }
                },
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
                authors: {
                    title: 'Authors',
                    help: {
                        title: 'Authors help',
                        text: 'Enter authors in the order and form they appear on the published paper. Additional boxes will appear for more authors.',
                        buttonLabel: 'OK'
                    },
                    description: 'Enter authors in the order and form they appear on the published paper. Additional boxes will appear for more authors.',
                    field: {
                        form: {
                            locale: {
                                nameAsPublishedLabel: 'Author\'s name as published',
                                nameAsPublishedHint: 'Please type the name exactly as published',
                                identifierLabel: 'UQ identifier (if available)',
                                addButton: 'Add author'
                            }
                        },
                        header: {
                            locale: {
                                contributorAssignmentColumn: 'Select your name',
                                nameColumn: 'Author\'s name as published',
                                identifierColumn: 'UQ identifier',
                                reorderColumn: 'Reorder items',
                                deleteAll: 'Remove all items',
                                deleteAllConfirmation: {
                                    confirmationTitle: 'Delete all',
                                    confirmationMessage: 'Are you sure you want to delete all items?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        },
                        row: {
                            locale: {
                                suffix: ' listed author',
                                moveUpHint: 'Move item up the order',
                                moveDownHint: 'Move item down the order',
                                deleteHint: 'Remove this item',
                                ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
                                deleteRecordConfirmation: {
                                    confirmationTitle: 'Delete item',
                                    confirmationMessage: 'Are you sure you want to delete this item?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        }
                    }
                },
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
                supervisors: {
                    title: 'Supervisors',
                    help: {
                        title: 'Supervisors help',
                        text: 'Enter supervisor names e.g. first name, last name. Additional boxes will appear for more supervisors.',
                        buttonLabel: 'OK'
                    },
                    description: 'Enter supervisor names e.g. first name, last name. Additional boxes will appear for more supervisors.',
                    field: {
                        form: {
                            locale: {
                                nameAsPublishedLabel: 'Supervisor\'s name as published',
                                nameAsPublishedHint: '',
                                identifierLabel: 'UQ identifier (if available)',
                                addButton: 'Add supervisor'
                            }
                        },
                        header: {
                            locale: {
                                contributorAssignmentColumn: 'Select your name',
                                nameColumn: 'Supervisor\'s name as published',
                                identifierColumn: 'UQ identifier',
                                reorderColumn: 'Reorder items',
                                deleteAll: 'Remove all items',
                                deleteAllConfirmation: {
                                    confirmationTitle: 'Delete all',
                                    confirmationMessage: 'Are you sure you want to delete all items?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        },
                        row: {
                            locale: {
                                suffix: ' listed supervisor',
                                moveUpHint: 'Move item up the order',
                                moveDownHint: 'Move item down the order',
                                deleteHint: 'Remove this item',
                                ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
                                deleteRecordConfirmation: {
                                    confirmationTitle: 'Delete item',
                                    confirmationMessage: 'Are you sure you want to delete this item?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        }
                    }
                },
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
                        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a augue in nisl suscipit pellentesque eu ac arcu. Nulla dictum bibendum lorem, auctor fringilla justo mollis in. Donec sed fringilla odio. In et finibus eros, a porta enim. Curabitur luctus neque metus, ut bibendum ex venenatis a. Maecenas condimentum lorem mauris, at gravida nisl accumsan id. Donec imperdiet fermentum diam, vel dictum turpis lobortis eu. Quisque commodo pellentesque lorem, et pharetra lorem blandit a. Vestibulum posuere fringilla erat.',
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
                authors: {
                    title: 'Authors',
                    help: {
                        title: 'Authors',
                        text: 'some help',
                        buttonLabel: 'OK'
                    },
                    description: 'Enter authors in the order and form they appear on the published paper. Additional boxes will appear for more authors.',
                    field: {
                        form: {
                            locale: {
                                nameAsPublishedLabel: 'Author\'s name as published',
                                nameAsPublishedHint: 'Please type the name exactly as published',
                                identifierLabel: 'UQ identifier (if available)',
                                addButton: 'Add author'
                            }
                        },
                        header: {
                            locale: {
                                contributorAssignmentColumn: 'Select your name',
                                nameColumn: 'Author\'s name as published',
                                identifierColumn: 'UQ identifier',
                                reorderColumn: 'Reorder items',
                                deleteAll: 'Remove all items',
                                deleteAllConfirmation: {
                                    confirmationTitle: 'Delete all',
                                    confirmationMessage: 'Are you sure you want to delete all items?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        },
                        row: {
                            locale: {
                                suffix: ' listed author',
                                moveUpHint: 'Move item up the order',
                                moveDownHint: 'Move item down the order',
                                deleteHint: 'Remove this item',
                                ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
                                deleteRecordConfirmation: {
                                    confirmationTitle: 'Delete item',
                                    confirmationMessage: 'Are you sure you want to delete this item?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        }
                    }
                },
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
                authors: {
                    title: 'Authors',
                    help: {
                        title: 'Authors',
                        text: 'some help',
                        buttonLabel: 'OK'
                    },
                    description: 'For a creative work, author includes creator, performer or curator. Enter authors in the order and form they appear on the work or associated material. Examples of associated material are promotional material, performance programs or exhibition catalogues. Additional boxes will appear for more authors.',
                    field: {
                        form: {
                            locale: {
                                nameAsPublishedLabel: 'Author\'s name as published',
                                nameAsPublishedHint: 'Please type the name exactly as published',
                                identifierLabel: 'UQ identifier (if available)',
                                addButton: 'Add author'
                            }
                        },
                        header: {
                            locale: {
                                contributorAssignmentColumn: 'Select your name',
                                nameColumn: 'Author\'s name as published',
                                identifierColumn: 'UQ identifier',
                                reorderColumn: 'Reorder items',
                                deleteAll: 'Remove all items',
                                deleteAllConfirmation: {
                                    confirmationTitle: 'Delete all',
                                    confirmationMessage: 'Are you sure you want to delete all items?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        },
                        row: {
                            locale: {
                                suffix: ' listed author',
                                moveUpHint: 'Move item up the order',
                                moveDownHint: 'Move item down the order',
                                deleteHint: 'Remove this item',
                                ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
                                deleteRecordConfirmation: {
                                    confirmationTitle: 'Delete item',
                                    confirmationMessage: 'Are you sure you want to delete this item?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        }
                    }
                },
                optional: {
                    title: 'Optional information',
                    help: {
                        title: 'Optional information',
                        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tempor, purus eget posuere fermentum, turpis magna auctor metus, in tincidunt est augue et orci.',
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
                                <p><b>Place of publication:</b> Please enter the geographical location for the publisher
                                    or producer of the work, i.e. city, country</p>
                                <p><b>Publication date:</b> Please enter the date recorded on the work, where available.
                                    For online recordings or broadcasts, enter the date first publicly presented or released. </p>
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
                creator: {
                    title: 'Creators',
                    description: 'Provide a list of creators for this publication',
                    help: {
                        title: 'Creators',
                        text: 'This is the author or creator of the work, e.g. producer or performer (if self-produced). Please enter creators in the order and form they appear on the work or associated material. Examples of associated material are programs or promotional material. Additional boxes will appear for more creators.',
                        buttonLabel: 'OK'
                    },
                    field: {
                        form: {
                            locale: {
                                nameAsPublishedLabel: 'Creator\'s name as published',
                                nameAsPublishedHint: 'Please type the name exactly as published',
                                identifierLabel: 'UQ identifier (if available)',
                                addButton: 'Add creator'
                            }
                        },
                        header: {
                            locale: {
                                contributorAssignmentColumn: 'Select your name',
                                nameColumn: 'creator\'s name as published',
                                identifierColumn: 'UQ identifier',
                                reorderColumn: 'Reorder items',
                                deleteAll: 'Remove all items',
                                deleteAllConfirmation: {
                                    confirmationTitle: 'Delete all',
                                    confirmationMessage: 'Are you sure you want to delete all items?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        },
                        row: {
                            locale: {
                                suffix: ' listed creator',
                                moveUpHint: 'Move item up the order',
                                moveDownHint: 'Move item down the order',
                                deleteHint: 'Remove this item',
                                ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
                                deleteRecordConfirmation: {
                                    confirmationTitle: 'Delete item',
                                    confirmationMessage: 'Are you sure you want to delete this item?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        },
                    }
                },
                contributor: {
                    title: 'Contributors',
                    description: 'Provide a list of contributors for this publication',
                    help: {
                        title: 'Contributors',
                        text: 'This is the contributor, and may be different to the creator, e.g. interviewee, performer (if not self-produced). Please enter contributors in the order and form they appear on the work or associated material. Examples of associated material are programs or promotional material. Additional boxes will appear for more contributors.',
                        buttonLabel: 'OK'
                    },
                    field: {
                        form: {
                            locale: {
                                nameAsPublishedLabel: 'Contributor\'s name as published',
                                nameAsPublishedHint: 'Please type the name exactly as published',
                                identifierLabel: 'UQ identifier (if available)',
                                addButton: 'Add contributor'
                            }
                        },
                        header: {
                            locale: {
                                contributorAssignmentColumn: 'Select your name',
                                nameColumn: 'Contributor\'s name as published',
                                identifierColumn: 'UQ identifier',
                                reorderColumn: 'Reorder items',
                                deleteAll: 'Remove all items',
                                deleteAllConfirmation: {
                                    confirmationTitle: 'Delete all',
                                    confirmationMessage: 'Are you sure you want to delete all items?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        },
                        row: {
                            locale: {
                                suffix: ' listed contributor',
                                moveUpHint: 'Move item up the order',
                                moveDownHint: 'Move item down the order',
                                deleteHint: 'Remove this item',
                                ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
                                deleteRecordConfirmation: {
                                    confirmationTitle: 'Delete item',
                                    confirmationMessage: 'Are you sure you want to delete this item?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        }
                    }
                },
                optional: {
                    title: 'Optional information',
                    help: {
                        title: 'Optional information',
                        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tempor, purus eget posuere fermentum, turpis magna auctor metus, in tincidunt est augue et orci.',
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
                creator: {
                    title: 'Creator name',
                    description: 'Enter authors in the order and form they appear on the published paper. Additional boxes will appear for more authors.',
                    help: {
                        title: 'Creators',
                        text: 'Enter authors in the order and form they appear on the published paper. Additional boxes will appear for more authors.',
                        buttonLabel: 'OK'
                    },
                    field: {
                        form: {
                            locale: {
                                nameAsPublishedLabel: 'Creator\'s name as published',
                                nameAsPublishedHint: 'Please type the name exactly as published',
                                identifierLabel: 'UQ identifier (if available)',
                                addButton: 'Add creator'
                            }
                        },
                        header: {
                            locale: {
                                contributorAssignmentColumn: 'Select your name',
                                nameColumn: 'creator\'s name as published',
                                identifierColumn: 'UQ identifier',
                                reorderColumn: 'Reorder items',
                                deleteAll: 'Remove all items',
                                deleteAllConfirmation: {
                                    confirmationTitle: 'Delete all',
                                    confirmationMessage: 'Are you sure you want to delete all items?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        },
                        row: {
                            locale: {
                                suffix: ' listed creator',
                                moveUpHint: 'Move item up the order',
                                moveDownHint: 'Move item down the order',
                                deleteHint: 'Remove this item',
                                ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
                                deleteRecordConfirmation: {
                                    confirmationTitle: 'Delete item',
                                    confirmationMessage: 'Are you sure you want to delete this item?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        },
                    }
                },
                optional: {
                    title: 'Optional information',
                    help: {
                        title: 'Optional information',
                        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tempor, purus eget posuere fermentum, turpis magna auctor metus, in tincidunt est augue et orci.',
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
                authors: {
                    title: 'Designer name',
                    description: 'Enter designers in the order and form they appear on the published paper. Additional boxes will appear for more authors.',
                    help: {
                        title: 'Designers',
                        text: 'Enter designers in the order and form they appear on the published paper. Additional boxes will appear for more authors.',
                        buttonLabel: 'OK'
                    },
                    field: {
                        form: {
                            locale: {
                                nameAsPublishedLabel: 'Designer name as published',
                                nameAsPublishedHint: 'Please type the name exactly as published',
                                identifierLabel: 'UQ identifier (if available)',
                                addButton: 'Add designer'
                            }
                        },
                        header: {
                            locale: {
                                contributorAssignmentColumn: 'Select your name',
                                nameColumn: 'Designers name as published',
                                identifierColumn: 'UQ identifier',
                                reorderColumn: 'Reorder items',
                                deleteAll: 'Remove all items',
                                deleteAllConfirmation: {
                                    confirmationTitle: 'Delete all',
                                    confirmationMessage: 'Are you sure you want to delete all items?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        },
                        row: {
                            locale: {
                                suffix: ' listed designer',
                                moveUpHint: 'Move item up the order',
                                moveDownHint: 'Move item down the order',
                                deleteHint: 'Remove this item',
                                ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
                                deleteRecordConfirmation: {
                                    confirmationTitle: 'Delete item',
                                    confirmationMessage: 'Are you sure you want to delete this item?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        },
                    }
                },
                optional: {
                    title: 'Optional information',
                    help: {
                        title: 'Optional information',
                        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tempor, purus eget posuere fermentum, turpis magna auctor metus, in tincidunt est augue et orci.',
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
                authors: {
                    title: 'Authors',
                    help: {
                        title: 'Authors',
                        text: 'some help',
                        buttonLabel: 'OK'
                    },
                    description: 'Enter authors in the order and form they appear on the published paper. Additional boxes will appear for more authors.',
                    field: {
                        form: {
                            locale: {
                                nameAsPublishedLabel: 'Author\'s name as published',
                                nameAsPublishedHint: 'Please, type the name exactly as published',
                                identifierLabel: 'UQ identifier (if available)',
                                addButton: 'Add author'
                            }
                        },
                        header: {
                            locale: {
                                contributorAssignmentColumn: 'Select your name',
                                nameColumn: 'Author\'s name as published',
                                identifierColumn: 'UQ identifier',
                                reorderColumn: 'Reorder items',
                                deleteAll: 'Remove all items',
                                deleteAllConfirmation: {
                                    confirmationTitle: 'Delete all',
                                    confirmationMessage: 'Are you sure you want to delete all items?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        },
                        row: {
                            locale: {
                                suffix: ' listed author',
                                moveUpHint: 'Move item up the order',
                                moveDownHint: 'Move item down the order',
                                deleteHint: 'Remove this item',
                                ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
                                deleteRecordConfirmation: {
                                    confirmationTitle: 'Delete item',
                                    confirmationMessage: 'Are you sure you want to delete this item?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        }
                    }
                },
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
                authors: {
                    title: 'Authors',
                    help: {
                        title: 'Authors',
                        text: 'some help',
                        buttonLabel: 'OK'
                    },
                    description: 'Enter authors in the order and form they appear on the published paper. Additional boxes will appear for more authors.',
                    field: {
                        form: {
                            locale: {
                                nameAsPublishedLabel: 'Author\'s name as published',
                                nameAsPublishedHint: 'Please, type the name exactly as published',
                                identifierLabel: 'UQ identifier (if available)',
                                addButton: 'Add author'
                            }
                        },
                        header: {
                            locale: {
                                contributorAssignmentColumn: 'Select your name',
                                nameColumn: 'Author\'s name as published',
                                identifierColumn: 'UQ identifier',
                                reorderColumn: 'Reorder items',
                                deleteAll: 'Remove all items',
                                deleteAllConfirmation: {
                                    confirmationTitle: 'Delete all',
                                    confirmationMessage: 'Are you sure you want to delete all items?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        },
                        row: {
                            locale: {
                                suffix: ' listed author',
                                moveUpHint: 'Move item up the order',
                                moveDownHint: 'Move item down the order',
                                deleteHint: 'Remove this item',
                                ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
                                deleteRecordConfirmation: {
                                    confirmationTitle: 'Delete item',
                                    confirmationMessage: 'Are you sure you want to delete this item?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        }
                    }
                },
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
                authors: {
                    title: 'Authors',
                    help: {
                        title: 'Authors',
                        text: 'some help',
                        buttonLabel: 'OK'
                    },
                    description: 'Enter authors in the order and form they appear on the published paper. Additional boxes will appear for more authors.',
                    field: {
                        form: {
                            locale: {
                                nameAsPublishedLabel: 'Author\'s name as published',
                                nameAsPublishedHint: 'Please, type the name exactly as published',
                                identifierLabel: 'UQ identifier (if available)',
                                addButton: 'Add author'
                            }
                        },
                        header: {
                            locale: {
                                contributorAssignmentColumn: 'Select your name',
                                nameColumn: 'Author\'s name as published',
                                identifierColumn: 'UQ identifier',
                                reorderColumn: 'Reorder items',
                                deleteAll: 'Remove all items',
                                deleteAllConfirmation: {
                                    confirmationTitle: 'Delete all',
                                    confirmationMessage: 'Are you sure you want to delete all items?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        },
                        row: {
                            locale: {
                                suffix: ' listed author',
                                moveUpHint: 'Move item up the order',
                                moveDownHint: 'Move item down the order',
                                deleteHint: 'Remove this item',
                                ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
                                deleteRecordConfirmation: {
                                    confirmationTitle: 'Delete item',
                                    confirmationMessage: 'Are you sure you want to delete this item?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        }
                    }
                },
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
                editors: {
                    title: 'Editors',
                    help: {
                        title: 'Editors',
                        text: 'some help',
                        buttonLabel: 'OK'
                    },
                    description: 'Provide a list of editors for this publication and assign yourself as an editor',
                    field: {
                        form: {
                            locale: {
                                nameAsPublishedLabel: 'Editor\'s name as published',
                                nameAsPublishedHint: 'Please type the name exactly as published',
                                identifierLabel: 'UQ identifier (if available)',
                                addButton: 'Add editor'
                            }
                        },
                        header: {
                            locale: {
                                contributorAssignmentColumn: 'Select your name',
                                nameColumn: 'Editor\'s name as published',
                                identifierColumn: 'UQ identifier',
                                reorderColumn: 'Reorder items',
                                deleteAll: 'Remove all items',
                                deleteAllConfirmation: {
                                    confirmationTitle: 'Delete all',
                                    confirmationMessage: 'Are you sure you want to delete all items?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        },
                        row: {
                            locale: {
                                suffix: ' listed editor',
                                moveUpHint: 'Move item up the order',
                                moveDownHint: 'Move item down the order',
                                deleteHint: 'Remove this item',
                                ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
                                deleteRecordConfirmation: {
                                    confirmationTitle: 'Delete item',
                                    confirmationMessage: 'Are you sure you want to delete this item?',
                                    cancelButtonLabel: 'No',
                                    confirmButtonLabel: 'Yes'
                                }
                            }
                        }
                    }
                },
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
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet ac risus et blandit. Vivamus varius ornare metus vitae sagittis. Donec erat urna, interdum vitae faucibus a, tempus eu orci. Aenean venenatis lacus eu sapien dignissim, non rhoncus dolor facilisis. Donec finibus tristique nunc nec facilisis. Pellentesque luctus libero faucibus ex mattis, vitae commodo nunc vehicula. Nam nec porttitor sapien. Sed rutrum, mauris id luctus eleifend, eros lectus auctor nibh, a eleifend est est eu nunc.',
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
        }
    }
};
