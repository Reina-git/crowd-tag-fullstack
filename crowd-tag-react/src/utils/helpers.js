function checkIsOver(str, num) {
  if (str.length > num) return true;
  else return false;
}

const MAX_CARD_CHARS = 100;

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export { checkIsOver, EMAIL_REGEX, MAX_CARD_CHARS };
