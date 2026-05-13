import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
    const { apiUrl, setAuth, fetchMe } = useAuth();
    const googleUrl = `${apiUrl}/api/auth/google`;
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [formValues, setFormValues] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = searchParams.get("token");
        if (!token) return;

        setAuth({ token, user: null });
        fetchMe(token)
            .then(() => navigate("/account", { replace: true }))
            .catch(() => setError("Google sign-in failed. Please try again."));
    }, [searchParams, setAuth, fetchMe, navigate]);

    const handleChange = (event) => {
        setFormValues((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${apiUrl}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formValues),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            console.log(data);
            setAuth({ token: data.token, user: data.user });
            navigate("/account");
        } catch (err) {
            setError(err.message || "Login failed");
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
                                    Welcome back
                                </p>
                                <h1 className="text-4xl md:text-5xl font-serif mt-4">
                                    Sign in to SUMMER5
                                </h1>
                                <p className="text-sm text-muted-foreground mt-4">
                                    Access your saved items, track orders, and keep your cart
                                    synced across devices.
                                </p>
                                <div className="mt-8 space-y-3 text-sm text-muted-foreground">
                                    <p>- Fast checkout and saved addresses</p>
                                    <p>- Personalized product recommendations</p>
                                    <p>- Early access to new collections</p>
                                </div>
                            </div>

                              <div className="border border-border bg-card p-8 md:p-10 rounded-2xl">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-serif">Sign in</h2>
                                    <Link to="/signup" className="text-sm hover:underline">
                                        New here? Create account
                                    </Link>
                                </div>

                                <form className="space-y-5 mt-6" onSubmit={handleSubmit}>
                                    <Input
                                        type="email"
                                        name="email"
                                        placeholder="Email *"
                                        className="bg-transparent border-border rounded-none py-6"
                                        value={formValues.email}
                                        onChange={handleChange}
                                        required
                                    />

                                    <Input
                                        type="password"
                                        name="password"
                                        placeholder="Password *"
                                        className="bg-transparent border-border rounded-none py-6"
                                        value={formValues.password}
                                        onChange={handleChange}
                                        required
                                    />

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-primary text-primary-foreground py-6 hover:bg-primary/90 w-full"
                                    >
                                        {loading ? "Signing in..." : "Sign in"}
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
                                    By signing in, you agree to our terms and privacy policy.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
             </Layout>
        )
}

export default Login;