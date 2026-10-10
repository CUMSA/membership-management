const formatPhoneNumber = (phone) => {
  if (typeof phone !== "string" || /[^+0-9 ]/.test(phone)) {
    return "";
  }

  const compact = phone.replace(/ /g, "");
  if (!/^\+[1-9]\d*$/.test(compact)) {
    return "";
  }

  if (compact.startsWith("+44")) {
    const number = compact.slice(3).replace(/^0+/, "");
    return number ? `+44 ${number}` : "";
  }

  const match = phone.replace(/^ +/, "").match(/^(\+[1-9]\d{0,2}) +([\d ]+)$/);
  if (!match) {
    return "";
  }

  const number = match[2].replace(/ /g, "");
  return /[1-9]/.test(number) ? `${match[1]} ${number}` : "";
};

export default formatPhoneNumber;
