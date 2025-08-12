const Joi = require("joi");

const validate = (schema) => (req, res, next) => {
  const keys = Object.keys(schema);

  const object = keys.reduce((obj, key) => {
    if (Object.prototype.hasOwnProperty.call(req, key)) {
      obj[key] = req[key];
    }
    return obj;
  }, {});

  const { error } = Joi.compile(schema)
    .prefs({ errors: { label: "key" } })
    .validate(object);

  if (error) {
    const errors = error.details.map((detail) => ({
      key: detail.context.key,
      message: detail.message,
    }));
    return res.status(400).json({ error: true, errors });
  }

  next();
};

module.exports = validate;
