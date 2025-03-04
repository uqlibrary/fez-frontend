import React from 'react';
import { SecuritySelector } from './SecuritySelector';
import { rtlRender, FormProviderWrapper } from 'test-utils';
jest.mock('../../../../context');

function setup(testProps = {}) {
    const props = {
        classes: {},
        disabled: false,
        selectedPolicyKey: 1,
        securitySelectorId: 'rek-security',
        text: {
            description: 'test1',
            prompt: 'test2',
            dataStream: {
                overridePrompt: 'test3',
            },
        },
        fieldName: 'test',
        recordType: 'community',
        ...testProps,
    };
    return rtlRender(
        <FormProviderWrapper>
            <SecuritySelector {...props} />
        </FormProviderWrapper>,
    );
}

describe('SecuritySelector component', () => {
    it('should render properly for community', async () => {
        const testProps = {
            disabled: false,
            text: {
                description: 'test description for community',
                prompt: 'test2',
                selectedTitle: 'test3',
            },
            securityPolicy: 2,
        };
        const { getByText, getByTestId } = setup(testProps);
        expect(getByText(testProps.text.description)).toBeInTheDocument();
        expect(getByTestId('rek-security-input')).toBeInTheDocument();
        expect(getByText('Theses Assessors (2)')).toBeInTheDocument();
    });

    it('should render properly for community without policy', async () => {
        const testProps = {
            disabled: false,
            text: {
                description: 'test description for community',
                prompt: 'test2',
                selectedTitle: 'test3',
            },
        };
        const { getByText, queryByText, getByTestId } = setup(testProps);
        expect(getByText(testProps.text.description)).toBeInTheDocument();
        expect(getByTestId('rek-security-input')).toBeInTheDocument();
        expect(queryByText('Theses Assessors (2)')).not.toBeInTheDocument();
    });

    it('should render properly for collection', () => {
        const testProps = {
            disabled: false,
            text: {
                description: 'test description for collection',
                prompt: 'test2',
                selectedTitle: 'test3',
            },
            securityPolicy: 2,
            recordType: 'collection',
        };
        const { getByText, getByTestId } = setup(testProps);
        expect(getByText(testProps.text.description)).toBeInTheDocument();
        expect(getByTestId('rek-security-input')).toBeInTheDocument();
        expect(getByText('Theses Assessors (2)')).toBeInTheDocument();
    });

    it('should render properly for record', () => {
        const testProps = {
            disabled: false,
            text: {
                description: 'test description for record',
                prompt: 'test2',
                selectedTitle: 'test3',
            },
            securityPolicy: 2,
            recordType: 'record',
        };
        const { getByText, getByTestId } = setup(testProps);
        expect(getByText(testProps.text.description)).toBeInTheDocument();
        expect(getByTestId('rek-security-input')).toBeInTheDocument();
        expect(getByText('Theses Assessors (2)')).toBeInTheDocument();
    });
});
