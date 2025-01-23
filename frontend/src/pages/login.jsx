import { useFetcher, NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";


function Login(){
    const fetcher = useFetcher();

  const validationSchema = Joi.object({
    username: Joi.string().required().label("Username"),
    password: Joi.string().required().label("Password"),
  });
  

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(validationSchema),
  });

  function submitForm(data) {
    fetcher.submit(data, {
        method: "POST",
        action: `/login`,
    });
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit(submitForm)}>
        <label htmlFor="username">Username</label>
        <input {...register("username")} type="text" />
        <span>{errors.username?.message}</span>
        <br />

        <label htmlFor="password">Password</label>
        <input {...register("password")} type="password" />
        <span>{errors.password?.message}</span>
        <br />

        <button type="submit">Login</button>
      </form>
      <NavLink
        className={(state) => {
          return state.isActive ? "text-blue-400" : "text-black" + " px-2 py-1";
        }}
        to="/register"
      ><button>Go to Register</button></NavLink>
    </div>
  );
}

export default Login