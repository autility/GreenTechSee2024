'use server'
import axios from 'axios';


export async function checkCaptcha(token: string | null) {
    const res = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${`6LeWVn0nAAAAALTl28gO85QxOqnpNrGwznB4XVo9`}&response=${token}`)
    if (res.data.success) {
        return "success!"
    } else {
        throw new Error("Failed Captcha")
    }
}