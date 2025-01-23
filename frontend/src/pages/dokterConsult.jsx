import { useFetcher, NavLink, useLoaderData } from "react-router-dom";
import { useForm } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { useEffect, useState } from "react";

function DokterConsult() {
    const fetcher = useFetcher();
    const selectedConsult = useLoaderData();

    const [medicines, setMedicines] = useState([]);
    const [selectedMedicines, setSelectedMedicines] = useState([]);

    useEffect(() => {
        async function fetchMedicines() {
            try {
                const response = await fetch('http://localhost:3000/api/doctor/available-medicines');
                const data = await response.json();
                setMedicines(data);
            } catch (error) {
                console.error("Error fetching medicines:", error);
            }
        }

        fetchMedicines();
    }, []);

    if (!selectedConsult.length) {
        return <div>No selected consultation found.</div>;
    }

    const validationSchema = Joi.object({
        index: Joi.string().required().label("Index"),
        username: Joi.string().required().label("Username"),
        complain: Joi.string().required().label("Complain"),
        solution: Joi.string().required().label("Solution"),
        medicines: Joi.array().items(
            Joi.object({
                code: Joi.string().required().label("Medicine Code"),
                name: Joi.string().required().label("Medicine Name"),
            })
        ).min(1).label("Medicines"),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: joiResolver(validationSchema),
    });

    async function submitForm(data) {
        console.log("Selected Medicines:", selectedMedicines);
        const payload = {
            ...data,
            medicines: JSON.stringify(selectedMedicines), // Serialize selectedMedicines array to a JSON string
        };
    
        fetcher.submit(payload, {
            method: "PUT",
            action: `/doctor/consult`,
        });
    }
    

    function handleMedicineSelection(e) {
        const { value, checked } = e.target; // Get code and checked status
        const medicine = medicines.find((med) => med.code === value);

        if (medicine) {
            if (checked) {
                // Add medicine if checked
                setSelectedMedicines((prev) => [
                    ...prev,
                    { code: medicine.code, name: medicine.name, stock: medicine.stock },
                ]);
            } else {
                // Remove medicine if unchecked
                setSelectedMedicines((prev) =>
                    prev.filter((med) => med.code !== value)
                );
            }
        }
    }

    return (
        <div>
            <h2>Consultation Form</h2>
            <form onSubmit={handleSubmit(submitForm)}>
                
                <input
                    {...register("index")}
                    type="hidden"
                    defaultValue={selectedConsult[0][0]?.index}
                />

                <label htmlFor="username">Patient Username</label>
                <input
                    {...register("username")}
                    type="text"
                    readOnly
                    defaultValue={selectedConsult[0][0]?.patientName}
                />
                <span>{errors.username?.message}</span>
                <br />

                <label htmlFor="complain">Complain</label>
                <input
                    {...register("complain")}
                    type="text"
                    readOnly
                    defaultValue={selectedConsult[0][0]?.complain}
                />
                <span>{errors.complain?.message}</span>
                <br />

                <label htmlFor="solution">Solution</label>
                <input {...register("solution")} type="text" />
                <span>{errors.solution?.message}</span>
                <br />

                <label htmlFor="medicines">Select Medicines</label>
                <div id="medicines">
                    {medicines.map((medicine) => (
                        <div key={medicine.code}>
                            <input
                                type="checkbox"
                                id={`medicine-${medicine.code}`}
                                value={medicine.code}
                                onChange={handleMedicineSelection}
                            ></input>
                            <label htmlFor={`medicine-${medicine.code}`}>
                                {medicine.name} (Stock: {medicine.stock})
                            </label>
                        </div>
                    ))}
                </div>
                <span>{errors.medicines?.message}</span>
                <br />

                <button type="submit">Post</button>
            </form>

            <NavLink
                className={({ isActive }) =>
                    (isActive ? "text-blue-400" : "text-black") + " px-2 py-1"
                }
                to="/"
            >
                <button>Back</button>
            </NavLink>
        </div>
    );
}

export default DokterConsult;
