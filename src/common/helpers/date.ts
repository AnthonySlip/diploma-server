export function getCurrentDate(): Date {
    return new Date(new Date().toUTCString())
}