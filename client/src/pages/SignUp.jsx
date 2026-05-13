import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const SignUp = () => {
    const { apiUrl, setAuth } = useAuth();
    const googleUrl = `${apiUrl}/api/auth/google`;
    const navigate = useNavigate();
    const [formValues, setFormValues] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setFormValues((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (formValues.password !== formValues.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${apiUrl}/api/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formValues.name,
                    email: formValues.email,
                    password: formValues.password,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Signup failed");
            }

            setAuth({ token: data.token, user: data.user });
            navigate("/account");
        } catch (err) {
            setError(err.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

        return (
                <Layout>
                        <div className="px-6 lg:px-12 py-12">
                                <div className="max-w-5xl mx-auto">
                                        <div className="grid md:grid-cols-[1.1fr_1fr] gap-10 items-start">
                                                <div className="bg-secondary/60 p-8 md:p-10">
                                                        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                                                                Create your account
                                                        </p>
                                                        <h1 className="text-4xl md:text-5xl font-serif mt-4">
                                                                Join the SUMMER5 community
                                                        </h1>
                                                        <p className="text-sm text-muted-foreground mt-4">
                                                                Save your favorites, keep checkout simple, and get early
                                                                access to new collections.
                                                        </p>
                                                        <div className="mt-8 space-y-3 text-sm text-muted-foreground">
                                                                <p>- Save favorites and wishlists</p>
                                                                <p>- Track orders in one place</p>
                                                                <p>- Enjoy members-only drops</p>
                                                        </div>
                                                </div>

                                                <div className="border border-border bg-card p-8 md:p-10 rounded-2xl">
                                                        <div className="flex items-center justify-between">
                                                                <h2 className="text-2xl font-serif">Sign up</h2>
                                                                <Link to="/login" className="text-sm hover:underline">
                                                                        Have an account? Sign in
                                                                </Link>
                                                        </div>

                                                        <form className="space-y-5 mt-6" onSubmit={handleSubmit}>
                                                                <Input
                                                                        type="text"
                                                                        name="name"
                                                                        placeholder="Name"
                                                                        className="bg-transparent border-border rounded-none py-6"
                                                                        value={formValues.name}
                                                                        onChange={handleChange}
                                                                />

                                                                <Input
                                                                        type="email"
                                                                        name="email"
                                                                        placeholder="Email *"
                                                                        required
                                                                        className="bg-transparent border-border rounded-none py-6"
                                                                        value={formValues.email}
                                                                        onChange={handleChange}
                                                                />

                                                                <Input
                                                                        type="password"
                                                                        name="password"
                                                                        placeholder="Password *"
                                                                        required
                                                                        className="bg-transparent border-border rounded-none py-6"
                                                                        value={formValues.password}
                                                                        onChange={handleChange}
                                                                />

                                                                <Input
                                                                        type="password"
                                                                        name="confirmPassword"
                                                                        placeholder="Confirm Password"
                                                                        required
                                                                        className="bg-transparent border-border rounded-none py-6"
                                                                        value={formValues.confirmPassword}
                                                                        onChange={handleChange}
                                                                />

                                                                <Button
                                                                        type="submit"
                                                                        disabled={loading}
                                                                        className="bg-primary text-primary-foreground py-6 hover:bg-primary/90 w-full"
                                                                >
                                                                        {loading ? "Creating..." : "Create account"}
                                                                </Button>
                                                        </form>

                                                        {error && (
                                                                <p className="mt-4 text-sm text-destructive">{error}</p>
                                                        )}

                                                        <div className="mt-6">
                                                                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                                                        <span className="h-px flex-1 bg-border" />
                                                                        or
                                                                        <span className="h-px flex-1 bg-border" />
                                                                </div>
                                                                <Button
                                                                        variant="outline"
                                                                        className="w-full py-6 mt-6 flex items-center justify-center gap-3"
                                                                        asChild
                                                                >
                                                                        <a href={googleUrl}>
                                                                                <img
                                                                                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                                                                        alt="Google"
                                                                                        className="h-5 w-5"
                                                                                />
                                                                                Continue with Google
                                                                        </a>
                                                                </Button>
                                                        </div>

                                                        <p className="mt-6 text-xs text-muted-foreground">
                                                                By creating an account, you agree to our terms and privacy
                                                                policy.
                                                        </p>
                                                </div>
                                        </div>
                                </div>
                        </div>
                </Layout>
        );

};

export default SignUp;