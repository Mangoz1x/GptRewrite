import { getCookies } from 'cookies-next';
import db from "../../../../mongo/interact";
import { decrypt } from "../../../../helpers/decrypt";
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

        if (!["basic", "pro", "expert"].includes(query?.subscription)) return res.status(500).json({
            error: `You cannot upgrade to this plan because you do not currently have one.`
        });

        if (query?.subscription == plan) return res.status(500).json({
            error: `You cannot choose a plan you are currently on.`
        });

        const plans = { basic: 'price_1MaQYcBL31fVfU1SB2DF5ay1', pro: 'price_1MaQZ6BL31fVfU1SBZUKciaC', expert: 'price_1MaQZTBL31fVfU1S2Vvjh5Yo' };
        const selected = plans[plan];


        if (!query.stripeCustomer) return res.status(500).json({
            error: `You're account is invalid please contact support.`
        });

        try {
            await stripe.customers.retrieve(query.stripeCustomer);
        } catch (err) {
            return res.status(500).json({ error: `You're account is invalid please contact support.` });
        }

        let curSubscription = null;

        try {
            curSubscription = await stripe.subscriptions.retrieve(query.subscriptionId);
            if (curSubscription?.status != "active" || curSubscription?.plan?.active != true)
                return res.redirect("/pricing");
        } catch (err) { };

        if (!curSubscription) return res.redirect("/pricing")

        const subUpgrades = {
            basic: {
                given: 55
            }, pro: {
                given: 120
            }, expert: {
                given: 250
            }
        };

        const subscription = await stripe.subscriptions.update(curSubscription.id, {
            cancel_at_period_end: false,
            proration_behavior: 'create_prorations',
            items: [{
                id: curSubscription.items.data[0].id,
                price: selected,
            }],
            metadata: {
                uuid: query.uuid,
                plan: plan,
                upgradedLast: new Date().getTime()
            }
        });

        await db.updateOne({ uuid: query.uuid }, {
            $set: {
                usageLimit: {
                    rewrite: {
                        given: subUpgrades[plan].given,
                        used: 0
                    }
                },
                subscription: plan
            }
        }, "PublicModelLibrary", "users");

        return res.redirect(`/pricing/upgrade/complete`);
    } catch (err) {
        return res.redirect(`/pricing/upgrade?error=${err.message}`);
    }
};

export default Module;