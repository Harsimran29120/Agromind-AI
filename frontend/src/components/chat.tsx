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

export default function ChatSection() {
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
      <Card className="w-full h-full mx-auto from-white/20 shadow-lg ring-1 ring-black/5 backdrop-blur-sm bg-gradient-to-br transition-transform duration-500 transform origin-center">      <CardHeader className={'h-1/5'}>
        <CardTitle>Chatbot</CardTitle>
      </CardHeader>
      <CardContent className={'h-3/5'}>
        <ScrollArea className="h-full pr-4 mb-4">
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
      </CardContent>
      <CardFooter className={'flex flex-col h-1/5'}>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {predefinedQuestions.map((question, index) => (
              <Button
                  key={index}
                  variant="outline"
                  className="h-auto py-2 px-4 text-sm text-left whitespace-normal"
                  onClick={() => handleSend(question)}
              >
                {question}
              </Button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend(input)
          }}
          className="flex w-full items-center space-x-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <Button type="submit">Send</Button>
        </form>
      </CardFooter>
    </Card>
  )
}
