const API_URL = 'http://localhost:3000/api';

async function testApi() {
    console.log('Registering user...');
    const regRes = await fetch(`${API_URL}/auth/password/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test_user@example.com', password: 'password123' })
    });
    const regData = await regRes.json();
    console.log('Register:', regData);

    const token = regData.token || (regData.data && regData.data.token);
    if (!token) {
        if (regData.error && regData.error.includes('UNIQUE')) {
            console.log('User already exists, trying login...');
            const loginRes = await fetch(`${API_URL}/auth/password/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'test_user@example.com', password: 'password123' })
            });
            const loginData = await loginRes.json();
            console.log('Login:', loginData);
            var jwt = loginData.token || (loginData.data && loginData.data.token);
        } else {
            console.error('Failed to get token');
            return;
        }
    } else {
        var jwt = token;
    }

    console.log('Got token:', jwt);

    console.log('\nCreating Todo...');
    const createRes = await fetch(`${API_URL}/data/entity/todos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify({ title: 'Test Todo via API', completed: false })
    });
    console.log('Create Todo Response Code:', createRes.status);
    const text = await createRes.text();
    console.log('Create Todo Raw Text:', text);
}

testApi().catch(console.error);
