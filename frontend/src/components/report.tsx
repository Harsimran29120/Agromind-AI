'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type Message = {
    id: number
    text: string
    sender: 'user' | 'bot'
}

const predefinedQuestions = [
    "Give me info about Soil Moisture?",
    "NASA is great?",
    "We got the chat",
    "Do you like it?"
]

export default function Report() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')

    const handleSend = async (text: string) => {
        if (text.trim()) {
            const newMessage: Message = {
                id: Date.now(),
                text: text.trim(),
                sender: 'user'
            }
            setMessages([...messages, newMessage])
            setInput('')

            try {
                const response = await fetch('http://localhost:8000/process', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ query: text.trim() })
                })

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const data = await response.json()

                const botResponse: Message = {
                    id: Date.now(),
                    text: data.message,
                    sender: 'bot'
                }

                setMessages(prevMessages => [...prevMessages, botResponse])

            } catch (error) {
                console.error('Error fetching data:', error)
                const botResponse: Message = {
                    id: Date.now(),
                    text: 'Sorry, something went wrong.',
                    sender: 'bot'
                }
                setMessages(prevMessages => [...prevMessages, botResponse])
            }
        }
    }

    return (
        <Card className="w-full h-full mx-auto from-white/20  shadow-lg ring-1 ring-black/5 backdrop-blur-sm bg-gradient-to-br">
            <CardHeader className={'flex flex-col space-y-6 h-1/5'}>
                <CardTitle>Report📃</CardTitle>
                <Button className="y-4" onClick={() => {} }>
Recent reports
</Button>
            </CardHeader>
            <CardContent className={'h-3/5'}>
                <ScrollArea className="h-full pr-4 mb-4 hidden">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${
                                message.sender === 'user' ? 'justify-end' : 'justify-start'
                            } mb-4`}
                        >
                            <div
                                className={`flex items-end ${
                                    message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                                }`}
                            >
                                <Avatar className="w-8 h-8">
                                    <AvatarFallback>
                                        {message.sender === 'user' ? 'U' : 'B'}
                                    </AvatarFallback>
                                </Avatar>
                                <div
                                    className={`mx-2 text-sm py-2 px-3 rounded-lg ${
                                        message.sender === 'user'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted'
                                    }`}
                                >

                                    {message.text}

                                </div>
                            </div>
                        </div>
                    ))}
                </ScrollArea>
                <div className={'justify-items-center justify-center border rounded-xl p-2 border-white'}>
                    <p className={'text-sm  text-center  '}>
                       After selecting the map and analysis the report will be shown here, <br/> then you can use the chatbot to ask questions
                    </p>
                </div>
            </CardContent>
            <CardFooter className={'flex flex-col h-1/5 justify-end'}>
                <p className={'text-sm'}>
                    Made by AgroMind AI
                </p>
            </CardFooter>
        </Card>
    )
}
