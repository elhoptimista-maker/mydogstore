

# Card Payments (Chile Only)

Learn how to use the Checkout Session API to create a card payment

You can accept debit and credit cards from customers in Chile by using the Checkout Session API. Customers will be redirect to a page to fulfill their credit credentials and conclude the transaction.

Fintoc accepts any card from Visa or Mastercard: debit, credit, prepaid. As well as international cards, from banks outside Chile.

## Create a card payment

Using your Secret Key, create a `Checkout Session` on your server with an `amount`, `currency`(only CLP for Card Payments), `success_url`, `cancel_url` and `payment_methods: ["card"]`:

```curl
curl --request POST \
     --url https://api.fintoc.com/v1/checkout_sessions \
     --header 'accept: application/json' \
     --header 'content-type: application/json' \
     --data '
{
  "amount": 100000,
  "currency": "CLP",
  "cancel_url": "https://merchant.com/987654321",
  "success_url": "https://merchant.com/success",
  "customer_email": "customer@example.com",
  "metadata": {
    "order": "123456"
  },
  "payment_methods": ["card"]
}'
```

<Table align={["left","left","left"]}>
  <thead>
    <tr>
      <th>
        Parameter
      </th>

      <th>
        Example
      </th>

      <th>
        Explanation
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        `amount`
      </td>

      <td>
        `100000`
      </td>

      <td>
        Amount of money that needs to be paid. It's represented as an integer with no decimals in the smallest possible unit of the currency you are using.
      </td>
    </tr>

    <tr>
      <td>
        `currency`
      </td>

      <td>
        `CLP`
      </td>

      <td>
        Currency that is being used for the payment. We currently only support CLP for card payments.
      </td>
    </tr>

    <tr>
      <td>
        `cancel_url`
      </td>

      <td>
        `https://merchant.com/987654321`
      </td>

      <td>
        URL to redirect the user in case they decide to cancel the payment and return to your website.
      </td>
    </tr>

    <tr>
      <td>
        `success_url`
      </td>

      <td>
        `https://merchant.com/success`
      </td>

      <td>
        URL to redirect the user in case of payment succeeded.
      </td>
    </tr>

    <tr>
      <td>
        `customer_email`
      </td>

      <td>
        `customer@example.com`
      </td>

      <td>
        A customer email linked to the Checkout Session.
      </td>
    </tr>

    <tr>
      <td>
        `payment_methods`
      </td>

      <td>
        `["card"]`
      </td>

      <td>
        List of payment method enable in the checkout. Currently supported methods are `card` and `payment_intent`.

        `card` represents credit, debit, or prepaid card options, while `payment_intent` represents the pay-by-bank option.

        **You can enable one or both methods. If both are enabled, the user will be able to choose their preferred option on the Fintoc Checkout Page.**
      </td>
    </tr>

    <tr>
      <td>
        `metadata`
      </td>

      <td>
        ```
        { "order": "#987654321"  
        }
        ```
      </td>

      <td>
        Optional set of key-value pairs that you can attach to an object. This can be useful for storing additional information about the object in a structured format.
      </td>
    </tr>
  </tbody>
</Table>

> 📘 Card Payment Only Available via the Redirect Page Flow
>
> To accept card payments you must use the integration via a [Redirect Page](https://docs.fintoc.com/docs/redirect-page) where you will redirect users to a Fintoc-hosted payment page.
>
> After completing the payment, they’ll be automatically redirected back to your site on the `success_url `or `cancel_url`, based on the outcome of the payment.

> 📘 Business Profile Object
>
> You can add the `business_profile` object when creating a session to enable **category-based billing**, allowing you to have different pricing based on the merchant's category. Additionally, it allows you to customize the name displayed as the "Recipient" on the payment flow.
>
> [Read here to learn more](https://docs.fintoc.com/reference/create-checkout-session).

## Response when creating a Checkout Session for a card payment

After making the request, Fintoc will respond with the Checkout Session with the status `created` including the `redirect_url`you will use to redirect your user to complete the payment:

```json
{
  id: "cs_li5531onlFDi235",
  created_at: "2025-02-15T15:22:11.474Z",
  object: "checkout_session",
  expires_at: "2025-02-15T15:37:11.474Z",
  mode: "live",
  status: "created",
  metadata: {
    "order": "123456"
  },
  payment_methods: ["card"],
  currency: "CLP",
  amount: 100000,
  cancel_url: "https://merchant.com/987654321",
  success_url: "https://merchant.com/success",
  redirect_url: "https://pay.fintoc.com/payment?checkout_sesion=cs_li5531onlFDi235"
}

```

| Parameter      | Example                                                              | Explanation                                      |
| :------------- | :------------------------------------------------------------------- | :----------------------------------------------- |
| `redirect_url` | `https://pay.fintoc.com/payment?checkout_session=cs_li5531onlFDi235` | URL to redirect the user to complete the payment |

<Image align="center" alt="cards-payment-flow" border={false} caption="Payment flow at the `redirect_url`" src="https://files.readme.io/50dd4115417cdb3fadac6907a67c0ea443c2a30e7961278e0a5770050418bfb9-tarjetas.png" />

## Handle post-payments events

Once a Checkout Session finishes, you handle the payment result in your frontend and complete the payment in your backend. For your frontend you will use the`success_url` and `cancel_url` , and for your backend you will use the events sent by webhooks.

Fintoc sends a `checkout_session.finished` event when the payment completes. [Follow the webhook guide](https://docs.fintoc.com/docs/webhooks-walkthrough) to receive these events and run actions, such as sending an order confirmation email to your customer, logging the sale in a database, or starting a shipping workflow.

You should handle the following events:

| Event                       | Description                                                                | Action                                                 |
| :-------------------------- | :------------------------------------------------------------------------- | :----------------------------------------------------- |
| `checkout_session.finished` | Sent when a payment associated to a Checkout Session reaches a final state | Complete the order based on the payment's final status |
| `checkout_session.expired`  | Sent when a session expires                                                | Offer the customer another attempt to pay.             |

## Test your integration

To simulate a successful or failed card payment, you can use one of the following card credentials during the payment process:

| Card Number      | Expiration Date | CVV | Holder Name | Final Result                         |
| ---------------- | :-------------- | :-- | :---------- | ------------------------------------ |
| 4111111111111111 | Any future date | Any | Any         | :white\_check\_mark: Succeeded       |
| 4574441215190335 | Any future date | Any | Any         | ❌ Failed due to invalid credentials  |
| 4349003000047015 | Any future date | Any | Any         | ❌ Failed due to rejected transaction |

## Checkout UX Guideline

To ensure a good experience and understanding for your users, add the button to pay using credit or debit cards on your checkout using the images bellow depending on your configuration:

<Table align={["left","left","left"]}>
  <thead>
    <tr>
      <th />

      <th>
        Description
      </th>

      <th>
        HTML
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        ![](https://files.readme.io/3f137f9632c737362a8783aa9c1853808b73903ab5a7f3c09eb0cdcf3a7a06ba-directionhorizontal.png)
      </td>

      <td>
        Horizontal logos to use with the text "Paga con tarjeta de Débito o Crédito"
      </td>

      <td>
        `<img src="https://assets.fintoc.com/credit_card_assets/credit_card_horizontal"   
                                                                             alt="Fintoc and Card Brands Logos"   
                                                                             style="max-width: 100%; height: auto;">`
      </td>
    </tr>

    <tr>
      <td>
        ![](https://files.readme.io/ee156abf75536518de6eb25d687346e6e84cf62b3ba00f6192b722dcdd722f20-directionvertical.png)
      </td>

      <td>
        Vertical logos to use with the text "Paga con tarjeta de Débito o Crédito"
      </td>

      <td>
        `<img src="https://assets.fintoc.com/credit_card_assets/credit_card_vertical"   
                                                                             alt="Fintoc and Card Brands Logos"   
                                                                             style="max-width: 100%; height: auto;">`
      </td>
    </tr>
  </tbody>
</Table>

Example of checkout button on light and dark modes following the guidelines:

<Image align="left" border={false} src="https://files.readme.io/1523010780152c973ffe99e292b9f1dd960675ff670578894083f4c782eda62b-Frame_1171280903.png" />