"use client"
import { useEffect, useState } from "react"

declare global {
    interface Window {
        Telegram?: {
            WebApp?: any
        }
    }
}

export default function Home() {
    const [isChannelMember, setIsChannelMember] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [telegramId, setTelegramId] = useState<string | null>(null);
    const [channelUserName, setChannelUserName] = useState('');
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        if (window.Telegram?.WebApp) {
            const initDataString = window.Telegram.WebApp.initData;
            if (initDataString) {
                const urlParams = new URLSearchParams(initDataString);
                try {
                    const user = JSON.parse(urlParams.get('user') || '{}');
                    if (user.id) {
                        setTelegramId(user.id.toString());
                    }
                } catch (error) {
                    console.error("Error parsing user data", error);
                }
            }
        }
    }, [])

    const checkMemberShip = async () => {
        if (!telegramId) {
            alert('This app can only be used within Telegram');
            return;
        }

        if (!channelUserName) {
            alert('Please enter a channel username');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/check-membership', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ telegramId, channelUserName, }),
            })

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to check membership');
            }

            const data = await response.json();
            setIsChannelMember(data.isMenber);
            setError(null);
        } catch (error) {
            console.error('Error checking channel membership', error);
            setIsChannelMember(false);
            setError(error instanceof Error ? error.message : 'An unknown error occurred')
        } finally {
            setIsLoading(false);
        }
    }

    if (!telegramId) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center p-4">
                <h1 className="text-4xl font-bold mb-8">Telegram channel memberShip check</h1>
                <p className="text-xl">This app can only be used within Telegram as a Mini App.</p>
            </main>
        )
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4">
            <h1 className="text-4xl font-bold mb-8">Telegram channel memberShip check</h1>
            <input
                type="text"
                value={channelUserName}
                onChange={(e) => setChannelUserName(e.target.value)}
                placeholder="Enter channel username (e.g., @example)"
                className="mb-4 p-2 border border-gray-300 rounded w-full max-w-xs"
            />

            <button onClick={checkMemberShip}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={isLoading || !channelUserName}
            >
                {isLoading ? 'Checking...' : 'Check membership'}
            </button>
            {error && <p className="ml-4 text-red-500">{error}</p>}
            { isChannelMember !== null && !isLoading && (
                <p className="mt-4 text-xl">
                    { isChannelMember ? 'You are a member of the channel' : 'You are not a member of the channel'}
                </p>
            )}
        </main>
    );
}