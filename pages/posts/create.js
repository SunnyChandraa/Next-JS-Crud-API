import React, {useState} from 'react';
import { authPage } from '../../middlewares/authorizationPage';
import Router from 'next/router';
import Nav from '../../components/Nav';

export async function getServerSideProps(context) {
    const { token } = await authPage(context);

    return { 
            props: {
            token
        }
    }
}

export default function PostCreate(props) {
    const [ fields, setFields ] = useState({
        title: '',
        content: ''
    });

    const [ status, setStatus ] = useState('normal')

    async function createHandler(e) {
        e.preventDefault(e);
        setStatus('loading');
        const { token } = props;
        const create = await fetch('/api/posts/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token, 
            },
            body: JSON.stringify(fields)
        });

        if(!create.ok) return setStatus('error');

        const res = await create.json();

        setStatus('success');

        Router.push('/posts');
    }

    // buat nangkep value
    function fieldHandler(e){
        const name = e.target.getAttribute('name');
       setFields({
        // ngambil nilai field saat ini gabungkan engan yang baru kan kalo diinpuut 1 character jadi misah 
        ...fields,
        [name]: e.target.value
       });
    }
    return (
    <div>
            <h1>Create Post</h1>
            <Nav />

            <form onSubmit={createHandler.bind(this)}>
                <input 
                    onChange={fieldHandler.bind(this)}
                    type="text"
                    placeholder="Title"
                    name="title" 
                />
                <br></br>
                <textarea
                    onChange={fieldHandler.bind(this)}
                    type="text"
                    placeholder="Content"
                    name="content" >
                </textarea>
                <br></br>
                <button type="submit">Create Post</button>

                <div>
                    Status: {status}
                </div>
            </form>
        </div>
    );
}