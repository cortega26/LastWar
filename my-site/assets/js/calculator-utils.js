export function calculateTotalProduction(farms, rates) {
    let total = 0;
    for (const [farmNum, level] of Object.entries(farms)) {
        if (level > 0) {
            total += rates[level] || 0;
        }
    }
    return total;
}

export function formatTime(hours) {
    const days = Math.floor(hours / 24);
    const remainingHours = Math.floor(hours % 24);
    const minutes = Math.floor((hours % 1) * 60);

    if (days > 0) {
        return `${days}d ${remainingHours}h ${minutes}m`;
    } else if (remainingHours > 0) {
        return `${remainingHours}h ${minutes}m`;
    } else {
        return `${minutes}m`;
    }
}
