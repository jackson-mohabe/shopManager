import * as XLSX from "xlsx";

export const exportFullReport = () => {
  try {
    const sales = JSON.parse(localStorage.getItem("sales") || "[]");
    const expenses = JSON.parse(localStorage.getItem("expenses") || "[]");
    const products = JSON.parse(localStorage.getItem("products") || "[]");

    const salesData = sales.map((s) => ({
      Date: s.date,
      Cashier: s.cashier,
      Items: s.items.map((i) => `${i.name}(${i.cartQty})`).join(", "),
      Total: s.total,
    }));

    const expensesData = expenses.map((e) => ({
      Date: e.date,
      Description: e.description,
      Category: e.category,
      Amount: e.amount,
    }));

    const stockData = products.map((p) => ({
      Name: p.name,
      Category: p.category,
      "Buy Price": p.buy_price,
      "Sell Price": p.sell_price,
      Quantity: p.quantity,
      Status: p.quantity <= 5 ? "Low Stock" : "OK",
    }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(salesData),
      "Sales",
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(expensesData),
      "Expenses",
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(stockData),
      "Stock",
    );

    const date = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");
    XLSX.writeFile(wb, `ShopBackup_${date}.xlsx`);
    return true;
  } catch (error) {
    console.error("Export failed:", error);
    return false;
  }
};
