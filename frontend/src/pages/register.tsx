import { useFetcher, NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";

interface RegisterFormData {
  username: string;
  name: string;
  email: string;
  alamat: string;
  password: string;
  confirm: string;
  role: string;
}

function Register() {
  const fetcher = useFetcher();

  const validationSchema = Joi.object<RegisterFormData>({
    username: Joi.string().required().label("Username"),
    name: Joi.string().required().label("Name"),
    email: Joi.string().email({ tlds: { allow: false } }).required().label("Email"),
    alamat: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (value.trim().split(/\s+/).length < 2) {
          return helpers.message("Alamat must consist of at least two words");
        }
        return value;
      })
      .label("Alamat"),
    password: Joi.string().required().label("Password"),
    confirm: Joi.string()
      .required()
      .valid(Joi.ref("password"))
      .messages({ "any.only": "Passwords do not match" })
      .label("Confirm Password"),
    role: Joi.string().required().label("Role"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: joiResolver(validationSchema),
  });

  const submitForm = (data: RegisterFormData) => {
    fetcher.submit(data, {
      method: "POST",
      action: `/register`,
    });
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit(submitForm)}>
        <label htmlFor="username">Username</label>
        <input {...register("username")} type="text" />
        <span>{errors.username?.message}</span>
        <br />

        <label htmlFor="name">Name</label>
        <input {...register("name")} type="text" />
        <span>{errors.name?.message}</span>
        <br />

        <label htmlFor="email">Email</label>
        <input {...register("email")} type="email" />
        <span>{errors.email?.message}</span>
        <br />

        <label htmlFor="alamat">Alamat</label>
        <input {...register("alamat")} type="text" />
        <span>{errors.alamat?.message}</span>
        <br />

        <label htmlFor="password">Password</label>
        <input {...register("password")} type="password" />
        <span>{errors.password?.message}</span>
        <br />

        <label htmlFor="confirm">Confirm Password</label>
        <input {...register("confirm")} type="password" />
        <span>{errors.confirm?.message}</span>
        <br />

        <label htmlFor="role">Peran</label>
        <select {...register("role")} defaultValue="">
          <option value="" disabled>
            Select Role
          </option>
          <option value="Dokter">Dokter</option>
          <option value="Pasien">Pasien</option>
        </select>
        <span>{errors.role?.message}</span>
        <br />

        <button type="submit">Register</button>
      </form>
      <NavLink
        className={(state) => {
          return (state.isActive ? "text-blue-400" : "text-black") + " px-2 py-1";
        }}
        to="/login"
      >
        <button>Go to Login</button>
      </NavLink>
    </div>
  );
}

export default Register;
