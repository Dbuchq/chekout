const handleCheckout = async () => {
  setLoading(true);
  try {
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productName: selectedProduct.name,
        amount: Math.round(selectedProduct.price * 100), // in cents
        currency: 'pln',
      }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url; // Redirect to Stripe checkout page
    } else {
      alert('Błąd podczas tworzenia sesji płatności.');
    }
  } catch (err) {
    alert('Błąd płatności.');
  }
  setLoading(false);
};
