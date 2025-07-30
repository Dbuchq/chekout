import React, { useState } from 'react';

const products = [
  {
    id: 1,
    name: 'JNR - Falcon 16K - E-Papieros jednorazowy',
    description: 'Strawberry Watermelon Ice 🍓🍉❄️',
    price: 102.9,
    image: 'https://www.dbucha.com/cdn/shop/files/JNR_-_Falcon_16K_-_E-Papieros_jednorazowy_strawberry-watermelone-ice.png?v=1753099419&width=990',
  },
];

export default function Checkout() {
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(selectedProduct.price * 100),
          currency: 'pln',
          productName: selectedProduct.name,
          image: selectedProduct.image,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Błąd podczas tworzenia sesji płatności.');
      }
    } catch (err) {
      alert('Błąd płatności.');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', fontFamily: 'Arial, sans-serif', padding: 20, backgroundColor: '#F7941E', color: 'white', borderRadius: 10 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 30 }}>Realizacja zakupu – dbucha.com</h2>

      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        <img
          src={selectedProduct.image}
          alt={selectedProduct.name}
          style={{ width: 150, borderRadius: 8 }}
        />

        <div>
          <h3>{selectedProduct.name}</h3>
          <p style={{ marginBottom: 5 }}>{selectedProduct.description}</p>
          <strong>Cena: {selectedProduct.price.toFixed(2)} PLN</strong>
        </div>
      </div>

      <div style={{ marginTop: 30 }}>
        <label>Wybierz produkt:</label>
        <select
          value={selectedProduct.id}
          onChange={e =>
            setSelectedProduct(products.find(p => p.id === parseInt(e.target.value)))
          }
          style={{ padding: 10, width: '100%', borderRadius: 4, border: 'none', fontSize: 16, marginTop: 5 }}
        >
          {products.map(p => (
            <option key={p.id} value={p.id}>
              {p.name} - {p.price.toFixed(2)} PLN
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: 20, fontWeight: 'bold' }}>
        Łączna kwota do zapłaty: {selectedProduct.price.toFixed(2)} PLN
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        style={{
          marginTop: 30,
          width: '100%',
          padding: '12px 20px',
          backgroundColor: '#1e40af',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          fontSize: 16,
          cursor: 'pointer',
        }}
      >
        {loading ? 'Przetwarzanie...' : 'Zapłać teraz'}
      </button>

      <p style={{ marginTop: 20, fontSize: 13 }}>
        Po kliknięciu zostaniesz przekierowany do bezpiecznej strony płatności Stripe z opcjami takimi jak BLIK, karta lub Apple Pay.
      </p>
    </div>
  );
}
