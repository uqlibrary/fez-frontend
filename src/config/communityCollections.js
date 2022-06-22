export const communityCollectionsConfig = {
    addNewCommunityText: 'Add New Community',
    addNewCollectionText: 'Add New Collection',
    collapseSwitchText: 'Auto-close collections',
    viewCommunityTitle: 'Explore',
    viewCommunityText: 'View',
    communityCountTitle: (start, end, total) =>
        `Displaying communities ${start} to ${end} of ${total} total communities`,
    collectionCountTitle: (start, end, total, community) =>
        `Displaying ${start} to ${end} of ${total} collections for '${community}'`,
    formatCreationDate: date => `Created: ${date}`,
    formatUpdatedDate: date => `Updated: ${date}`,
};
