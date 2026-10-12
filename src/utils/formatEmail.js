const emailRemoveCamDomain = (email) => {
  const crsid = email.replace(/@cam\.ac\.uk$/i, "");
  return crsid.includes("@") ? crsid : crsid.toLowerCase();
};

const emailAddCamDomain = (email) => {
  const crsid = emailRemoveCamDomain(email);
  return crsid.includes("@") ? crsid : crsid + "@cam.ac.uk";
};

export { emailAddCamDomain, emailRemoveCamDomain };
