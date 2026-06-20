import express from 'express';
import Order from '../models/Order.js';
import Users from '../models/Users.js';

const router = express.Router();

router.get('/summary', async (req, res) => {
    try {
        // 1. ── Real Data Fetching from Database ──
        // Total Orders
        const totalOrders = await Order.countDocuments();

        // Total Revenue (Sum of all orders that are not Cancelled)
        const revenueResult = await Order.aggregate([
            { $match: { status: { $ne: 'Cancelled' }, payment_status: 'Paid' } },
            { $group: { _id: null, total: { $sum: "$pricing.total" } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // New Customers (Role: user)
        const totalCustomers = await Users.countDocuments();

        // Recent Orders (Last 6 orders for the table)
        const recentOrdersDb = await Order.find().sort({ createdAt: -1 }).limit(6);
        const recentOrders = recentOrdersDb.map(o => ({
            id: o.orderId,
            customer: o.shipping.firstName + " " + o.shipping.lastName,
            product: `${o.items?.[0]?.name || 'Multiple Items'} ${o.items?.length > 1 ? `(+${o.items.length - 1})` : ''}`,
            amount: `₹${o.pricing?.total.toLocaleString('en-IN')}`,
            status: o.status,
            date: o.placedAt // Using your formatted date string
        }));

        // 2. ── Formatting Data for Frontend Charts ──
        // Format Revenue to Lakhs/K for the StatCard (e.g. 840000 -> 8.4L)
        const formatMoney = (num) => {
            if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
            if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
            return `₹${num}`;
        };

        const STATS = [
            { icon: 'TrendingUp', label: 'Total Revenue', value: formatMoney(totalRevenue), delta: 12.5, deltaLabel: 'vs last month', color: 'sky', delay: 'animate-fade-up-1' },
            { icon: 'ShoppingBag', label: 'Total Orders', value: totalOrders.toLocaleString('en-IN'), delta: 8.2, deltaLabel: 'vs last month', color: 'blue', delay: 'animate-fade-up-2' },
            { icon: 'Users', label: 'New Customers', value: totalCustomers.toLocaleString('en-IN'), delta: -3.1, deltaLabel: 'vs last month', color: 'indigo', delay: 'animate-fade-up-3' },
            // Traffic requires GA integration, keeping dynamic mockup for UI
            { icon: 'Eye', label: 'Total Visits', value: '24.6K', delta: 19.4, deltaLabel: 'vs last month', color: 'teal', delay: 'animate-fade-up-4' },
        ];


        // =========================
        // TODAY (Hourly)
        // =========================

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const todayRaw = await Order.aggregate([
            {
                $match: {
                    placedAt: { $gte: startOfToday },
                    status: { $ne: 'Cancelled' }
                }
            },
            {
                $group: {
                    _id: { $hour: "$placedAt" },
                    revenue: { $sum: "$pricing.total" },
                    orders: { $sum: 1 }
                }
            }
        ]);

        const hourlyLabels = [0, 4, 8, 12, 16, 20];

        const TODAY = hourlyLabels.map(hour => {
            const found = todayRaw.find(x => x._id >= hour && x._id < hour + 4);

            return {
                name: `${hour}:00`,
                revenue: found?.revenue || 0,
                orders: found?.orders || 0
            };
        });

        // =========================
        // LAST 7 DAYS (Mon-Sun)
        // =========================

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const revenueByDayRaw = await Order.aggregate([
            {
                $match: {
                    placedAt: { $gte: sevenDaysAgo },
                    status: { $ne: 'Cancelled' }
                }
            },
            {
                $group: {
                    _id: { $dayOfWeek: "$placedAt" },
                    revenue: { $sum: "$pricing.total" },
                    orders: { $sum: 1 }
                }
            }
        ]);

        const dayNames = {
            1: 'Sun',
            2: 'Mon',
            3: 'Tue',
            4: 'Wed',
            5: 'Thu',
            6: 'Fri',
            7: 'Sat'
        };

        const daysOfWeek = [
            'Mon',
            'Tue',
            'Wed',
            'Thu',
            'Fri',
            'Sat',
            'Sun'
        ];

        const REVENUE_7D = daysOfWeek.map(day => {
            const found = revenueByDayRaw.find(
                item => dayNames[item._id] === day
            );

            return {
                name: day,
                revenue: found?.revenue || 0,
                orders: found?.orders || 0
            };
        });

        // =========================
        // LAST 1 MONTH (Weekly)
        // =========================

        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const oneMonthRaw = await Order.aggregate([
            {
                $match: {
                    placedAt: { $gte: oneMonthAgo },
                    status: { $ne: 'Cancelled' }
                }
            },
            {
                $project: {
                    revenue: "$pricing.total",
                    placedAt: 1,
                    week: {
                        $ceil: {
                            $divide: [
                                { $dayOfMonth: "$placedAt" },
                                7
                            ]
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$week",
                    revenue: { $sum: "$revenue" },
                    orders: { $sum: 1 }
                }
            }
        ]);

        const REVENUE_1M = [1, 2, 3, 4, 5].map(week => {
            const found = oneMonthRaw.find(x => x._id === week);

            return {
                name: `Week ${week}`,
                revenue: found?.revenue || 0,
                orders: found?.orders || 0
            };
        });

        // =========================
        // LAST 3 MONTHS
        // =========================

        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 2);

        const threeMonthRaw = await Order.aggregate([
            {
                $match: {
                    placedAt: { $gte: threeMonthsAgo },
                    status: { $ne: 'Cancelled' }
                }
            },
            {
                $group: {
                    _id: { $month: "$placedAt" },
                    revenue: { $sum: "$pricing.total" },
                    orders: { $sum: 1 }
                }
            }
        ]);

        const currentDate = new Date();

        const months = [];

        for (let i = 2; i >= 0; i--) {
            const date = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() - i,
                1
            );

            months.push({
                monthNumber: date.getMonth() + 1,
                label: date.toLocaleString('en-US', {
                    month: 'short'
                })
            });
        }

        const REVENUE_3M = months.map(month => {
            const found = threeMonthRaw.find(
                x => x._id === month.monthNumber
            );

            return {
                name: month.label,
                revenue: found?.revenue || 0,
                orders: found?.orders || 0
            };
        });

        // const CATEGORY_DATA = [
        //     { name: 'Electronics', value: 420 }, { name: 'Clothing', value: 310 }, { name: 'Home', value: 275 },
        //     { name: 'Beauty', value: 190 }, { name: 'Sports', value: 155 }, { name: 'Books', value: 98 },
        // ];

        const categoryDataRaw = await Order.aggregate([
            { $unwind: "$items" },
            { $group: { _id: "$items.category", value: { $sum: 1 } } },
            { $project: { name: "$_id", value: 1, _id: 0 } },
            { $sort: { value: -1 } },
            { $limit: 6 } // Top 6 selling categories
        ]);
        const CATEGORY_DATA = categoryDataRaw.length > 0 ? categoryDataRaw : [{ name: 'No Orders Yet', value: 0 }];

        const TRAFFIC_DATA = [
            { name: 'Organic Search', value: 38, color: '#38bdf8' }, { name: 'Direct', value: 24, color: '#818cf8' },
            { name: 'Social Media', value: 20, color: '#2dd4bf' }, { name: 'Referral', value: 12, color: '#60a5fa' },
            { name: 'Email', value: 6, color: '#94a3b8' },
        ];

        res.json({
            success: true,
            data: {
                stats: STATS,
                // revenueData: REVENUE_DATA,
                // revenueData: { '7D': REVENUE_7D },
                revenueData: {
                    TODAY,
                    '7D': REVENUE_7D,
                    '1M': REVENUE_1M,
                    '3M': REVENUE_3M
                },
                categoryData: CATEGORY_DATA,
                trafficData: TRAFFIC_DATA,
                recentOrders: recentOrders
            }
        });

    } catch (err) {
        console.error('Dashboard Fetch Error:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch dashboard data.' });
    }
});

export default router;