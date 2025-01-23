import { useFetcher, useLoaderData, NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { useState } from "react";
import axios from "axios";
import {selectedMedicine} from "../user.json"

function AdminMedicine() {
    
    const loaderData = useLoaderData() || [];
    const [medicineList, setMedicineList] = useState(loaderData); 
 
    const fetcher = useFetcher();

    const validationSchema = Joi.object({
        name: Joi.string().required().label("Name"),
        price: Joi.number().required().label("Price"),
        stock: Joi.number().required().label("Stock"),
        detail: Joi.string().required().label("Detail"),
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
            action: `/admin/medicine`,
        });
    }

    async function changeMedicineStatus(code) {
        const selectedMedicine = medicineList.find(medicine => medicine.code === code);
        if (!selectedMedicine) return alert("Medicine not found!");
    
        const newStatus = selectedMedicine.status === "Not Banned" ? "Banned" : "Not Banned";
    
        try {
            const response = await axios.put("http://localhost:3000/api/admin/medicinestatus", {
                code,
                status: newStatus,
            });

            setMedicineList(prevList =>
                prevList.map(medicine =>
                    medicine.code === code ? { ...medicine, status: response.data.status } : medicine
                )
            );

            alert(`Medicine status changed to ${response.data.status}`);
        } catch (error) {
            console.error("Error updating medicine status:", error.message);
            alert("Failed to update medicine status.");
        }
    }

    const navigate = useNavigate();

    async function selectMedicine(code) {
        const medicine = medicineList.find(medicine => medicine.code === code);
        if (!medicine) return alert("Medicine not found!");

        selectedMedicine.pop()
        selectedMedicine.push(medicine); 

        navigate("/admin/edit", { state: { medicine } });
    }

    return (
        <>
            <h2>Add Medicine</h2>
            <form onSubmit={handleSubmit(submitForm)}>

                <label htmlFor="name">Medicine Name</label>
                <input {...register("name")} type="text" />
                <span>{errors.name?.message}</span>
                <br />

                <label htmlFor="price">Price</label>
                <input {...register("price")} type="number" />
                <span>{errors.price?.message}</span>
                <br />

                <label htmlFor="stock">Stock</label>
                <input {...register("stock")} type="number" />
                <span>{errors.stock?.message}</span>
                <br />

                <label htmlFor="detail">Details</label>
                <input {...register("detail")} type="text" />
                <span>{errors.detail?.message}</span>
                <br />

                <button type="submit">Add Medicine</button>
            </form>

            <h2>Medicine List</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Detail</th>
                        <th>Status</th>
                        <th>Change Status</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {medicineList.map((medicine, index) => (
                        <tr key={index}>
                            <td>{medicine.code}</td>
                            <td>{medicine.name}</td>
                            <td>{medicine.price}</td>
                            <td>{medicine.stock}</td>
                            <td>{medicine.detail}</td>
                            <td>{medicine.status}</td>
                            {
                                medicine.status == "Not Banned" && 
                                <td>
                                    <button onClick={() => changeMedicineStatus(medicine.code)}>Ban Medicine</button>
                                </td>
                            }
                            {
                                medicine.status == "Banned" && 
                                <td>
                                    <button onClick={() => changeMedicineStatus(medicine.code)}>Unban Medicine</button>
                                </td>
                            }
                            <td><button onClick={() => selectMedicine(medicine.code)}>Edit</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default AdminMedicine;
