import PublicationForm from './PublicationForm';
import React from 'react';
import { render, WithReduxStore, WithRouter } from 'test-utils';

function setup(props = {}, renderMethod = render) {
    return renderMethod(
        <WithReduxStore>
            <WithRouter>
                <PublicationForm {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('Component PublicationForm', () => {
    it('should render component initialised with just one field - publication type', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
        expect(container.getElementsByTagName('field').length).toEqual(1);
    });

    it('should render component initialised with two fields - publication type and subtype', () => {
        const { container } = setup({});

        expect(container).toMatchSnapshot();
        expect(container.getElementsByTagName('field').length).toEqual(2);
    });

    it('should render form after selecting both publication type and subtype (Journal article/Editorial)', () => {
        const { container } = setup({});

        expect(container).toMatchSnapshot();
        expect(container.getElementsByTagName('field').length).toEqual(2);
    });

    it('should render component with JournalArticleForm', () => {
        const { container, getByText } = setup({});

        expect(container).toMatchSnapshot();
        expect(getByText('Journal article information')).toBeInTheDocument();
        expect(container.querySelectorAll('field[name=files]').length).toEqual(1);
    });

    it('should render component with BookForm', () => {
        const { getByText, container } = setup({});

        expect(getByText('Book information')).toBeInTheDocument();
        expect(container.querySelectorAll('field[name=files]').length).toEqual(1);
        expect(container).toMatchSnapshot();
    });

    it('should render component with GenericDocument', () => {
        const { getByText, container } = setup({});
        expect(getByText('Generic document information')).toBeInTheDocument();

        expect(container.querySelectorAll('field[name=files]').length).toEqual(1);
        expect(container).toMatchSnapshot();
    });

    it('should render component with ResearchReportForm', () => {
        const { getByText, container } = setup({});
        expect(getByText('Research report information')).toBeInTheDocument();

        expect(container.querySelectorAll('field[name=files]').length).toEqual(1);
        expect(container).toMatchSnapshot();
    });

    it('should render component with all fields disabled', () => {
        const { container } = setup({});
        container.querySelectorAll('field').forEach(field => {
            expect(field).toHaveAttribute('disabled', 'true');
        });
        expect(container).toMatchSnapshot();
    });

    it('should call onFormSubmitSuccess method', () => {
        const testMethod = jest.fn();
        const { rerender } = setup({
            onFormSubmitSuccess: testMethod,
        });
        setup(
            {
                onFormSubmitSuccess: testMethod,
            },
            rerender,
        );
        expect(testMethod).toHaveBeenCalled();
    });

    it('Shows an alert', () => {
        const props = {};
        const { container, rerender } = setup({ ...props });
        expect(container).toMatchSnapshot();
        setup({ ...props, formComponent: () => 'test' }, rerender);
        expect(container).toMatchSnapshot();
        setup({ ...props, submitSucceeded: true }, rerender);
        expect(container).toMatchSnapshot();
    });

    it('should require file upload for ntro fields', () => {
        const { container } = setup({});
        expect(container.querySelector('field[name=files]')).toHaveAttribute(
            'validate',
            'fileUploadRequired,validFileUpload',
        );
    });
});
