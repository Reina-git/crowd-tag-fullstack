function checkIsOver(str, num) {
   if (str.length > num) return true;
   else return false;
}

const MAX_CARD_CHARS = 100;

export { checkIsOver, MAX_CARD_CHARS };
