import Users from '../models/Users.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const Register = async (req, res) => {
     try {
          const { username, email, password } = req.body;

          let check = await Users.findOne({ email: email });

          if (check) {
               return res.status(400).json({ success: false, error: "User already exists" });
          }

          let cart = {};
          for (let i = 0; i < 300; i++) {
               cart[i] = 0;
          }

          const hashedpass = await bcrypt.hash(password, 10);

          const user = new Users({
               name: username,
               email: email,
               password: hashedpass,
               cartData: cart,
          });

          await user.save();

          const data = {
               user: {
                    id: user.id
               }
          };

          const token = jwt.sign(data, process.env.JWT_SECRET || 'secret_ecom', { expiresIn: '7d' });

          res.status(200).json({ success: true, token });

     } catch (error) {
          console.error("Register Error:", error);
          res.status(500).json({ success: false, error: "Internal Server Error" });
     }
};

export default Register;