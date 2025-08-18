import React from 'react';
import { rtlRender } from 'test-utils';

import NewListEditorField from './NewListEditorField';
import { GenericTemplate } from './components/GenericTemplate';
import { FreeTextForm } from './components/FreeTextForm';

describe('NewListEditorField component', () => {
    it('should render new list editor component with the given array', () => {
        const props = {
            state: {
                error: 'test1',
            },
            onChange: jest.fn(),
            value: [
                { rek_keywords: 'test', rek_keywords_order: 1 },
                { rek_keywords: 'testing', rek_keywords_order: 2 },
            ],
            remindToAdd: true,
            maxInputLength: 100,
            searchKey: {
                value: 'rek_keywords',
                order: 'rek_keywords_order',
            },
            listEditorId: 'test',
            ListEditorForm: FreeTextForm,
            ListEditorItemTemplate: GenericTemplate,
        };
        const { asFragment } = rtlRender(<NewListEditorField {...props} />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('should render new list editor component with the given List', () => {
        const props = {
            state: {
                error: 'test1',
            },
            onChange: jest.fn(),
            value: [
                { rek_keywords: 'test', rek_keywords_order: 1 },
                { rek_keywords: 'testing', rek_keywords_order: 2 },
            ],
            remindToAdd: true,
            maxInputLength: 100,
            searchKey: {
                value: 'rek_keywords',
                order: 'rek_keywords_order',
            },
            listEditorId: 'test',
            ListEditorForm: FreeTextForm,
            ListEditorItemTemplate: GenericTemplate,
        };
        const { asFragment } = rtlRender(<NewListEditorField {...props} />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('should render new list editor component without any list items', () => {
        const props = {
            onChange: jest.fn(),
            remindToAdd: true,
            maxInputLength: 100,
            searchKey: {
                value: 'rek_keywords',
                order: 'rek_keywords_order',
            },
            listEditorId: 'test',
            ListEditorForm: FreeTextForm,
            ListEditorItemTemplate: GenericTemplate,
        };
        const { asFragment } = rtlRender(<NewListEditorField {...props} />);
        expect(asFragment()).toMatchSnapshot();
    });
});
