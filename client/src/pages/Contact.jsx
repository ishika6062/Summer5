import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Contact = () => {
  const [result, setResult] = useState("");
  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.append("access_key", "671eaed5-5d68-467c-a128-8b92cd2e0564");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    setResult(data.success ? "Success!" : "Error");
  };

  return (
    <Layout>
      <div className="px-6 lg:px-12 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Page Title */}
          <h1 className="text-4xl md:text-5xl font-serif mb-8">Contact</h1>

          {/* Email */}
          <p className="text-muted-foreground mb-12">
            Email - summer5.store@outlook.com
          </p>

          {/* Contact Form */}
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                type="text"
                placeholder="Name"
                className="bg-transparent border-border rounded-none py-6"
              />
              <Input
                type="email"
                placeholder="Email *"
                required
                className="bg-transparent border-border rounded-none py-6"
              />
            </div>

            <Input
              type="tel"
              placeholder="Phone number"
              className="bg-transparent border-border rounded-none py-6"
            />

            <Textarea
              placeholder="Comment"
              rows={6}
              className="bg-transparent border-border rounded-none resize-none"
            />

            <Button
              type="submit"
              className="bg-primary text-primary-foreground px-12 py-6 hover:bg-primary/90"
            >
              Send
            </Button>
            <p>{result}</p>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;