import { getCookies } from 'cookies-next';
import db from "../../../mongo/interact";
import { decrypt } from "../../../helpers/decrypt";
import gateway from "stripe";

const stripe = gateway(process.env.STRIPE_KEY);

const Module = async (req, res) => {
    try {
        const { uuid, token, key } = getCookies({ req, res });
        if (!(uuid || token || key)) return res.redirect(`/auth/signup?redirect=/pricing/buy/${req?.query?.plan || "basic"}`);
        
        let query = await db.findOne({ uuid }, "PublicModelLibrary", "users");
        if (!query) return res.redirect(process.env.UNSIGNED_REDIRECT);
        const decryptedToken = decrypt(token, key);
        
        if (!(decrypt(query.token, process.env.ENCRYPTION_KEY) === decryptedToken)) return res.redirect(process.env.UNSIGNED_REDIRECT);
        if (query?.admin === "true") return res.redirect(process.env.ADMIN_REDIRECT);
        if (!query?.access || !query?.access?.includes("rewrite")) return res.redirect("/waitlist");
    
        // Create stripe intent
        const { plan } = req.query;
        if (!["basic", "pro", "expert"].includes(plan)) return res.status(500).json({
            error: `We do not currently offer the ${plan} plan.`
        });
    
        const plans = { basic: 'price_1MaQYcBL31fVfU1SB2DF5ay1', pro: 'price_1MaQZ6BL31fVfU1SBZUKciaC', expert: 'price_1MaQZTBL31fVfU1S2Vvjh5Yo' };
        const selected = plans[plan];
    
        // Create a stripe customer if there isnt one
        const CreateCustomer = async () => {
            const customer = await stripe.customers.create({
                email: query.email,
                metadata: {
                    uuid: query.uuid,
                    plan: plan
                }
            });
            
            query.stripeCustomer = customer.id;
            await db.updateOne({ uuid: query.uuid }, { $set: { stripeCustomer: customer.id }}, "PublicModelLibrary", "users");
        };

        if (!query.stripeCustomer) await CreateCustomer();
       
        try {
            await stripe.customers.retrieve(query.stripeCustomer);
        } catch (err) {
            await CreateCustomer();
        }

        try {
            const curSubscription = await stripe.subscriptions.retrieve(query.subscriptionId);
            if (curSubscription?.status == "active" || curSubscription?.plan?.active == true)
                return res.redirect("/pricing/upgrade");
        } catch (err) {};

        const subscription = await stripe.subscriptions.create({
            customer: query.stripeCustomer,
            items: [{
                price: selected,
            }],
            currency: 'cad',
            metadata: {
                uuid: query.uuid,
                plan: plan
            },
            payment_behavior: 'default_incomplete',
            payment_settings: { save_default_payment_method: 'on_subscription' },
            expand: ['latest_invoice.payment_intent'],
        });

        return res.redirect(`/pricing/buy/${plan}?subscription=${subscription.id}&secret=${subscription.latest_invoice.payment_intent.client_secret}&first=true`);
    } catch (err) {
        return res.redirect(`/pricing?error=${err.message}`);
    }
};

export default Module;