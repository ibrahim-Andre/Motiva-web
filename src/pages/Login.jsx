// JavaScript source code
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert(error.message);
            return;
        }

        navigate("/admin");
    };

    return (

        <div className="min-h-screen bg-black flex items-center justify-center p-6">

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 w-full max-w-md">

                <h1 className="text-white text-4xl font-black mb-10">
                    Admin Login
                </h1>

                <div className="space-y-4">

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        className="w-full bg-black border border-zinc-700 rounded-xl px-5 py-4 text-white"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        className="w-full bg-black border border-zinc-700 rounded-xl px-5 py-4 text-white"
                    />

                    <button
                        onClick={handleLogin}
                        className="w-full bg-red-600 py-4 rounded-xl text-white font-bold hover:bg-red-700 transition"
                    >
                        Login
                    </button>

                </div>

            </div>

        </div>

    );
}