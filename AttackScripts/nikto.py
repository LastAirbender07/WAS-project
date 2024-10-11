import os
import subprocess
import time

def run_nikto(url, max_duration=180):
    try:
        nikto_path = os.path.join('D:\\Amrita 4th Year\\Sem_7_Projects\\VAPT-WEB\\webApp\\nikto', 'program', 'nikto.pl')
        outputs_dir = r'D:\Amrita 4th Year\Sem_7_Projects\VAPT-WEB\webApp\outputs'
        output_file = os.path.join(outputs_dir, 'NiktoOutput.txt')
        
        cmd = [
            'perl', nikto_path, 
            '-h', url,              # Target host
            '-timeout', '120',       # Timeout for requests
            '-Tuning', '1,2,3',     # Adjust tuning options as needed
            '-output', output_file,  # Save output to the specified directory
            '-nointeractive',       # Disable interactive features
            '-followredirects'      # Follow redirects
        ]

        print(f"Running Nikto with command: {' '.join(cmd)}")

        start_time = time.time()
        process = subprocess.Popen(cmd, stderr=subprocess.STDOUT, stdout=subprocess.PIPE, universal_newlines=True)

        output = ''
        while process.poll() is None:
            elapsed_time = time.time() - start_time
            if elapsed_time >= max_duration:
                process.terminate()
                print(f"Scan terminated after {max_duration} seconds.")
                break

            line = process.stdout.readline()
            if line:
                output += line
                print(line.strip())

        remaining_output = process.communicate()[0]
        output += remaining_output
        print(remaining_output)

        return output

    except subprocess.CalledProcessError as e:
        print(f"Error running Nikto: {e.output}")
        return 'Nikto scan failed'

# Main execution
if __name__ == "__main__":
    url = input("Enter the target URL (including http:// or https://): ")
    run_nikto(url)
