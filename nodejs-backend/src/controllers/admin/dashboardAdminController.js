const prisma = require('../../config/prisma');

/**
 * GET /api/admin/dashboard/stats
 * Returns dashboard statistics: totalSales, totalOrders, totalCustomers, totalProducts, recentOrders, topProducts, salesByMonth
 */
const getDashboardStats = async (req, res) => {
  try {
    // Total sales (sum of all completed/paid orders)
    const totalSales = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: { in: ['PAID', 'COMPLETED'] } }
    });
    // Total orders
    const totalOrders = await prisma.order.count();
    // Total customers
    const totalCustomers = await prisma.user.count();
    // Total products
    const totalProducts = await prisma.product.count();
    // Recent 5 orders
    const recentOrders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        user: { select: { name: true } }
      }
    });
    // Top 3 selling products (by quantity)
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 3
    });
    const topProductDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({ where: { id: item.productId } });
        return {
          id: product.id,
          name: product.name,
          sales: item._sum.quantity,
          revenue: product.price * item._sum.quantity,
          stock: product.stock
        };
      })
    );
    // Sales by month (last 6 months)
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      return { year: d.getFullYear(), month: d.getMonth() + 1 };
    }).reverse();
    const salesByMonth = await Promise.all(
      months.map(async ({ year, month }) => {
        const firstDay = new Date(year, month - 1, 1);
        const lastDay = new Date(year, month, 0, 23, 59, 59, 999);
        const orders = await prisma.order.findMany({
          where: {
            createdAt: { gte: firstDay, lte: lastDay },
            status: { in: ['PAID', 'COMPLETED'] }
          }
        });
        const sales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
        return {
          month: firstDay.toLocaleString('default', { month: 'short' }),
          sales
        };
      })
    );
    res.json({
      totalSales: totalSales._sum.totalAmount || 0,
      totalOrders,
      totalCustomers,
      totalProducts,
      recentOrders: recentOrders.map(o => ({
        id: o.id,
        customer: o.user?.name || 'Unknown',
        date: o.createdAt.toISOString().slice(0, 10),
        amount: o.totalAmount,
        status: o.status.toLowerCase()
      })),
      topProducts: topProductDetails,
      salesByMonth
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats', error: error.message });
  }
};

module.exports = { getDashboardStats };
