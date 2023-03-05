import React, { useEffect, useState } from "react";
import {
    PaymentElement,
    LinkAuthenticationElement,
    useStripe,
    useElements,
    AddressElement
} from "@stripe/react-stripe-js";

export default function CheckoutForm({ secret, id }) {   
    const stripe = useStripe();
    const elements = useElements();

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    let port;
    let url;

    useEffect(() => {
        if (typeof window !== undefined) {
            port = window.location.port == 80 || window.location.port == 443 ? "" : ":" + window.location.port;
            url = window.location.protocol + "//" + window.location.hostname + port;
        }

        if (!stripe) {
            return;
        }

        const clientSecret = secret;

        if (!clientSecret) {
            return;
        }

        const first = new URLSearchParams(window.location.search).get("first");
        if (first == "true") return;

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent.status) {
                case "succeeded":
                    setMessage("Payment succeeded!");
                    break;
                case "processing":
                    setMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    setMessage("Your payment was not successful, please try again.");
                    break;
                default:
                    setMessage("Something went wrong.");
                    break;
            }
        });
    }, [stripe]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements || !port || !url) return;

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: `${url}/pricing/complete/${id}`,
            },
        });

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message);
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    const paymentElementOptions = {
        layout: "tabs"
    }

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <LinkAuthenticationElement
                id="link-authentication-element"
                onChange={(e) => setEmail(e.target.value)}
            />

            <PaymentElement id="payment-element" options={paymentElementOptions} />
            <AddressElement id="address-element" options={{ mode: 'billing' }} />

            <button className="w-full btn-primary transition-all rounded-md py-2 mt-2" disabled={isLoading || !stripe || !elements} id="submit">
                <span id="button-text">
                    {isLoading ? <progress className="progress w-56"></progress> : "Subscribe"}
                </span>
            </button>
            {/* Show any error or success messages */}
            {message && <div id="payment-message" className="mt-2 text-red-500">{message}</div>}
        </form>
    );
}