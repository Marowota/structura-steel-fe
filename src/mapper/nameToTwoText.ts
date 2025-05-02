export const nameToTwoText = (name?: string) => {
  if (!name) return "";
  const nameParts = name.split(" ");
  let result = "";
  if (nameParts.length > 1) {
    const firstName = nameParts[0].charAt(0).toUpperCase();
    const lastName = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
    result = `${firstName}${lastName}`;
  } else {
    result = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }
  return result;
};
