function convertToCSV(objs) {
  const keys = Object.keys(objs[0]);
  const vals = objs.map((obj) => Object.values(obj));

  return keys.concat(vals);
}

export default convertToCSV;
