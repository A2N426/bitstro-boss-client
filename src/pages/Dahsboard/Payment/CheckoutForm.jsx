import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect } from "react";
import { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";

const CheckoutForm = ({ cart, price }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useAuth()
    const [cardError, setCardError] = useState();
    const [axiosSecure] = useAxiosSecure();
    const [clientSecret, setClientSecret] = useState("");
    const [processing, setProcessing] = useState(false)
    const [transactionId, setTransactionId] = useState("")

    useEffect(() => {
        if (price > 0) {
            axiosSecure.post("/create-payment-intent", { price })
                .then(res => {
                    setClientSecret(res.data.clientSecret)
                })
        }
    }, [axiosSecure, price])

    const handleSubmit = async (event) => {
        event.preventDefault();
        setTransactionId("")
        if (!stripe || !elements) {
            return;
        }

        const card = elements.getElement(CardElement)
        if (card === null) {
            return;
        }

        const { error } = await stripe.createPaymentMethod({
            type: "card",
            card
        })
        if (error) {
            setCardError(error.message)
            console.log("error", error)
        }
        else {
            setCardError("")
        }

        setProcessing(true)

        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
            clientSecret,
            {
                payment_method: {
                    card: card,
                    billing_details: {
                        email: user?.email || "unknown",
                        name: user?.displayName || "anonymous"
                    },
                },
            },
        );

        if (confirmError) {
            console.log(confirmError)
        }

        setProcessing(false)

        if (paymentIntent?.status === "succeeded") {
            setTransactionId(paymentIntent.id)
            // TODO next steps
            const payment = {
                email: user?.email,
                transactionId: paymentIntent.id,
                price,
                date: new Date(),
                quantity: cart.length,
                cartItems: cart.map(item => item._id),
                menuItems: cart.map(item => item.menuItemId),
                status: "service pending",
                itemNames: cart.map(item => item.name)
            }
            axiosSecure.post("/payments", payment)
                .then(res => {
                    console.log("from 87", res.data)
                    if (res.data.deleteResult.deletedCount > 0) {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Successfully buying done',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                })
        }

    }
    return (
        <>
            <form className="w-2/3 mx-auto border p-10" onSubmit={handleSubmit}>
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />
                <div className="text-center mt-5">
                    <button className="btn btn-primary btn-sm" type="submit" disabled={!stripe || !clientSecret || processing}>
                        Pay
                    </button>
                </div>
                {cardError && <p className="text-red-600">{cardError}</p>}
                {transactionId && <p className="text-success">Payment successfully Complete with Your Transaction id {transactionId}</p>}
            </form>

        </>
    );
};

export default CheckoutForm;