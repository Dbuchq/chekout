import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { productName, amount, currency, image } = req.body;

  if (!productName || !amount || !currency) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'blik'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: productName,
              ...(image && { images: [image] }),
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      shipping_address_collection: {
        allowed_countries: ['PL', 'DE', 'FR', 'IT', 'NL'],
      },
      billing_address_collection: 'required',
      success_url: 'https://dbucha.com/order-success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://dbucha.com/order-cancelled',
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe session error:', err);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
