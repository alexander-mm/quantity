export function getNextSequentialCode(lastCode: string | null | undefined): string {

    if (!lastCode) {
        return "";
    }

    const match = lastCode.match(/^(.*?)(\d+)$/);

    if (!match) {
        return "";
    }

    const [, prefix, digits] = match;
    const next = (Number(digits) + 1).toString().padStart(digits.length, "0");

    return `${prefix}${next}`;

}
