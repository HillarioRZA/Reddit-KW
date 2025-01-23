import { useFetcher, useLoaderData } from "react-router-dom";
import { useForm } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";


function Pasien(){
    const fetcher = useFetcher();

    const doctorList = useLoaderData()

    const validationSchema = Joi.object({
        doctorName: Joi.string()
          .required()
          .label("Doctor Name"),
        reserveDate: Joi.date()
          .iso()
          .min('now') 
          .required()
          .label("Reserve Date"),
        complain: Joi.string()
          .required()
          .label("Complain"),
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
      action: `/patient`,
    });
  }

  return (
    <div>
      <h2>Pasien</h2>
      <form onSubmit={handleSubmit(submitForm)}>
        <label htmlFor="doctorName">Dokter</label>
        <select {...register("doctorName")} defaultValue="">
        <option value="" disabled>
            Select a doctor
        </option>
        {doctorList.map((doctor) => (
            <option key={doctor.name} value={doctor.name}>
            {doctor.name}
            </option>
        ))}
        </select>
        <span>{errors.doctorName?.message}</span>
        <br />


        <label htmlFor="reserveDate">Tanggal Reservasi</label>
        <input {...register("reserveDate")} type="date" />
        <span>{errors.reserveDate?.message}</span>
        <br />

        <label htmlFor="complain">Keluhan</label>
        <input {...register("complain")} type="text" />
        <span>{errors.complain?.message}</span>
        <br />

        <button type="submit">Post</button>
      </form>
    </div>
  );
}

export default Pasien