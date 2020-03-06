/*
gets a random integer from min to max
 */
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}