import {useLoaderData  } from "react-router-dom";


function Admin(){
    
    const userList = useLoaderData()
    return(
        <>
        
            <table border="1">
                <thead>
                <tr>
                    <th>Username</th>
                    <th>Name</th>
                    <th>Alamat</th>
                    <th>Email</th>                    
                </tr>
                </thead>
                <tbody>
                {userList && userList.map((u, index) =>{
                return (<tr key={index}>
                        <td>{u.username}</td>
                        <td>{u.name}</td>
                        <td>{u.alamat}</td>
                        <td>{u.email}</td>
                    </tr>) 
            })}          
                </tbody>
            </table>
            
        </>
    )
}

export default Admin