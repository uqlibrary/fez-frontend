export const leftJoin = (objArr1, objArr2, key1, key2) => {
    if (!objArr2) {
        return objArr1;
    }
    return objArr1.map(
        anObj1 => ({
            ...objArr2.find(
                anObj2 => anObj1[key1] === anObj2[key2]
            ),
            ...anObj1
        })
    );
};
