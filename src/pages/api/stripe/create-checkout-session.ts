/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable import/no-extraneous-dependencies */
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
// import { type } from 'os';
import Stripe from 'stripe';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2022-11-15',
  });

  type User = {
    id?: string | number | null | undefined;
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
    stripeCustomerId?: string | undefined;
  };
  type Session = {
    user?: User | null | undefined;
  };
  // This object will contain the user's data if the user is signed in
  const session = (await getSession({ req })) as Session;

  // Error handling
  if (!session?.user) {
    return res.status(401).json({
      error: {
        code: 'no-access',
        message: 'You are not signed in.',
      },
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    /* This is where the magic happens - this line will automatically link this Checkout page to the existing customer we created when the user signed-up, so that when the webhook is called our database can automatically be updated correctly. */
    customer: session.user.stripeCustomerId,
    line_items: [
      {
        price: 'price_1MWQvsLuQQUKdA1xIk33XJHs', // THE PRICE ID YOU CREATED EARLIER,
        quantity: 1,
      },
    ],
    // {CHECKOUT_SESSION_ID} is a string literal which the Stripe SDK will replace; do not manually change it or replace it with a variable!
    success_url: 'http://localhost:3000/?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'http://localhost:3000/?cancelledPayment=true',
    subscription_data: {
      metadata: {
        // This isn't 100% required, but it helps to have so that we can manually check in Stripe for whether a customer has an active subscription later, or if our webhook integration breaks.
        // payingUserId: session.user.id,
      },
    },
  });

  if (!checkoutSession.url) {
    return res.status(500).json({
      cpde: 'stripe-error',
      error: 'Could not create checkout session',
    });
  }

  // Return the newly-created checkoutSession URL and let the frontend render it
  return res.status(200).json({ redirectUrl: checkoutSession.url });
};
