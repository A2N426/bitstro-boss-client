import { loadStripe } from "@stripe/stripe-js";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import useCart from "../../../hooks/useCart";


const stripePromise = loadStripe(import.meta.env.VITE_stripe_key)
const Payment = () => {
    const [cart]=useCart();
    const total = cart.reduce((sum,item)=> sum + item.price,0)
    const price = parseFloat(total.toFixed(2));
    return (
        <div>
            <SectionTitle subHeading="Please Process" heading="Payment"></SectionTitle>
            <Elements stripe={stripePromise}>
                <CheckoutForm cart={cart} price={price}></CheckoutForm>
            </Elements>
        </div>
    );
};

export default Payment;