import { Fetch } from '@averoa/utilities';

class AuthController {
  async register(req, res) {
    res.render('register');
  }

  async fetchRegister(req, res) {
    const { email, password } = req.body;
    console.log(req.body);
    const { data } = await Fetch(
      'register/',
      {
        method: 'post',
        data: { email, password },
      },
    );
    console.log(data);
    res.send(data);
  }

  async login(req, res) {
    res.render('login');
  }

  async logout(req, res) {
    delete req.session.token;
    res.redirect('/login');
  }

  async fetchLogin(req, res) {
    const { email, password } = req.body;
    const { data } = await Fetch(
      'login/',
      {
        method: 'post',
        data: { email, password },
      },
    );
    console.log(data);
    if (data.status) {
      const { session } = req;
      session.token = data.data.token;
      session.user = data.data.user;
    }

    res.send(data);
  }
}

export default new AuthController;
