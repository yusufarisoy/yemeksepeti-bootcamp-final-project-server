exports.parseQueryParamsWithPlaceHolders = (params, joinSeparator) => {
    const keys = Object.keys(params);
    const values = Object.values(params);
    const keySet = keys.map(key => `${key} = ?`).join(joinSeparator);
    
    return { keySet, values };
}