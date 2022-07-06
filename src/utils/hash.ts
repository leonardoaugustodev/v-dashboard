export function generateId(type: string) {
    const hash = new Date().valueOf().toString();
    return <string>`${type}_${hash}`;
}