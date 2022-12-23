import { Crud } from '@averoa/utilities';
import bcrypt from 'bcrypt';
import { CommonHelper } from '@averoa/helpers';
import { Users } from '@averoa/models';
import jwt from 'jsonwebtoken';

class AuthController {
  async register(req, res) {
    const salt = await bcrypt.genSalt(10);
    const username = CommonHelper.alphaNumeric();
    const hashedPassword = await bcrypt.hash(`${req.body.password}`, salt);
    const password = hashedPassword;
    const data = await Crud.create('Users', req, { insert: { salt, password, username } });
    res.send(data);
  }

  async test(req, res) {
    res.send({ status: 33333 });
  }

  async login(req, res) {
    const { email } = req.body;
    const { password } = req.body;
    const user = await Users.query().findOne({ email: req.body.email });

    if (user) {
      const match = await bcrypt.compare(`${password}`, user.password);
      if (match) {
        const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1m' });
        const refresh_token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '3d' });

        await Crud.update('Users', { body: { refresh_token } });

        return res.send({ status: true, message: 'Login success', data: { user, token, refresh_token } });
      }

      return res.send({
        status: false, message: `password for '${email}' is wrong`,
      });
    }
    return res.send({
      status: false, message: `email '${email}' doesn't exist`,
    });
  }

  async refresh(req, res) {
    const { refresh_token } = req.body;
    const user = await Users.query().findOne({ refresh_token });
    const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET);
    console.log(user);
    console.log(decoded);
    // return 1111;

    if (user) {
      const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1m' });
      const refresh_token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '3d' });

      console.log(1111111);
      await Crud.update('Users', req);

      return res.send({ status: true, message: 'Login success', data: { user, token, refresh_token } });
    }
    return res.send({
      status: false, message: `refresh_token '${refresh_token}' doesn't exist`,
    });
  }
}

export default new AuthController;
