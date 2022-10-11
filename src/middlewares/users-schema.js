import joi from "joi";

const userSchema = joi.object({
  name: joi.string().required().trim(),
  email: joi.string().email().required().trim(),
  password: joi.string().required().trim(),
  confirmPassword: joi.ref("password"),
});

function validateUsers(req, res, next) {
  const { name, email, password, confirmPassword } = req.body;
  const validate = userSchema.validate(
    {
      name,
      email,
      password,
      confirmPassword,
    },
    { abortEarly: false }
  );
  if (validate.error) {
    return res.status(422).send(validate.error.details.map((e) => e.message));
  }
  res.locals.body = { name, email, password };
  next();
}

export { validateUsers };
