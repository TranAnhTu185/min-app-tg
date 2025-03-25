import React, { useEffect, useState } from "react"
import "./globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import Script from "next/script";

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
    title: 'Telegram channel check',
    description: 'Check if user is a member of a Telegram channel',
}

export default function RootLayout({
    children,
}: Readonly<{children: React.ReactNode}>) {
    
    return (
        <html lang="en">
            <head>
                <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
            </head>
            <body className={inter.className}>
                {children}
            </body>
        </html>
    );
}