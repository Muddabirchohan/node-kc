var jwt = require("jwt-simple");
var secret = "decode";
var jwt = require("jwt-decode");
var secret = "decode";

const validateToken = (token) => {
  const data = jwt(token);
  const { name, email, resource_access, realm_access, familyname } = data;
  const result = {
    name,
    email,
    resource_access,
    resource_access,
    realm_access,
    familyname,
  };
  return result;
};

module.exports = validateToken;
