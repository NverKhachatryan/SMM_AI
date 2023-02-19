/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable simple-import-sort/imports */
import type { NextApiRequest, NextApiResponse } from 'next';
// eslint-disable-next-line import/no-extraneous-dependencies
import { buffer } from 'micro';
import Stripe from 'stripe';
// eslint-disable-next-line import/extensions, import/no-named-as-default
import { prisma } from '../../../../prisma/shared-client';

// eslint-disable-next-line prettier/prettier
const endpointSecret = 'whsec_a0007c68033c0d2084058aff539b3731f1b928f5f7ba77c0dbc2a744887eed5f'; // YOUR ENDPOINT SECRET copied from the Stripe CLI start-up earlier, should look like 'whsec_xyz123...'

export const config = {
  api: {
    bodyParser: false, // don't parse body of incoming requests because we need it raw to verify signature
  },
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'POST') {
    try {
      const requestBuffer = await buffer(req);
      const sig = req.headers['stripe-signature'] as string;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
        apiVersion: '2022-11-15',
      });
      let event;

      console.log(sig);
      try {
        // Use the Stripe SDK and request info to verify this Webhook request actually came from Stripe
        event = stripe.webhooks.constructEvent(
          requestBuffer.toString(), // Stringify the request for the Stripe library
          sig,
          endpointSecret
        );
        console.log(`✅  Webhook signature verified!`, event.id);
      } catch (err: any) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook signature verification failed.`);
      }

      // Handle the event
      switch (event.type) {
        // Handle successful subscription creation
        case 'customer.subscription.created': {
          const subscription = event.data.object as Stripe.Subscription;
          console.log(subscription);
          await prisma.user.update({
            // Find the customer in our database with the Stripe customer ID linked to this purchase
            where: {
              stripeCustomerId: subscription.customer as string,
            },
            // Update that customer so their status is now active
            data: {
              isActive: true,
            },
          });
          break;
        }
        // ... handle other event types
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      // Return a 200 response to acknowledge receipt of the event
      res.status(200).json({ received: true });
    } catch (err) {
      // Return a 500 error
      console.log(err);
      res.status(500).end();
    }
  }
};
