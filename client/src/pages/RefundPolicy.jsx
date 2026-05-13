import Layout from "@/components/layout/Layout";

const RefundPolicy = () => {
    return (
        <Layout>
            <div className="my-10 flex flex-col items-center">
                <h1 className="text-4xl md:text-6xl text-[#392720] text-center py-5">
                    Refund Policy
                </h1>
                <div className="w-full md:max-w-2xl text-justify tracking-wide font-sans text-[#695B55]">
                    <h1 className="text-xl md:text-3xl text-[#392720] font-medium my-5">
                        Returns & Refunds
                    </h1>
                    <p>
                        We offer a 30-day return window from the date of delivery. <br />

                        To be eligible for a return, items must be:
                        <ul className="list-disc list-inside pl-5">
                        <li>Unused</li>
                        <li>In original condition</li>
                        <li>In original packaging</li>
                        </ul>
                        <br />
                        Returns requested after 30 days will not be accepted.
                        <br /> <br />
                        Non-Returnable Situations <br />
                        Returns will not be accepted for: <br />
                        <ul className="list-disc list-inside pl-5">
                        <li>Items that have been used or assembled</li>
                        <li>Items damaged due to improper use</li>
                        <li>Normal wear and tear</li>
                        <li>Buyer’s remorse after usage</li>
                        <li>Orders with incomplete or missing packaging</li>
                        </ul> <br />
                        Return Process
                        <br />To initiate a return, please contact us at support@summer5.store within 30 days of delivery.
                        Returns sent without prior approval will not be accepted.

                        <br /><br />If approved, you will receive instructions for returning the item to our US return address.

                        <br /><br />Return Shipping
                        <br />Customers are responsible for return shipping costs unless the item arrived damaged or defective.

                        <br /><br />Original shipping charges are non-refundable.

                        <br /><br />Damaged or Defective Items
                        <br />If your order arrives damaged or defective, please contact us within 48 hours of delivery with clear photos of the issue and packaging.
                        <br /><br />Claims submitted after 48 hours may not be accepted.

                        <br /><br />Refunds
                        <br />Once the returned item is received and inspected, refunds will be processed to the original payment method within 5–10 business days.

                        <br /><br />We reserve the right to refuse returns that do not meet the above conditions.
                    </p>
                </div>
            </div>
        </Layout>
    );
};
export default RefundPolicy;