const signupForm = document.getElementById('signup-form');
const signupButton = document.getElementById('signup-button');

signupButton.addEventListener('click', async (e) => {
  e.preventDefault();

  const username = document.querySelector(".signup-username").value;
  const email = document.querySelector(".signup-email").value;
  const password = document.querySelector(".signup-password").value;

  // Validate all fields
  if (!username || !email || !password) {
    alert("Please fill in all fields");
    return;
  }

  const emailRegex = /^[\w-]+(\.[\w-]+)*@([a-z0-9-]+\.)+[a-z0-9]{2,4}$/

  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address");
    return;
  }

  // Password must be at least 8 characters long
  if (password.length < 8) {
    alert("Password must be at least 8 characters long");
    return;
  }

  // Send request to server
  const response = await fetch("http://localhost:5001/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, email, password })
  })

  if (response.ok) {
    alert("User signed up successfully");
  } else {
    alert("Error signing up");
  }
})
