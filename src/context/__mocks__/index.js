// Manual mock for the `context` module (used whenever a test calls jest.mock('context')).
//
// The real hooks are thin `useContext` wrappers. The automock replaced them with jest.fn()s that
// return undefined, so a component reading e.g. `const { account } = useAccountContext()` crashed
// unless the test set a return value. Whether it crashed depended on module load order, which made a
// set of tests silently dependent on the eager config/axios import priming the graph.
//
// This mock keeps each hook an overridable jest.fn() (tests can still call mockImplementation /
// mockReturnValue) but defaults it to the real context's value via useContext, so behaviour is
// deterministic regardless of import order. The context objects are the real ones, so Providers work.
const React = require('react');
const actual = jest.requireActual('context');

const contextObjects = {
    AccountContext: actual.AccountContext,
    EditableContext: actual.EditableContext,
    FormErrorsContext: actual.FormErrorsContext,
    LocallyStoredReducerContext: actual.LocallyStoredReducerContext,
    OrcidSyncContext: actual.OrcidSyncContext,
    RecordContext: actual.RecordContext,
    RecordsSelectorContext: actual.RecordsSelectorContext,
    ScrollToSectionContext: actual.ScrollToSectionContext,
    TabbedContext: actual.TabbedContext,
    JournalContext: actual.JournalContext,
};

module.exports = {
    ...contextObjects,
    useAccountContext: jest.fn(() => React.useContext(actual.AccountContext)),
    useEditableContext: jest.fn(() => React.useContext(actual.EditableContext)),
    useFormErrorsContext: jest.fn(() => React.useContext(actual.FormErrorsContext)),
    useLocallyStoredReducerContext: jest.fn(() => React.useContext(actual.LocallyStoredReducerContext)),
    useOrcidSyncContext: jest.fn(() => React.useContext(actual.OrcidSyncContext)),
    useRecordContext: jest.fn(() => React.useContext(actual.RecordContext)),
    useRecordsSelectorContext: jest.fn(() => React.useContext(actual.RecordsSelectorContext)),
    useTabbedContext: jest.fn(() => React.useContext(actual.TabbedContext)),
    useScrollToSectionContext: jest.fn(() => React.useContext(actual.ScrollToSectionContext)),
    useJournalContext: jest.fn(() => React.useContext(actual.JournalContext)),
};
