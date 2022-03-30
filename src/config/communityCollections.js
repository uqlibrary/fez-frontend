import { PATH_PREFIX, APP_URL } from 'config';
export const communityCollectionsConfig = {
    addNewCommunityText: 'Add New Community',
    addNewCollectionText: 'Add New Collection',
    collapseSwitchText: 'Auto-close collections',
};

export const ccBulkActions = [
    {
        label: 'Bulk move records',
        url: pid => `/collections/bulk/move?pid=${pid}`,
        api: pid => `${APP_URL}${PATH_PREFIX}admin/bulk/${pid}`,
        inApp: true,
        showInDeleted: true,
        options: null,
        isRecordEdit: true,
    },
];
