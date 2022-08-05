import { authPage } from '../../middlewares/authorizationPage';
import {useState} from 'react';
import Router from 'next/router';
import Nav from '../../components/Nav';

export async function getServerSideProps(context) {
    const { token } = await authPage(context);

    const postReq = await fetch('http://localhost:3000/api/posts', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    const posts = await postReq.json();

    return {
        props: {
            token,
            posts: posts.data
        } 
    }
}


export default function postIndex(props) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [posts, setposts] = useState(props.posts);
    
    async function deleteHandler(id, e) {
        e.preventDefault();
        const { token } = props;

        const ask = confirm('Apakah anda yakin untuk menghapus data ini ?')

        if(ask) {
            const deletePost = await fetch('api/posts/delete/' +
                id, 
                    {
                        method: 'DELETE',
                        headers: {
                            'Authorization': 'Bearer ' + token
                        }
                    }
            );
            //filtering data state
       
            const postsFiltered = posts.filter(post => {
                return post.id !== id && post;
            });
            setposts(postsFiltered);
        }
    }
    function editHandler(id) {
        Router.push('/posts/edit/' + id)
    }
    return (
        <div>
            <h1>Halaman Posts</h1>
            <Nav />

            { posts.map(post => (
               
                    <div key={post.id}> 
                        <h3> { post.title } </h3>
                        <p> {post.content} </p>

                        <div>
                            <button onClick={editHandler.bind(this, post.id)}>Edit</button>
                            <button onClick={deleteHandler.bind(this, post.id)}>Delete</button>
                        </div>

                        <hr />
                    </div>
                
            ))}
        </div>
    );
}