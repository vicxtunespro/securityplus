'use client'
import InputField from "@/components/Data Models/input-field"
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import AuthProviderBtn from "@/components/auth/authProviderButton";



export default () => {

    const {email, password, setEmail, setPassword, error, loading, login} = useAuthStore();

    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        login(router);
    }
    
    return (
        <main className="w-full h-screen flex flex-col items-center justify-center px-4 border-t-blue-500 border-t-4">
            <div className="max-w-sm w-full text-gray-600">
                <div className="text-center">
                    <img src="/logo.png" width={100} className="mx-auto" />
                    <div className="mt-5 space-y-2">
                        <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Sign up</h3>
                        <p className="">Already have an account? <a href="javascript:void(0)" className="font-medium text-indigo-600 hover:text-indigo-500">Log in</a></p>
                    </div>
                </div>
                <form
                    className="mt-8 space-y-5"
                    onSubmit={handleSubmit}
                >
                    <InputField
                        label={"Email"}
                        type={"email"}
                        placeholder={""}
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        name="email"
                    />
                    <InputField
                        label={"Password"}
                        type={"password"}
                        placeholder={""}
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        name="email"
                    />
                    
                    <button
                        type="submit" disabled={loading}
                        className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <AuthProviderBtn/>
            </div>
        </main>
    )
}