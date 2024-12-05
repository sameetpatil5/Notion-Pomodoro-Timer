# Notion Pomodoro Timer  

[![License: Modified MIT](https://img.shields.io/badge/License-Modified%20MIT-blue.svg)](LICENSE)
[![Status: In Development](https://img.shields.io/badge/Status-In%20Development-orange)](https://github.com/sameetpatil5/notion-pomodoro-timer)

**Notion Pomodoro Timer** is an open-source repository for the development of a minimalist Pomodoro timer, designed to function as a simple Notion widget. Its goal is to provide quick and easy integration of a productivity timer within Notion.  

---

## ✨ Features  

1. **Adjustable Timer Durations**:  
   - Customize focus, short break, and long break times.  

2. **Customizable Design**:  
   - Change background colors, text colors, and fonts for a personalized look.  
  
3. **Configurable Sessions**  
   - Save your custom configurations for one-click session setup.  

4. **Lightweight and Simple**:  
   - Uses only HTML, CSS, and JavaScript for fast loading and minimal resource usage.  

---

## 🚧 Development Status  

This project is currently **under development** and does not represent the final product.  
> **Note**: The expected features and designs are subject to change as the project progresses.  

---

## 🚀 Deployment  

### Deploying the Website  

The widget/ webpage is deployed on **[GitHub Pages](https://sameetpatil5.github.io/notion-pomodoro-timer/)**.  

### Embedding into Notion  

1. Go to your Notion page.  
2. Use the `/embed` command in Notion and paste the GitHub Pages link:  

   ```plaintext
   https://sameetpatil5.github.io/notion-pomodoro-timer/
   ```

### Workflow for Updates  

#### When you make changes in `main` and want to test them  

1. **Merge `main` into `staging` to test:**  

   ```bash
   # Switch to the 'staging' branch
   git checkout staging

   # Merge changes from 'main' into 'staging'
   git merge main

   # Push the updates to the remote repository
   git push
   ```

2. **After testing, merge `staging` into `deploy` to deploy:**  

   ```bash
   # Switch to the 'deploy' branch
   git checkout deploy

   # Merge changes from 'staging' into 'deploy'
   git merge staging

   # Push the updates to the remote repository
   git push
   ```

### Reverting if Something Breaks  

If something breaks in `deploy`, you can revert to the last working state using:  

   ```bash
   git checkout deploy
   git reset --hard <last-working-commit-hash>
   git push --force origin deploy
   ```

---

## 📂 File Structure  

   ```bash
   notion-pomodoro-timer/
   ├── index.html      # Main HTML file for the Pomodoro timer
   ├── styles.css      # CSS file for styling
   ├── script.js       # JavaScript file for functionality
   ├── README.md       # Project documentation and Announcements
   └── LICENSE         # Project License
   ```

---

## 🛡️ License  

This project is licensed under the [MIT License](LICENSE).  

---

## 📢 Contributions  

Contributions are welcome!  

1. Fork this repository.  
2. Create a new branch:  

   ```bash
   git checkout -b feature-branch-name
   ```

3. Make your changes and commit them:  

   ```bash
   git commit -m "Description of changes"
   ```

4. Push your branch:  

   ```bash
   git push origin feature-branch-name
   ```

5. Submit a pull request.  

---

## 💬 Contact  

For questions or feedback, please open an issue in the repository.  

---

_*Thankyou* for visiting this Repository_

---

### PS

Special thanks to **[@Giorgiark](https://github.com/Giorgiark)**, whose GitHub repository [**`Giorgiark/pomodorotimer`**](https://github.com/giorgiark/pomodorotimer/) provided the initial inspiration for this project. While my implementation differs significantly and expands upon the original idea, I built upon the base template and color scheme tailored for Notion Spaces that Giorgiark had already established.  

Although the original repository did not include a license, I want to acknowledge and give full credit to **[@Giorgiark](https://github.com/Giorgiark)** for their foundational work and inspiration for this project.  

---
