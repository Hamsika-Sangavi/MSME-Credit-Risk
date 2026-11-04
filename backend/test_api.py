import ollama

response = ollama.chat(
    model="llama3.1",
    messages=[{"role": "user", "content": "Say hello in 5 words."}]
)
print(response["message"]["content"])