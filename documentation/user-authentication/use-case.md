# Google Authentication

> ## Primary Flow
1. Get user data(name, email and Google ID) from Google oAuth API
2. Verify if user exists through received email
3. Create a account to user with data received from Google
4. Create a access token based in user ID (token expires in 30min)
5. Return the access token.

># Alternative Flow: User already exists
3. Update user account with received data from Google (Google ID and name - just update name if this user account there isn´t a name)

># Exception Flow: Invalid or expired token
1. Return a Auth error.
