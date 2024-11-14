
import socket

client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_address = ('localhost', 65432)  
client_socket.connect(server_address)

try:
    player_message = client_socket.recv(1024).decode()
    print(player_message)

    while True:
        message = client_socket.recv(1024).decode() 
        print(message)
        
        if "Your move" in message:
            move = input("Enter your move (0-8): ")  
            client_socket.sendall(move.encode())  
        if "Game Over" in message or "Invalid move" in message:
            break

finally:
    client_socket.close()
