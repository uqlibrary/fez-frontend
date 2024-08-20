import React from 'react';
import NewListEditorField from './NewListEditorField';
import { List } from 'immutable';
import { rtlRender } from 'test-utils';
import { GenericTemplate } from './components/GenericTemplate';
import { FreeTextForm } from './components/FreeTextForm';

describe('NewListEditorField component', () => {
    it('should render new list editor component with the given array', () => {
        const props = {
            meta: {
                error: 'test1',
            },
            input: {
                onChange: jest.fn(),
                value: [
                    { rek_keywords: 'test', rek_keywords_order: 1 },
                    { rek_keywords: 'testing', rek_keywords_order: 2 },
                ],
            },
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
            meta: {
                error: 'test1',
            },
            input: {
                onChange: jest.fn(),
                value: new List([
                    { rek_keywords: 'test', rek_keywords_order: 1 },
                    { rek_keywords: 'testing', rek_keywords_order: 2 },
                ]),
            },
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
            input: {
                onChange: jest.fn(),
            },
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
