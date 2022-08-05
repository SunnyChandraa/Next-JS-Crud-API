import React, {useState} from 'react';
import { unAuthPage } from '../../middlewares/authorizationPage';
import Link from 'next/link';

export async function getServerSideProps(context) {
    await unAuthPage(context);
    return { props: {} }
}

export default function Register() {
    const [ fields, setFields] = useState({
        email: '',
        password: ''
    });

    const [ status, setStatus] = useState('normal');

    async function registerHandler(e) {
        e.preventDefault();
        setStatus('loading')
        const registerReq = await fetch('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(fields),
            headers:{'Content-Type': 'application/json'}
        });
        if(!registerReq.ok) return setStatus('error' + registerReq.status)
        const registerRes = await registerReq.json();
        setStatus('success');
    }

    function fieldHandler(e){
        const name = e.target.getAttribute('name');
        setFields({
            ...fields,
            [name]: e.target.value
        })
    }

    return (
        <div>
            <h1>Register</h1>

            <form onSubmit={registerHandler.bind(this)}>
                <input 
                    onChange={fieldHandler.bind(this)}
                    name="email"
                    type="text" 
                    placeholder="Email"/>                    
                    <br></br>
                <input
                    onChange={fieldHandler.bind(this)} 
                    type="passsword" 
                    name="password"
                    placeholder="Password"/>                   
                    <br></br>
                <button type="submit">daftar</button>
                <div>Output: {status}</div>
                <Link href="/auth/login"><a>Login</a></Link>
            </form>
        </div>    
    );
}