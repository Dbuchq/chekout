import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productName: 'JNR - Falcon 16K - E-Papieros jednorazowy',
        amount: 10290, // Amount in grosze (PLN cents)
        currency: 'pln',
        image: 'https://www.dbucha.com/cdn/shop/files/JNR_-_Falcon_16K_-_E-Papieros_jednorazowy_strawberry-watermelone-ice.png?v=1753099419&width=990'
      }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert('Błąd podczas tworzenia sesji płatności.');
    }
    setLoading(false);
  };

  return (
    <div style={{ textAlign: 'center', paddingTop: '4rem', color: '#e26a2c' }}>
      <h1>Strona Płatności</h1>
      <button
        onClick={handleCheckout}
        disabled={loading}
        style={{
          background: '#e26a2c',
          color: '#fff',
          padding: '1rem 2rem',
          fontSize: '1.2rem',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '8px',
          marginTop: '2rem'
        }}
      >
        {loading ? 'Ładowanie...' : 'Przejdź do płatności'}
      </button>
    </div>
  );
}
