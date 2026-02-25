const formattedCurrency = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })
    .format(number)
    .replace("Rp", "Rp.");
};

module.exports = formattedCurrency;
