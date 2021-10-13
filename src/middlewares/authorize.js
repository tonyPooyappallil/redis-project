function authorize(permissionRoles) {
  return (req, res, next) => {
    const user = req.user;
    //console.log(permissionRoles, "what");
    //console.log(user.roles);
    let allowed = false;
    user.roles.map((role) => {
      if (permissionRoles.includes(role)) {
        allowed = true;
      }
    });
    //  console.log(allowedArray);
    if (!allowed) {
      return res.status(403).send({ message: "you are not authorized" });
    }
    return next();
  };
}
module.exports = authorize;
