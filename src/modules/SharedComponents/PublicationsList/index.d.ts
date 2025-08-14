import * as React from 'react';

export interface PagingData {
    from?: number;
    to?: number;
    total?: number;
    per_page?: number;
    current_page?: number;
}

export interface SortingDefaults {
    sortDirection?: string;
    sortBy?: string;
    pageSize?: number;
}

export interface PublicationsListSortingProps {
    bulkExportSize?: number;
    canUseExport?: boolean;
    exportData?: Record<string, any>;
    disabled?: boolean;
    initPageLength?: number;
    onExportPublications?: (args: { exportPublicationsFormat: string | number }) => void;
    onPageSizeChanged?: (pageSize: number) => void;
    onSortByChanged?: (sortBy: string, sortDirection: string) => void;
    pageSize?: number;
    showDisplayAs?: boolean;
    sortingData?: Record<string, any>;
    pagingData?: PagingData;
    sortingDefaults?: SortingDefaults;
    sortBy?: string;
    sortDirection?: string;
    onDisplayRecordsAsChanged?: (value: string) => void;
    displayRecordsAs?: string;
}

export interface PublicationsListProps {
    // loading state used in PossiblyMyRecords
    publicationsLoading?: boolean;

    // data
    publicationsList?: any[];
    publicationsListSubset?: any[];

    // actions
    customActions?: Array<{
        label: string;
        handleAction: (item: any) => void;
        primary?: boolean;
    }>;
    subsetCustomActions?: Array<{
        label: string;
        disabled?: boolean;
        primary?: boolean;
    }>;

    // optional extras (keep loose to match component flexibility)
    disabled?: boolean;
    pagingData?: PagingData;
    sortingData?: Record<string, any>;
    sortingDefaults?: SortingDefaults;
    pageSize?: number;
    sortBy?: string;
    sortDirection?: string;
    displayRecordsAs?: string;
    canUseExport?: boolean;
    bulkExportSize?: number;
    exportData?: Record<string, any>;
    onExportPublications?: (args: { exportPublicationsFormat: string | number }) => void;
    onPageSizeChanged?: (pageSize: number) => void;
    onSortByChanged?: (sortBy: string, sortDirection: string) => void;
    onDisplayRecordsAsChanged?: (value: string) => void;
}

export interface PublicationsListPagingProps {
    pagingData?: PagingData;
    pageSize?: number;
    disabled?: boolean;
    onPageChanged?: (pageIndex: number) => void;
    onPageSizeChanged?: (pageSize: number) => void;
    pagingId?: string;
    loading?: boolean;
}

export interface FacetsFilterProps {
    disabled?: boolean;
    facetsData?: Record<string, any> | any[];
    activeFacets?: {
        filters?: Record<string, string | number | boolean>;
        ranges?: Record<string, string | number>;
    };
    onFacetsChanged?: (active: NonNullable<FacetsFilterProps['activeFacets']>) => void;
    excludeFacetsList?: string[];
    renameFacetsList?: Record<string, string>; // Accept either a simple map or a per-value lookup map
    lookupFacetsList?: Record<string, string> | Record<string, Record<string, string>>;
}

export interface PublicationListLoadingProgressProps {
    loading?: boolean;
    total?: number;
    progress?: number;
    message?: string;
}

export declare const filterCollectionViewTypes: () => any[];

export const PublicationsList: React.FC<PublicationsListProps>;
export const PublicationsListPaging: React.FC<PublicationsListPagingProps>;
export const PublicationsListSorting: React.FC<PublicationsListSortingProps>;
export const FacetsFilter: React.FC<FacetsFilterProps>;
export const PublicationListLoadingProgress: React.FC<PublicationListLoadingProgressProps>;
