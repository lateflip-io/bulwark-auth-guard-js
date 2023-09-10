
export async function createAccount(email: string, password: string){
    const response = await fetch('http://localhost:3000/account', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password}),
    });
    const data = await response.json();
    return data;
}
