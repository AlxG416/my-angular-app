export function isEmptyObject(obj: any) {
    return obj && typeof obj === 'object' && !Array.isArray(obj) 
        && Object.keys(obj).length === 0;
}