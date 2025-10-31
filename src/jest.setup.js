import '@testing-library/jest-dom';
import { toMatchDiffSnapshot } from 'snapshot-diff';
import { configure } from '@testing-library/react';

const extensions = {
    toHaveDispatchedActions: (actions, expectedActions) => {
        let pass = actions.length === expectedActions.length;
        if (pass) {
            actions.map((item, index) => {
                if (item.type !== expectedActions[index]) {
                    pass = false;
                    return;
                }
            });
        }
        return {
            message: () =>
                `received actions don't match expected actions [${actions.map(
                    action => action.type,
                )}] vs [${expectedActions.map(action => action)}]`,
            pass: pass,
        };
    },
    toHaveAnyOrderDispatchedActions: (actions, expectedActions) => {
        let pass = actions.length === expectedActions.length;
        if (pass) {
            const sortedActions = actions.sort((a, b) => (a.type > b.type ? -1 : 1));
            const sortedExpectedActions = expectedActions.sort((a, b) => (a > b ? -1 : 1));

            sortedActions.map((item, index) => {
                if (item.type !== sortedExpectedActions[index]) {
                    pass = false;
                    return;
                }
            });
        }
        return {
            message: () =>
                `received actions don't match expected actions [${actions.map(
                    action => action.type,
                )}] vs [${expectedActions.map(action => action)}]`,
            pass: pass,
        };
    },
    toHaveAttributeValue: (element, attributeName, valueToVerify) => {
        const actualValue = element.getAttribute(attributeName);
        const pass = actualValue === valueToVerify;
        return pass
            ? {
                  message: () => `${element.tagName} has attribute "${attributeName}" set to "${valueToVerify}"`,
                  pass: true,
              }
            : {
                  message: () =>
                      `expected ${element.tagName} to have attribute "${attributeName}" set to "${valueToVerify}", received "${actualValue}"`,
                  pass: false,
              };
    },
    toMatchDiffSnapshot,
    /**
     * Count the number of rows in a Material React Table.
     * @param {*} element The container to perform the check on.
     * @param {*} length The expected number of rows.
     * @param {*} options Options to customize the check. includeHeader: boolean, includeDetailPanel: boolean
     * @param {boolean} options.includeHeader Whether to include the header row in the count
     * @param {boolean} options.includeDetailPanel Whether to include detail panel rows in the count
     * @returns pass or fail object
     */
    toHaveTableRowsLength: (element, length, options = { includeHeader: false, includeDetailPanel: false }) => {
        const lengthAll = element.querySelectorAll('tr.MuiTableRow-root').length;
        const lengthDetailPanel = element.querySelectorAll('tr.Mui-TableBodyCell-DetailPanel ').length;
        const totalLength = options.includeDetailPanel ? lengthAll : lengthAll - lengthDetailPanel;
        const pass = totalLength - (options.includeHeader ? 0 : 1) === length;
        return pass
            ? {
                  message: () =>
                      `expected ${element.tagName} to have ${length} rows, received ${
                          totalLength - (options.includeHeader ? 0 : 1)
                      }`,
                  pass: true,
              }
            : {
                  message: () =>
                      `expected ${element.tagName} to have ${length} rows, received ${
                          totalLength - (options.includeHeader ? 0 : 1)
                      }`,
                  pass: false,
              };
    },
};

configure({ asyncUtilTimeout: 5000 }); // Default timeout for all async queries

expect.extend(extensions);
global.expect = expect;
