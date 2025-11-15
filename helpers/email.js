import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
const reff = process.env.E_FRONT;
const domainn = '.com'


const emailRegistro = async (datos) => {
    //console.log(datos);
    const { email, name, token } = datos;

    const subject = `Confirma tu Cuenta en ${domainn}`;
    const text = `Confirma tu Cuenta en ${domainn} ahora:`;
    const html = `
        <p>Hola ${name}, comprueba tu cuenta en ${domainn}</p>
        <p>Tu cuenta ya esta casi lista, solo debes ingresar el siguiente código: ${token}</p>
        <p>Dando click en el siguiente <a href="${reff}/#/auth/confirm-account">enlace</a> </p>
        <p>Este código expira en 5 minutos</p>
        
        <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
    `;
    //Enviar
    const response = await transport.sendMail({
        from: domainn, //quie?
        to: email, //para quien?
        subject, //asunto
        text,
        html
    })

    return response;

};

const emailOlvidePass = async (datos) => {
    //console.log(datos);
    const { email, name, token } = datos;
    const domainn = 'EventStar.com'

    const subject = `Reestablece tu password en ${domainn}`;
    const text = `Reestablece tu password en ${domainn} ahora:`;
    //const reff = process.env.E_BACKEND_URL;
    const reff = process.env.E_FRONT;
    const html = `
        <></>
        <p>Hola ${name}, haz solicitado cambiar tu password en ${domainn}</p>
        <p>Ingresar el siguiente código: ${token}</p>
        <p>Si tu no solicitaste el cambio de contraseña, puedes ignorar el mensaje</p>
    `;
    //Enviar
    await transport.sendMail({
        from: domainn, //quie?
        to: email, //para quien?
        subject, //asunto
        text,
        html
    })


};

const emailCodigoVerificacion = async ({ email, name, code }) => {
    const domainn = 'EventStar.com'


    const subject = `Código de Verificación (2FA)`;
    const text = `Hola ${name}, tu código de verificación es: ${code}`;
    //const reff = process.env.E_BACKEND_URL;
    const html = `
        <p>Hola <strong>${name}</strong>,</p>
        <p>Tu código de verificación es: <strong>${code}</strong></p>
        <p>Este código expirará en 5 minutos.</p>
    `;
    //Enviar
    try {
        await transport.sendMail({
            from: domainn, //quie?
            to: email, //para quien?
            subject, //asunto
            text,
            html
        })
    } catch (error) {
        const emailError = new Error(`Error enviando email: ${error.message}`);
        emailError.isEmailError = true; // Propiedad personalizada
        emailError.originalError = error;
        throw emailError;
    }


};

const emailAlerta = async (datos) => {
    //console.log(datos);
    const { email = 'admin@email.com', name = 'Administrador', productos } = datos;

    let productosHTML = '';

    for (const element of productos) {
        productosHTML = productosHTML + `
            \n
            
            <tr style="background-color: #5887c4ff; color:white;">
                <td>${element.nombre}</td>
                <td>${element.codigo}</td>
                <td>${element.categoria}</td>
                <td>${element.stock_actual}</td>   
            </tr>
            
        `
    }

    const domainn = 'EventStar.com'
    const subject = `Productos apunto de agotarse`;
    const text = `Alerta de productos por debajo del stock mínimo`;
    const html = `
        <p>Hola ${name}.</p>
        <p>Estos productos están por debajo del estock mínimo establecido:</p>
        <table style="text-align:center;">
            <tr style="background-color: #013477ff; color:#FFF; font-size:bold;">
                <th>Nombre</th>
                <th>Código</th>
                <th>Categoría</th>
                <th>Stock actual</th>
            </tr>
            ${productosHTML}
        </table>
    `;
    //Enviar
    const response = await transport.sendMail({
        from: domainn, //quie?
        to: email, //para quien?
        subject, //asunto
        text,
        html
    })

    return response;

};

export {
    emailRegistro,
    emailOlvidePass,
    emailCodigoVerificacion,
    emailAlerta
}