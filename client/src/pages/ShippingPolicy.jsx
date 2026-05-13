import Layout from "@/components/layout/Layout";

const ShippingPolicy = () => {
    return (
        <Layout>
            <div className="my-10 flex flex-col items-center">
                <h1 className="text-4xl md:text-6xl text-[#392720] text-center py-5">
                    Shipping Policy
                </h1>
                <div className="w-full md:max-w-2xl text-justify tracking-wide font-sans text-[#695B55]">
                    <p>
                        Shipping Information <br />
                        <br />We currently ship within the United States only.

                        <br /><br />All orders are processed within 1–3 business days from our US warehouse.
                        Orders are delivered within 3–7 business days after dispatch.

                        <br /><br />Once your order ships, you will receive a tracking number via email.

                        <br />Please note: <br />
                        • Delivery times may vary slightly for remote locations <br />
                        • Orders are not shipped on weekends or US public holidays

                        <br /><br />If you have any questions about your order, feel free to contact us at support@summer5.store
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default ShippingPolicy;