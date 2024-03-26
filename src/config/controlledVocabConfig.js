export const controlledVocabConfig = {
    addNewVocabularyText: 'Add New Controlled Vocabulary',
    addNewCollectionText: 'Add New Collection',
    collapseSwitchText: 'Auto-close other expanded',
    viewControlledVocabTitle: 'Explore',
    viewControlledVocabText: 'View',
    vocabCountTitle: total => `Displaying ${total} total controlled vocabularies`,
    collectionCountTitle: (start, end, total, community) =>
        `Displaying ${start} to ${end} of ${total} child controlled vocabularies for '${community}'`,
    formatCreationDate: date => `Created: ${date}`,
    formatUpdatedDate: date => `Updated: ${date}`,
};
