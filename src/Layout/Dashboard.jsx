import { NavLink, Outlet } from "react-router-dom";
import { FaHome, FaCalendarAlt, FaUtensils, FaUsers } from 'react-icons/fa';
import { GiWallet } from "react-icons/gi";
import { BsFillCartFill, BsFillBookmarkFill, } from 'react-icons/bs';
import { MdPreview } from 'react-icons/md';
import { FiMenu } from 'react-icons/fi';
import { AiFillShopping } from 'react-icons/ai';
import { BiMessageRoundedDetail } from 'react-icons/bi';
import useCart from "../hooks/useCart";

const Dashboard = () => {
    const [cart] = useCart()
    const isAdmin = true;
    return (
        <div className="drawer drawer-mobile">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col items-center justify-center">

                {/* pages item here */}
                <Outlet></Outlet>

                <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">Open drawer</label>
            </div>
            <div className="drawer-side bg-orange-300">

                <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
                <ul className="menu text-xl p-4 w-80 font-semibold">
                    {
                        isAdmin ? <>
                            <li><NavLink to="/dashboard/home"><FaHome /> Admin HOME</NavLink></li>
                            <li><NavLink to="/dashboard/reservations"><FaUtensils/> Add ITEMS</NavLink></li>
                            <li><NavLink to="/dashboard/history"><GiWallet /> MANAGE ITEMS</NavLink></li>
                            <li><NavLink to="/dashboard/mycart"><BsFillCartFill /> MANAGE BOOKINGS <span className="badge badge-secondary">+{cart?.length || 0}</span></NavLink></li>
                            <li><NavLink to="/dashboard/allusers"><FaUsers/> ALL USERS</NavLink></li>
                        </>
                            :
                            <>
                                <li><NavLink to="/dashboard/home"><FaHome /> USER HOME</NavLink></li>
                                <li><NavLink to="/dashboard/reservations"><FaCalendarAlt /> RESERVATIONS</NavLink></li>
                                <li><NavLink to="/dashboard/history"><GiWallet /> PAYMENT HISTORY</NavLink></li>
                                <li><NavLink to="/dashboard/mycart"><BsFillCartFill /> MY CART <span className="badge badge-secondary">+{cart?.length || 0}</span></NavLink></li>
                                <li><NavLink to="/dashboard/review"><MdPreview /> ADD REVIEW</NavLink></li>
                                <li><NavLink to="/dashboard/booking"><BsFillBookmarkFill /> MY BOOKING</NavLink></li>
                            </>
                    }
                    <div className="divider"></div>
                    <li><NavLink to="/"><FaHome /> HOME</NavLink></li>
                    <li><NavLink to="/menu"><FiMenu /> MENU</NavLink></li>
                    <li><NavLink to="/order"><AiFillShopping /> SHOP</NavLink></li>
                    <li><NavLink to="/contact"><BiMessageRoundedDetail /> CONTACT</NavLink></li>
                </ul>

            </div>
        </div>
    );
};

export default Dashboard;