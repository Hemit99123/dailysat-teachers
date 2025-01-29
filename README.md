# DailySAT Teachers

The teacher panel allows for teachers authorized by our partnered schools to monitor students' progress.

## Demo:
[Click here](https://www.youtube.com/watch?v=B10TLEEfHZA)

## Our authentication system

Authentication works through 2 layers. 

### Whitelist:
The first layer is a whitelist on MongoDB. Our DB admin will add emails that are authorized employees onto this whitelist. Afterwards, in the admin login page you verify your email and once email is verified a OTP is sent.

### OTP:
The second layer is an OTP which is sent to your email. It is only active for 5 minutes and is a one-time use code. You will enter that in the next section of the login and then enter your email once more. Afterwards, you will gain access for **7 days**. After the 7 days (1 week), you will need to do this process all-over again. 

## Technologies Used:
- NextJS
- Upstash Redis (session management)
- Nodemailer w/ Gmail STMP
- TailwindCSS (for styling ofc)
- MongoDB
- Husky
- ESLint

## Maintainers:
- Hemit Patel (COO and Principal Maintainer of DailySAT)
