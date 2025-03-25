import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const botToken = process.env.BOT_TOKEN;
    if(!botToken) {
        return NextResponse.json({ error: 'Telegram'});
    }

    const { telegramId, channelUsesrName} = await req.json();

    if(!telegramId || !channelUsesrName) {
        return NextResponse.json({ error: "Invalid request"}, { status: 400 });
    }
    
    try {
        let formattedChatId = channelUsesrName;
        if(!channelUsesrName.startWith('@') && !channelUsesrName.startWith('-100')) {
            formattedChatId = '@' + channelUsesrName;
        }

        const url = `https://api.telegram.org/bot${botToken}/getChatmember?chat_id=${encodeURIComponent(formattedChatId)}&user_id=${telegramId}`;
        const response = await fetch(url);
        if(!response.ok) {
            const errorText = await response.text();
            console.error("Telegram error : ", response.status, errorText);
            return NextResponse.json({ error: `Telegram API error: ${response.status} ${errorText}`}, { status: 500 });
        }
    }catch (error) {
        console.error(" Error checking channel membership: ", error);
        if(error instanceof Error) {
            return NextResponse.json({ error: `Failed to check channel membership: ${error.message}`}, { status: 500 });
        }
        return NextResponse.json({ error: "An unknown error occurred while checking channel membership"}, { status: 500});
    }
}