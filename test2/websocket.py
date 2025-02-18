import asyncio
import websockets
import threading

# Store the connected clients
clients = []

# Function to handle communication with the client
async def handle_client(websocket, path):
    print(f"Client connected: {websocket.remote_address}")
    # Add client to the list
    clients.append(websocket)
    
    try:
        # Wait for messages from the client (if needed)
        async for message in websocket:
            print(f"Received message from {websocket.remote_address}: {message}")
    except websockets.exceptions.ConnectionClosed as e:
        print(f"Client {websocket.remote_address} disconnected")
    finally:
        # Remove the client from the list when they disconnect
        clients.remove(websocket)

# Function to send messages to all connected clients from terminal
def send_message():
    while True:
        message = input("Enter message to send to all clients: ")
        if message:
            # Send the message to all connected clients
            for client in clients:
                try:
                    asyncio.run(client.send(message))
                    print(f"Sent message to {client.remote_address}")
                except:
                    print(f"Failed to send message to {client.remote_address}")

# Create the WebSocket server
async def start_server():
    server = await websockets.serve(handle_client, "localhost", 8765)
    print("Server started on ws://localhost:8765")
    
    # Run the server forever
    await server.wait_closed()

# Run the server in a separate thread
def start():
    # Create and set an event loop for this thread
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(start_server())

# Start the WebSocket server in the main thread
server_thread = threading.Thread(target=start)
server_thread.start()

# Run terminal input in the main thread to send messages
send_message()
