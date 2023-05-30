import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { BsFillTrash3Fill } from "react-icons/bs";
import { FaUserShield } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AllUsers = () => {
    const [axiosSecure]=useAxiosSecure()
    const { data: users = [], refetch } = useQuery(["users"], async () => {
        const res = await axiosSecure.get("/users");
        return res.data;
    })

    const handleMakeAdmin = user => {
        fetch(`http://localhost:5000/users/admin/${user._id}`, {
            method: "PATCH"
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.modifiedCount) {
                    refetch()
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: `${user.name} is Admin now`,
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            })
    }

    const handleDelete = user => {
        console.log(user)
    }
    return (
        <div className="w-full lg:px-16">
            <Helmet>
                <title>Bistro Boss | Admin Panel</title>
            </Helmet>
            <h3 className="text-4xl font-semibold">Total Users: {users.length}</h3>
            <div>
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        {/* head */}
                        <thead>
                            <tr>
                                <th>Sl</th>
                                <th>NAME</th>
                                <th>EMAIL</th>
                                <th>ROLE</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                users.map((user, i) =>
                                    <tr key={user._id}>
                                        <td>{i + 1}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role === "admin" ? "Admin" : <button onClick={() => handleMakeAdmin(user)} className="btn bg-gray-600 text-white text-2xl"><FaUserShield className="text-2xl" /></button>}</td>
                                        <td>
                                            <button onClick={() => handleDelete(user)} className="btn btn-error bg-red-600 text-white text-2xl"><BsFillTrash3Fill /></button>
                                        </td>
                                    </tr>)
                            }
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default AllUsers;