// controllers/globalSearchController.js
// OPTIONAL: a single combined search endpoint instead of hitting 3 routes
// from the frontend. Use this if you want fewer round-trips.

import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Users from "../models/Users.js";



/* ─────────────────────────────────────────────────
   GET /admin/global-search?q=blue+jacket
   Returns top 5 matches from each model in one call.
───────────────────────────────────────────────── */
const globalSearch = async (req, res) => {

    try {
        const q = (req.query.q || '').trim();
        if (!q) return res.json({ success: true, products: [], orders: [], customers: [] });

        const regex = new RegExp(q, 'i'); // case-insensitive partial match

        const [products, orders, customers] = await Promise.all([
            Product.find({ name: regex }).limit(5).lean(),

            Order.find({
                $or: [
                    { orderId: regex },
                    { 'shipping.firstName': regex },
                    // { 'shipping.lastName': regex },
                    // { 'shipping.email': regex },

                    {
                        $expr: {
                            $regexMatch: {
                                input: { $concat: ["$shipping.firstName", " ", "$shipping.lastName"] },
                                regex: q, // Yahan direct 'q' (string) pass hoga, RegExp object nahi
                                options: "i"
                            }
                        }
                    }
                ],
            }).limit(5).lean(),

            Users.find({
                // role: { $ne: 'admin' },
                $or: [{ name: regex }, { email: regex }],
            }).select('-password -cartData').limit(5).lean(),
        ]);

        res.json({
            success: true,
            products: products.map(p => ({ id: p.id, name: p.name, category: p.category, image: p.image, price: p.new_price })),
            orders: orders.map(o => ({ id: o._id, orderId: o.orderId, customer: `${o.shipping?.firstName || ''} ${o.shipping?.lastName || ''}`.trim(), total: o.pricing?.total })),
            customers: customers.map(c => ({ id: c._id, name: c.name, image : c.avatar, email: c.email })),
        });
    } catch (error) {
        console.error('globalSearch error:', error);
        res.status(500).json({ success: false, error: 'Search failed.' });
    }
};

export default globalSearch;

/* ── Register the route: ──
   router.get('/global-search', fetchUser, isAdmin, globalSearch);
   
   Mounted under /admin → GET /admin/global-search?q=...
   
   If you use this single endpoint, simplify CommandPalette.jsx's
   fetch logic to just one call instead of Promise.allSettled([3 fetches]).
*/