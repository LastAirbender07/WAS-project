
# Vulnerable Web Application, Secure React.js Application, and Secure Android Application (ZeroSMS)

## Overview

This repository contains three applications:

1. **Vulnerable Web Application** designed to demonstrate various web vulnerabilities.
2. **Secure React.js Application** implementing security best practices to mitigate those vulnerabilities.
3. **ZeroSMS Android Application**, a secure Android app focused on enhancing app security through various techniques such as code obfuscation and security hardening.

---

## Table of Contents

- [Vulnerable Web Application, Secure React.js Application, and Secure Android Application (ZeroSMS)](#vulnerable-web-application-secure-reactjs-application-and-secure-android-application-zerosms)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Vulnerable Web Application](#vulnerable-web-application)
    - [Vulnerabilities](#vulnerabilities)
    - [Screenshots](#screenshots)
  - [Secure React.js Application](#secure-reactjs-application)
    - [Security Features](#security-features)
  - [ZeroSMS Android Application](#zerosms-android-application)
    - [Android Security Features](#android-security-features)
    - [Security Testing and Results](#security-testing-and-results)

---

## Vulnerable Web Application

### Vulnerabilities

The following vulnerabilities are implemented in the vulnerable web application:

1. **SQL Injection**  
   A technique where an attacker can execute arbitrary SQL code on the database, potentially allowing unauthorized access to sensitive data.

2. **Session ID Retrieval**  
   Exposes session IDs through various means, allowing attackers to hijack user sessions.

3. **MD5 Cracking**  
   Demonstrates the weakness of MD5 hashing and how it can be cracked to reveal sensitive information.

4. **Cross-Site Scripting (XSS)**  
   Allows attackers to inject malicious scripts into webpages viewed by other users, leading to data theft or account compromise.

5. **Cross-Origin Resource Sharing (CORS)**  
   Misconfigured CORS policies can allow unauthorized domains to access resources.

6. **Cross-Site Request Forgery (CSRF)**  
   Tricks the user into executing unwanted actions on a different website where they are authenticated.

7. **Keylogger**  
   Captures keystrokes from users, potentially revealing sensitive information such as passwords.

---

### Screenshots

Here are some screenshots demonstrating each vulnerability:

- **SQL Injection**  
![SQL Injection Screenshot 1](outputs/images/SQLInj-vul.png)  
![SQL Injection Screenshot 2](outputs/images/SQLInj-sec.png)

- **Session ID Retrieval**  
![Session ID Retrieval Screenshot 1](outputs/images/sessionID-vul.png)  
![Session ID Retrieval Screenshot 2](outputs/images/sessionID-sec.png)

- **MD5 Cracking**  
![MD5 Cracking Screenshot 1](outputs/images/decryptedMD5.png)  

- **Cross-Site Scripting (XSS)**  
![XSS Screenshot 1](outputs/images/XSS-vul.png)  
![XSS Screenshot 2](outputs/images/XSS-sec.png)

- **Cross-Origin Resource Sharing (CORS)**  
![CORS Screenshot 1](outputs/images/CORS-vul.png)  
![CORS Screenshot 2](outputs/images/CORS-sec.png)

- **Cross-Site Request Forgery (CSRF)**  
![CSRF Screenshot 1](outputs/images/CSRF-vul.png)
![CSRF Screenshot 2](outputs/images/CSRF-sec.png)

- **Keylogger**  
![Keylogger Screenshot 1](outputs/images/keylogger-vul1.png)  
![Keylogger Screenshot 2](outputs/images/keylogger-vul2.png)
![Keylogger Screenshot 3](outputs/images/keylogger-sec.png)

---

## Secure React.js Application

The Secure React.js application showcases security best practices and mitigations against the vulnerabilities listed above.

### Security Features

- **Prepared Statements**: Protects against SQL Injection by using prepared statements for database queries.
- **Secure Session Management**: Properly manages session IDs and uses secure cookies to protect user sessions.
- **Strong Hashing Algorithms**: Implements stronger hashing algorithms (e.g., bcrypt) instead of MD5.
- **Input Validation and Sanitization**: Prevents XSS by validating and sanitizing user inputs.
- **CORS Configuration**: Properly configures CORS policies to limit access to trusted domains.
- **CSRF Tokens**: Implements CSRF tokens to protect against CSRF attacks.
- **Keystroke Capture Prevention**: Uses security measures to prevent keylogging.

---

## ZeroSMS Android Application

The **ZeroSMS** application is a secure Android app designed to demonstrate modern security practices in mobile app development. It focuses on enhancing app security by using various hardening techniques and security features.

### Android Security Features

- **JailMonkey for Security Enhancements**:  
  - Detects if the device is rooted or compromised and takes appropriate actions to secure the app environment.
  
- **Code Obfuscation using R8 and ProGuard**:  
  - Protects Java code by obfuscating classes, methods, and other sensitive elements, making reverse engineering difficult.

- **Code Obfuscation in React Native using obfuscator-io-metro-plugin**:  
  - Obfuscates the JavaScript code used in React Native, further enhancing security by making it harder for attackers to analyze the codebase.

### Security Testing and Results

To verify the effectiveness of the security measures in **ZeroSMS**, the following tools were used for comparison between regular APKs and the **ZeroSMS** APK:

1. **APKTool and dex2jar**  
   - Decompilers were used to analyze the structure of the APK files. The obfuscation techniques in **ZeroSMS** significantly improved resistance to reverse engineering compared to standard APKs.

2. **MobSF (Mobile Security Framework)**  
   - A comprehensive mobile security testing tool used to scan the APK files. The analysis showed improved security, especially in terms of code complexity and reduced exposure of sensitive components in **ZeroSMS**.

3. **Drozer**  
   - Security testing for potential vulnerabilities such as insecure content providers, weak broadcast receivers, and permissions misconfigurations. **ZeroSMS** demonstrated improved resistance to Drozer-based attacks compared to regular APKs.

- **Decompilers**  
![AppVul-1](outputs/images/App-vul.png)
![AppVul-2](outputs/images/App-vul2.png)
![AppVul-3](outputs/images/App-vul3.png)
- Obfuscated APKs
![AppSec-1](outputs/images/App-sec1.png)
![AppSec-2](outputs/images/App-sec2.png)

- **MobSF Scans**  
![MobSF-Vul-1](outputs/images/MobSF-vul-1.png)
![MobSF-Vul-2](outputs/images/MobSF-vul-2.png)

- Below are the screenshots of the MobSF assessment of the ZeroSMS APK:
- The scorecard shows 'B' as the overall security rating, which is a significant improvement over the standard APKs. The main areas of improvement include code complexity, sensitive components, and security hardening.
![MobSF-Sec-1](outputs/images/Mobsf-Assesment-1.png)
![MobSF-Sec-2](outputs/images/Mobsf-Assesment-2.png)
![MobSF-Sec-3](outputs/images/Mobsf-Assesment-3.png)
![MobSF-Sec-4](outputs/images/Mobsf-Assesment-4.png)

- **Drozer - debugging**  
![Drozer-1](outputs/images/Drozer-Debugger.png)
![Drozer-2](outputs/images/Drozer-App-Warning.png)

---