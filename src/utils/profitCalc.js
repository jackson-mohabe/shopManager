export const calculateProfit = (sales, expenses, products, month) => {
  const monthlySales = sales.filter((s) => s.date.includes(month));
  const monthlyExpenses = expenses.filter((e) => e.date.includes(month));

  const revenue = monthlySales.reduce((sum, s) => sum + s.total, 0);

  const cogs = monthlySales.reduce((sum, sale) => {
    return (
      sum +
      sale.items.reduce((itemSum, item) => {
        const product = products.find((p) => p.id === item.id);
        return itemSum + (product ? product.buy_price * item.cartQty : 0);
      }, 0)
    );
  }, 0);

  const totalExpenses = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

  const profit = revenue - cogs - totalExpenses;

  return {
    revenue,
    cogs,
    totalExpenses,
    profit,
    transactions: monthlySales.length,
  };
};
