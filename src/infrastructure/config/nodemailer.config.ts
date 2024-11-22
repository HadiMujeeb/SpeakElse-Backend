import nodemailer from 'nodemailer';

 const createTransporter = () => {
    const trasporter = nodemailer.createTransport({
        host:"gmail",
        port:587,
        secure:false,
        auth: {
            user:process.env.EMAIL_USER,
            pass:process.env.PASS,
        },
    });

    trasporter.verify((error,success)=>{
        if (error) {
            console.error('Nodemailer configuration error:', error);
        } else {
            console.log('Nodemailer is ready to send emails');
        }
    });

    return trasporter;

}

export default createTransporter