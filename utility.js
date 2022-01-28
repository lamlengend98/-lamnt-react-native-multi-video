export const formatTime = (sec) => {
    sec = Math.floor(sec);
    let hours = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - (hours * 3600)) / 60);
    let seconds = sec - (hours * 3600) - (minutes * 60);
    return `${(hours ? (hours < 10 ? '0' + hours + ':' : hours + ':') : '')}${minutes ? (minutes < 10 ? '0' + minutes : minutes) : '0'}:${seconds < 10 ? '0' + seconds : seconds}`;
}

export const calculatePercentage = (total, covered) => {
    return ((covered / total) * 100) + '%'
}