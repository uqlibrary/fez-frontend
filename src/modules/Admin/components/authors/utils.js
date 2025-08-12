export const commitRowChanges = table => {
    const row = table.getState().creatingRow || table.getState().editingRow;
    if (!row) return;

    const values = { ...(row._valuesCache || {}) };
    table.getState().creatingRow
        ? table.options.onCreatingRowSave?.({ table, row, values })
        : table.options.onEditingRowSave?.({ table, row, values });
};
