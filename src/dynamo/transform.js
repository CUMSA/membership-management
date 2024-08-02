const transform = (data) => {
  return data.map((e, i) => {
    const keys = Object.keys(e);
    const d = {};
    for (let i = 0; i < keys.length; i++) {
      const val = Object.values(e[keys[i]]);
      d[keys[i]] = val[0];
    }

    return { ...d, id: i };
  });
};

export default transform;
