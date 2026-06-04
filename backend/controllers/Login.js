
import Users from '../models/Users.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const Login = async (req, res) => {

     try {
     
          // Changed 'let' to 'const'
          const { email, password } = req.body;

          const user = await Users.findOne({ email: email });

          // Early return if user is not found (Cleaner code structure)
          if (!user) {
               return res.status(401).json({ success: false, error: 'Wrong Email Address' });
          }

          const passcompare = await bcrypt.compare(password, user.password);

          if (!passcompare) {
               return res.status(401).json({ success: false, error: 'Wrong password!' });
          }

          // If everything is correct, generate token
          const data = {
               user: {
                    id: user.id
               }
          };

          // Use Environment Variable for Secret Key (Fall back to 'secret_ecom' for dev only)
          const token = jwt.sign(data, process.env.JWT_SECRET || 'secret_ecom');

          return res.status(200).json({ success: true, token });

     } catch (error) {
          // Prevents server crash and logs the exact error
          console.error("Login Error:", error);
          return res.status(500).json({ success: false, error: 'Internal Server Error' });
     }
};

export default Login;