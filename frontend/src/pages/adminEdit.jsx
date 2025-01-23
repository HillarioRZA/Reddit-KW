import { useFetcher, useLoaderData, NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import {selectedMedicine} from "../user.json"

function AdminEdit(data){
   
    const fetcher = useFetcher();

    const validationSchema = Joi.object({
        code: Joi.string().required().label("Code"),
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
            method: "PUT",
            action: `/admin/edit`,
        });
    }

    return( <>
        <h2>Edit Medicine</h2>
            <form onSubmit={handleSubmit(submitForm)}>

                 <input {...register("code")} type="text" readOnly defaultValue={selectedMedicine[0]?.code}/> 
                 <span>{errors.code?.message}</span>

                <label htmlFor="name">Medicine Name</label>
                <input {...register("name")} type="text" defaultValue={selectedMedicine[0]?.name}/>
                <span>{errors.name?.message}</span>
                <br />

                <label htmlFor="price">Price</label>
                <input {...register("price")} type="number" defaultValue={selectedMedicine[0]?.price}/>
                <span>{errors.price?.message}</span>
                <br />

                <label htmlFor="stock">Stock</label>
                <input {...register("stock")} type="number" defaultValue={selectedMedicine[0]?.stock}/>
                <span>{errors.stock?.message}</span>
                <br />

                <label htmlFor="detail">Details</label>
                <input {...register("detail")} type="text" defaultValue={selectedMedicine[0]?.detail}/>
                <span>{errors.detail?.message}</span>
                <br />

                <button type="submit">Update</button>
            </form>
        </>  
    )
}

export default AdminEdit