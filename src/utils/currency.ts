
export function formatCurrency(value: any) {
    let converter = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });

    return converter.format(value || 0);
}