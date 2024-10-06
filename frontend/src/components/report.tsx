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
    )
}
