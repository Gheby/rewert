
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import stripe from "stripe";
import Stripe from "stripe";



export async function POST(req: Request) {
    const body = await req.json();
    const signature = req.headers.get("stripe-signature") as string;

    let event: Stripe.Event;
    try{
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    }
    catch(err: any){
        console.error("Error constructing Stripe webhook event:", err);
        return new Response("Webhook Error", { status: 400 });
    }


    const session = event.data.object as Stripe.Checkout.Session;
    const address = session?.customer_details?.address;


    const addressComponents = [
        address?.line1,
        address?.line2,
        address?.city,
        address?.state,
        address?.postal_code,
        address?.country
    ];

    const addressString = addressComponents.filter((c)=> c!==null).join(", ");

    if (event.type === "checkout.session.completed") {
        // Handle the checkout session completed event
        const order = await prismadb.order.update({
            where: {
                id: session?.metadata?.orderId,
            },
            data: {
                isPaid: true,
                address: addressString,
                phone: session?.customer_details?.phone || "",
            },
            include: {
                orderItems: true,
            },
        });

        const productIds = order.orderItems.map((orderItem) => orderItem.productId);

        await prismadb.product.updateMany({
            where: {
                id: {
                    in: [...productIds],
                },
            },
            data: {
                isArchived: true,
            },
        });

        console.log("Order marked as paid:", order);
    }


    return new NextResponse(null, { status: 200 });

}
