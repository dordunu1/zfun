// Calculate metrics
const validOrders = orders.filter(order => order.status !== 'cancelled');
const grossRevenue = validOrders.reduce((sum, order) => {
  // If order is refunded, don't include it in revenue
  if (order.status === 'refunded') {
    return sum;
  }
  return sum + (order.total || 0);
}, 0);

// Calculate total withdrawn amount
const totalWithdrawn = withdrawals.reduce((sum, withdrawal) => {
  return sum + (withdrawal.amount || 0);
}, 0);

// All time revenue is just the gross revenue (total earned)
const allTimeRevenue = grossRevenue;

// Net revenue is gross revenue minus completed withdrawals
const netRevenue = grossRevenue - totalWithdrawn;

// Calculate this month's and last month's metrics
const thisMonthRevenue = thisMonthOrders.reduce((sum, order) => {
  return order.status !== 'refunded' && order.status !== 'cancelled' 
    ? sum + (order.total || 0) : sum;
}, 0);

const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => {
  return order.status !== 'refunded' && order.status !== 'cancelled'
    ? sum + (order.total || 0) : sum;
}, 0);

const uniqueCustomers = new Set(validOrders.map(order => order.buyerId)).size;

return {
  ...seller,
  metrics: {
    allTimeRevenue: allTimeRevenue, // Total earned (without withdrawals)
    totalWithdrawn: totalWithdrawn, // Total amount withdrawn
    netRevenue: netRevenue, // Available for withdrawal (gross - withdrawn)
    totalOrders: orders.length,
    totalCustomers: uniqueCustomers,
    revenueChange: parseFloat(calculatePercentageChange(thisMonthRevenue, lastMonthRevenue).toFixed(1)),
    ordersChange: parseFloat(calculatePercentageChange(thisMonthOrders.length, lastMonthOrders.length).toFixed(1)),
    customersChange: parseFloat(calculatePercentageChange(
      new Set(thisMonthOrders.map(order => order.buyerId)).size,
      new Set(lastMonthOrders.map(order => order.buyerId)).size
    ).toFixed(1))
  }
}; 