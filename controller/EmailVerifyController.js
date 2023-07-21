const prisma = require("../bin/prisma");
const jwt = require('jsonwebtoken');

class EmailVerifyController{
    static async verifyEmail(req, res){
        try{
            const {token} =  req.params;
            const {email} = jwt.verify(token, 'secretToken');
            const existingUser =  await prisma.user.findUnique({
                where:{
                    email: email
                }
            })
            if(!existingUser){
                return res.status(404).json({
                    status: '400',
                    message: 'User not found.',
                })
            }
            if(existingUser.is_active){
                return res.status(200).json({
                    status: '200',
                    message: 'Account already verified. You can now log in.'
                })
            } else {
                await prisma.user.update({
                    where:{
                        email: email
                    },
                    data:{
                        is_active: true
                    }
                })
                return res.send('Account verified successfully. You can now log in.')
            }
        }catch (error){
            return res.status(500).json(error.message)
        }
    }
}

module.exports = EmailVerifyController;