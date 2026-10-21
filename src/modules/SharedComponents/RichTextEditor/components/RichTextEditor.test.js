import React from 'react';
import { rtlRender } from 'test-utils';
import RichTextEditor from './RichTextEditor';
import { createExtensions } from './createExtensions';

const mockEditor = {
    isDestroyed: false,
    isInitialized: true,
    editorView: { dom: { isConnected: true } },
    getHTML: jest.fn(() => '<p>Old Content</p>'),
    commands: { setContent: jest.fn() },
};

jest.mock('mui-tiptap', () => {
    const actual = jest.requireActual('mui-tiptap');

    return {
        ...actual,

        useRichTextEditorContext: () => mockEditor,
        /* eslint-disable-next-line react/prop-types */
        RichTextEditor: ({ children, renderControls, editorProps }) => (
            <div data-testid="mock-rich-text-editor">
                {renderControls?.(mockEditor)}

                {/* eslint-disable-next-line react/prop-types */}
                <div className="ProseMirror" {...editorProps?.attributes}>
                    {children?.(mockEditor)}
                </div>
            </div>
        ),

        LinkBubbleMenu: () => null,
    };
});

jest.mock('./createExtensions', () => ({
    createExtensions: jest.fn(() => []),
}));

jest.mock('./RichTextToolbar', () => () => <div data-testid="rich-text-toolbar" />);

function setup(testProps = {}) {
    const props = {
        value: '<p>Hello World</p>',
        onChange: jest.fn(),
        ...testProps,
    };

    return {
        ...rtlRender(<RichTextEditor {...props} />),
        props,
    };
}

describe('RichTextEditor', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockEditor.isDestroyed = false;
        mockEditor.isInitialized = true;
    });

    it('should render editor', () => {
        const { container } = setup({ singleLine: true, description: 'Description' });

        expect(container.querySelector('.ProseMirror')).toBeInTheDocument();
    });

    it('should render toolbar', () => {
        const { getByTestId } = setup();

        expect(getByTestId('rich-text-toolbar')).toBeInTheDocument();
    });

    it('should render editor id', () => {
        const { container } = setup({
            id: 'test-editor',
        });

        expect(container.querySelector('#test-editor')).toBeInTheDocument();
    });

    it('should render editor test id', () => {
        const { getByTestId } = setup({
            id: 'test-editor',
        });

        expect(getByTestId('test-editor')).toBeInTheDocument();
    });

    it('should pass textOnlyOnPaste option to createExtensions', () => {
        setup({
            preservePasteFormatting: false,
        });

        expect(createExtensions).toHaveBeenCalledWith({
            singleLine: false,
            preservePasteFormatting: false,
        });
    });

    it('should not render toolbar when editor is destroyed', () => {
        mockEditor.isDestroyed = true;

        const { queryByTestId } = setup();

        expect(queryByTestId('rich-text-toolbar')).not.toBeInTheDocument();
    });

    it('should not render toolbar before editor is initialized', () => {
        mockEditor.editorView.dom.isConnected = false;

        const { queryByTestId } = setup();

        expect(queryByTestId('rich-text-toolbar')).not.toBeInTheDocument();
    });

    it('should render empty editor when value is empty', () => {
        const { container } = setup({
            value: '',
        });

        expect(container.querySelector('.ProseMirror')).toBeInTheDocument();
    });

    it('should handle null value', () => {
        const { container } = setup({
            value: null,
        });

        expect(container.querySelector('.ProseMirror')).toBeInTheDocument();
    });

    it('should render error from state', () => {
        const { getByText } = setup({
            state: {
                error: 'This field is required',
            },
        });

        expect(getByText('This field is required')).toBeInTheDocument();
    });

    it('should render errorText', () => {
        const { getByText } = setup({
            description: 'Description',
            error: true,
            errorText: 'This field is required',
        });

        expect(getByText('This field is required')).toBeInTheDocument();
    });

    it('should render errorText object', () => {
        const { getByText } = setup({
            title: 'Title',
            error: true,
            errorText: {
                message: 'This field is required',
            },
        });

        expect(getByText('This field is required')).toBeInTheDocument();
    });

    it('should render required indicator', () => {
        const { getByText } = setup({
            title: 'Description',
            required: true,
        });

        expect(getByText(/Description/)).toHaveTextContent('Description *');
    });

    it('should render character count', () => {
        const { getByText } = setup({
            maxValue: 500,
        });

        expect(getByText('0 characters of 500')).toBeInTheDocument();
    });

    it('should render error and character count', () => {
        const { getByText } = setup({
            maxValue: 100,
            state: {
                error: 'This field is required',
            },
        });

        expect(getByText('This field is required')).toBeInTheDocument();
        expect(getByText('0 characters of 100')).toBeInTheDocument();
    });
});
