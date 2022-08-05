import cookies from 'next-cookies';

export function unAuthPage(context) {
    return new Promise(resolve => {
        const allCookies = cookies(context);

        if(allCookies.token)
            return context.res.writeHead(302, {
                location: '/posts'
            }).end();

        return resolve('unauthorization');

    });
}

export function authPage(context) {
    return new Promise(resolve => {
        const allCookies = cookies(context);

        if(!allCookies.token)
            return context.res.writeHead(302, {
                location: '/auth/login'
            }).end();

        return resolve({
            token: allCookies.token
        });

    });
}