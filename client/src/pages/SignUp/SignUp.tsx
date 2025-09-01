import { useState } from 'react';
import Input from '@/components/Input/Input';
import Email from '@/icons/Email';
import Password from '@/icons/Password';
import Google from '@/icons/Google';
import styles from './SignUp.module.scss';
import { Link } from 'react-router-dom';

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setError('');
        setSuccess('');

        if (!email || !password || !repeatPassword) {
            setError("All fields are required");
            return;
        }

        if (password !== repeatPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Failed to register");
            } else {
                setSuccess("Account created! You can now sign in.");
                setEmail('');
                setPassword('');
                setRepeatPassword('');
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = () => {
        // Redirect to your backend Google OAuth endpoint
        window.location.href = "/api/auth/google";
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1>Create an account</h1>
                <Input
                    className="mt-2 mb-5"
                    label="Email"
                    placeholder="Email"
                    type="email"
                    icon={<Email />}
                    value={email}
                    onChange={setEmail}
                />
                <Input
                    className="mb-5"
                    label="Password"
                    placeholder="Password"
                    type="password"
                    icon={<Password />}
                    value={password}
                    onChange={setPassword}
                />
                <Input
                    className="mb-10"
                    label="Repeat password"
                    placeholder="Repeat password"
                    type="password"
                    icon={<Password />}
                    value={repeatPassword}
                    onChange={setRepeatPassword}
                />

                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}

                <button
                    className={styles.button}
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Sign Up"}
                </button>

                <p className="mt-5 mb-5">
                    Already have an account? <Link to='/sign-in'>Sign In</Link>
                </p>
                <p className="mb-4">or</p>
                <button
                    className={styles.buttonGoogle}
                    onClick={handleGoogleSignUp}
                >
                    <Google />
                    Sign Up with Google
                </button>
            </div>
        </div>
    );
}