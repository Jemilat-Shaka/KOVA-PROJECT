document.addEventListener("DOMContentLoaded", function() {
    var loginForm = document.getElementById("loginForm");
    var usernameInput = document.getElementById("username");
    var passwordInput = document.getElementById("password");
    var togglePasswordIcon = document.getElementById("togglePassword");
    var errorMessage = document.getElementById("errorMessage");

    var userStorageKey = "kovaUsers";

    function getSavedUsers() {
        try {
            var savedUsers = localStorage.getItem(userStorageKey);
            if (!savedUsers) {
                return {};
            }
            return JSON.parse(savedUsers) || {};
        } catch (error) {
            console.log("Could not read saved users");
            return {};
        }
    }

    function saveUsers(users) {
        localStorage.setItem(userStorageKey, JSON.stringify(users));
    }

    function showError(message) {
        if (errorMessage) {
            errorMessage.innerText = message;
            errorMessage.style.display = "block";
        }
    }

    if (togglePasswordIcon) {
        togglePasswordIcon.addEventListener("click", function() {
            var currentType = passwordInput.getAttribute("type");

            if (currentType === "password") {
                passwordInput.setAttribute("type", "text");
                togglePasswordIcon.classList.remove("fa-eye");
                togglePasswordIcon.classList.add("fa-eye-slash");
            } else {
                passwordInput.setAttribute("type", "password");
                togglePasswordIcon.classList.remove("fa-eye-slash");
                togglePasswordIcon.classList.add("fa-eye");
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault();

            var enteredUsername = usernameInput.value.trim();
            var enteredPassword = passwordInput.value.trim();

            if (!enteredUsername || !enteredPassword) {
                showError("Please enter both a username and password.");
                return;
            }

            var savedUsers = getSavedUsers();
            var existingPassword = savedUsers[enteredUsername];

            if (existingPassword === undefined) {
                savedUsers[enteredUsername] = enteredPassword;
                saveUsers(savedUsers);
                console.log("New account created for: " + enteredUsername);
                alert("Account created successfully! Redirecting you to the store...");
                window.location.href = "shop.html";
                return;
            }

            if (existingPassword === enteredPassword) {
                console.log("User signed in successfully");
                alert("Sign in successful! Redirecting you to the KOVA homepage...");
                window.location.href = "shop.html";
                return;
            }

            if (existingPassword !== enteredPassword) {
                savedUsers[enteredUsername] = enteredPassword;
                saveUsers(savedUsers);
                console.log("Password updated for: " + enteredUsername);
                alert("Password updated successfully. Redirecting you to the store...");
                window.location.href = "shop.html";
                return;
            }

            showError("Please try again.");
        });
    }
});
