export function formatDate(date: Date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

export function getYearFromDate(date: Date) {
    return date.getFullYear();
}

export function getDate(numberOfYearsToMoveForwardOrBackward: number) : string{
    let date =  new Date(new Date().setFullYear(new Date().getFullYear() + numberOfYearsToMoveForwardOrBackward));
    return formatDate(date)
}

export function getYear(numberOfYearsToMoveForwardOrBackward: number) : string{
    let date =  new Date(new Date().setFullYear(new Date().getFullYear() + numberOfYearsToMoveForwardOrBackward));
    return getYearFromDate(date).toString()
}
