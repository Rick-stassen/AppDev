# **Hoe gaat het met mij? (HGHMM)**  

Een app waarmee je kunt reflecteren op je mentale gezondheid. Deze is ontwikkeld met **React Native** (voor de app) en **FastAPI** (voor de server).  

---

## **Wat zit er in dit project?**  

- 📱 **/frontend**: De app die je gebruikt (React Native).  
- 🖥️ **/backend**: Het systeem dat de data verwerkt (FastAPI).  

---

## **Hoe installeer je alles?**  

### **1. De backend (de server):**  
De backend is het gedeelte dat data opslaat en verwerkt.  

#### **Stap 1: Python installeren**  
![Python Website](./instructions/assets/image1.png)  
- Ga naar [de officiële Python-website](https://www.python.org/downloads/) en download [Python 3.11.7](https://www.python.org/downloads/release/python-3117/).  
- De installer configureert alles automatisch.
- Na de installatie opent een file browser, open het bestand `Install Certificates.command` om SSL-certificaten goed te installeren.

- **Test of Python werkt**:  
  - Open je terminal (Command Prompt of Terminal).  
  - Typ:  
    ```bash
    python3 --version
    ```  
  - Je zou een versie zoals `Python 3.11.*` moeten zien.
    
![Console Preview](./instructions/assets/image-mac.png)  

#### **Stap 2: Project downloaden**  

- **Met GitHub Desktop**:  
  1. Download en installeer [GitHub Desktop](https://desktop.github.com/).  
  <img src="./instructions/assets/image7-mac.png" alt="GitHub Desktop git config" width="320"/>
  2. Klik op **Clone a Repository** en vul deze URL in:  
     ```
     https://github.com/Vista-ICT-opleidingen-studenten/hoegaathetmetmij/
     ```  
  <div align="center">
    <img src="./instructions/assets/image5-mac.png" alt="Github Desktop 1" width="320"/>
    <img src="./instructions/assets/image6-mac.png" alt="Github Desktop 2" width="320"/>
  </div>

  ### ⚠️ **LET OP: Inloggen vereist!**  

  Je moet eerst ingelogd zijn op je GitHub-account voordat je een repository kunt clonen.  

  <div align="center">
    <img src="./instructions/assets/image7.png" alt="GitHub Desktop inloggen" width="320"/>
    <img src="./instructions/assets/image8-mac.png" alt="GitHub Desktop git config" width="320"/>
  </div>  

- **Met Git (terminal)**:  
  1. Open je terminal en typ:  
     ```bash
     git clone https://github.com/Vista-ICT-opleidingen-studenten/hoegaathetmetmij/
     ```  
  2. Navigeer naar de backend-map:  
     ```bash
     cd ./backend
     ```  

> **Tip:** Open de projectmap in Finder, en als je in de folder zit, kun je met `control + klik` > **Nieuwe Terminal bij Map** openen om meteen in de juiste map te zitten.

#### **Stap 3: Backend installeren en draaien**  
1. Typ in je terminal:  
   ```bash
   python3 setup.py
   ```  
2. Maak een `.env` bestand en voeg je database-URL toe, bijvoorbeeld:  
   ```env
   DATABASE_URL=mysql+pymysql://gebruikersnaam:wachtwoord@host:poort/database_naam
   ```  
3. Start de backend met:  
   ```bash
   python3 app.py
   ```  

---

### **2. De frontend (de app):**  
De frontend is de app die je op je telefoon ziet en gebruikt.  

#### **Stap 1: Node.js installeren**  
- Ga naar [Node.js](https://nodejs.org/) en download de **LTS-versie**.  
- Installeer ook **Expo CLI** als je deze nog niet hebt:  
  ```bash
  npm install -g expo-cli
  ```

#### **Stap 2: Frontend installeren en draaien**  
1. Navigeer naar de frontend-map:  
   ```bash
   cd ./frontend
   ```  
2. Installeer de dependencies:  
   ```bash
   npm install
   ```  
3. Start de app:  
   ```bash
   npx expo start
   ```  
4. Scan de QR-code met de **Expo Go**-app om de app te testen op je telefoon.  

---

## **Werken met backend en frontend samen**  
Om zowel de backend als de frontend tegelijk te draaien:  

1. **Open de backend** in een terminalvenster:  
   ```bash
   cd ./backend
   python3 app.py
   ```  
2. **Open de frontend** in een ander terminalvenster:  
   ```bash
   cd ./frontend
   npx expo start
   ```  

---

## **Hoe werkt de database?**  

De database beheert gegevens zoals gebruikers en hun antwoorden.  

### **Tabellen**:  
1. **Gebruikers**:  
   - ID: Uniek nummer.  
   - Naam: Gebruikersnaam.  
   - Aanmaakdatum: Datum van registratie.  

2. **Antwoorden**:  
   - ID: Uniek nummer.  
   - Gebruikers-ID: Link naar gebruiker.  
   - Antwoorden: Opgeslagen in JSON-formaat.  
   - Aanmaakdatum: Datum van opslag.  

---

## **Hoe kun je meewerken?**  
1. Maak een kopie (fork) van het project.  
2. Maak een nieuwe branch voor jouw idee.  
3. Voeg wijzigingen toe en commit deze.  
4. Stuur een Pull Request in voor review.  

---

## **Licentie**  
Dit project is **vertrouwelijk**. Gebruik het alleen met toestemming.
