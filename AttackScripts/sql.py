import os
import requests
from bs4 import BeautifulSoup

def main():
    outputs_dir = r'D:\Amrita 4th Year\Sem_7_Projects\VAPT-WEB\webApp\outputs'
    os.makedirs(outputs_dir, exist_ok=True)
    url = input("Enter the URL of the login page (e.g., http://localhost/webApp/project/login.php): ")
    
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    forms = soup.find_all('form')
    form_data = []
    for form in forms:
        action = form.get('action') if form.get('action') else url  # Default to the current URL
        method = form.get('method').lower()

        # Extract input fields
        inputs = form.find_all('input')
        input_data = {}
        for input_tag in inputs:
            name = input_tag.get('name')
            input_data[name] = ''  # Initialize with empty values
        form_data.append({'action': action, 'method': method, 'inputs': input_data})

    with open(r"D:\Amrita 4th Year\Sem_7_Projects\VAPT-WEB\webApp\SQL_Payloads\auth.txt", 'r') as file:
        payloads = [line.strip() for line in file.readlines()]

    output_file_path = os.path.join(outputs_dir, f"scan_results_{url.split('/')[-1]}.txt")
    with open(output_file_path, 'w') as output_file:
        for form in form_data:
            action = form['action']
            method = form['method']
            response_history = {}
            for email_payload in payloads:
                for password_payload in payloads:
                    data = {
                        'email': email_payload,
                        'password': password_payload,
                        'login': 'Login'  # Include the login button
                    }
                    
                    if method == 'post':
                        response = requests.post(action, data=data)
                    else:
                        response = requests.get(action, params=data)

                    response_text = response.text
                    response_history[response_text] = response_history.get(response_text, 0) + 1
                    if response_text != "Invalid email or password.":
                        result_message = f"Potential SQL injection vulnerability found with payloads '{email_payload}' and '{password_payload}'\n"
                        print(result_message)
                        output_file.write(result_message)

            print("\nResponse Patterns:")
            for res in response_history.keys():
                print(f"Response: {res[:50]}... (Count: {response_history[res]})")
    
    print(f"Testing completed. Results saved to: {output_file_path}")

if __name__ == "__main__":
    main()