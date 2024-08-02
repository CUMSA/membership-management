const byDate =
  (asc = 1) =>
  (a, b) => {
    if (isNaN(new Date(a.RegistrationTime))) {
      return 1 * asc;
    } else if (isNaN(new Date(b.RegistrationTime))) {
      return -1 * asc;
    } else {
      return new Date(b.RegistrationTime) - new Date(a.RegistrationTime);
    }
  };

const byMatricYear =
  (asc = 1) =>
  (a, b) => {
    if (isNaN(new Date(a.MatriculationYear))) {
      return 1 * asc;
    } else if (isNaN(new Date(b.MatriculationYear))) {
      return -1 * asc;
    } else {
      return (
        (new Date(b.MatriculationYear) - new Date(a.MatriculationYear)) * asc
      );
    }
  };

module.exports = {
  byDate,
  byMatricYear,
};
