<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTTF-8">
        <meta name="viewport"content="width=device-width,initial scale=1.0">
        <title>Community Fridge-Home</title>
        <link rel="stylesheet"href="stules.css">
        </head>
        <body>
            <header>
                <h1>Community Fridge</h1>
                <nav>
                    <a href="index.html">Home</a>
                    <a href="about.html">About Us</a>
                    <a href="contct.html">Contact Us</a>
                    <a href="manage.html">Manage a Fridge</a>
                </nav> 
            <button class="login-btn"id="loginBtn">Login</button>
                 </header>
                 <main>
                    <section class="intro">
                        <h2>Welcome to The Community Fridge</h2>
                        <p>Our Community Fridge is a free resource for people in need of food.Whether you are looking to donate, recive food, voluntering, or suggestion how to improve our service, This is your place to help and recive help.</p>
                    <div class="cta-buttons">
                        <button onclick="navigateTo('donate.html')">Donate Food</button>
                    <button onclick="navigateTo('recive.html')">Looking for Food</button>
                <button onclick="navigateTo('volunteer.html')">Become a Volunteer</button>
                <button onclick="navigateTo('manage.html')">Manage a Fridge</button>
            </div>
            </section>
            </main>
        <footer>
            <p>&copy;2025 Community Fridge. All rights reserved.</p>
        </footer>
        <script>
            function navigateTo(page){window.location.href=page}
            document.getElementByld('loginBtn').addEventListener('click',function(){navigateTo('login.html');});
            function goToHome(){navigateTo('about.html');}   
            function goToContact(){navigateTo('contact.html');}
            function goToManage(){navigateTo('manage.html');}
                </script>
                </body>
                </html>
    