import Layout from "@/components/layout/Layout";

const TermsOfService = () => {
    return (
        <Layout>
            <div className="my-10 flex flex-col items-center">
                <h1 className="text-4xl md:text-6xl text-[#392720] text-center py-5">
                    Terms of Service
                </h1>

                <div className="w-full md:max-w-2xl text-justify tracking-wide font-sans text-[#695B55]">
                    <h1 className="text-xl md:text-3xl text-[#392720] font-medium my-5">
                        OVERVIEW
                    </h1>
                    <p>
                        Welcome to Summer5! The terms “we”, “us” and “our” refer to Summer5. Summer5 operates this store and website, including all related information, content, features, tools, products and services in order to provide you, the customer, with a curated shopping experience (the “Services”). Summer5 is powered by Shopify, which enables us to provide the Services to you.
                        The below terms and conditions, together with any policies referenced herein (these “Terms of Service” or “Terms”) describe your rights and responsibilities when you use the Services.
                        <br />Please read these Terms of Service carefully, as they include important information about your legal rights and cover areas such as warranty disclaimers and limitations of liability.
                        <br />By visiting, interacting with or using our Services, you agree to be bound by these Terms of Service and our Privacy Policy [LINK]. If you do not agree to these Terms of Service or Privacy Policy, you should not use or access our Services.
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default TermsOfService;