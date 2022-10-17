import joi from "joi";

const userSchema = joi.object({
  name: joi.string().required().trim(),
  email: joi.string().email().required().trim(),
  password: joi.string().required().trim(),
  confirmPassword: joi.string().valid(joi.ref("password")).required(),
});
const loginSchema = joi.object({
  email: joi.string().email().required().trim(),
  password: joi.string().required().trim(),
});

function validateUser(req, res, next) {
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
function validateSignIn(req, res, next) {
  const { email, password } = req.body;
  const validate = loginSchema.validate(
    {
      email,
      password,
    },
    { abortEarly: false }
  );
  if (validate.error) {
    return res.status(422).send(validate.error.details.map((e) => e.message));
  }
  res.locals.body = { email, password };
  next();
}

export { validateUser, validateSignIn };
