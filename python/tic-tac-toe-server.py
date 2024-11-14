
import socket
import threading


board = [' ' for _ in range(9)]
current_player = 'X'
game_over = False

wins = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],  
    [0, 3, 6], [1, 4, 7], [2, 5, 8],  
    [0, 4, 8], [2, 4, 6]             
]


server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_address = ('localhost', 65432) 
server_socket.bind(server_address)
server_socket.listen(2)  

clients = []

def check_win():
    global game_over
    for win in wins:
        if board[win[0]] == board[win[1]] == board[win[2]] != ' ':
            game_over = True
            return board[win[0]]  
    if ' ' not in board:
        game_over = True
        return 'Draw'
    return None

def handle_client(client_socket, player):
    global current_player
    client_socket.sendall(f"You are player {player}".encode())
    
    while not game_over:
        client_socket.sendall(f"Your move, {player}. Board: {board}".encode())
        move = int(client_socket.recv(1024).decode()) 
        
        if board[move] == ' ' and current_player == player:
            board[move] = player
            winner = check_win()
            current_player = 'O' if current_player == 'X' else 'X' 
            
            if winner:
                broadcast(f"Game Over! Winner: {winner}. Final Board: {board}")
                break
            else:
                broadcast(f"Board updated: {board}")
        else:
            client_socket.sendall("Invalid move. Try again.".encode())

    client_socket.close()

def broadcast(message):
    for client in clients:
        client.sendall(message.encode())

def start_server():
    print("Server started. Waiting for players to connect...")
    
    for i in range(2): 
        client_socket, client_address = server_socket.accept()
        clients.append(client_socket)
        player = 'X' if i == 0 else 'O'
        threading.Thread(target=handle_client, args=(client_socket, player)).start()

if __name__ == '__main__':
    start_server()
