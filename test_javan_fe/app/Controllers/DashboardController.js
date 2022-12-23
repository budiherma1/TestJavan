class DashboardController {
  async index(req, res) {
    res.render('template-dashboard', {
      titleHeader: 'Dashboard',
      menu: 'Dashboard',
      titleInsert: 'Dashboard',
      imgPath: 'Dashboard',
      user: req.session.user,
      // fetchUrl: `${process.env.APP_DOMAIN}banks/accounts/fetch`,
      // deleteUrl: `${process.env.APP_DOMAIN}banks/accounts/delete`,
      // addUrl: `${process.env.APP_DOMAIN}banks/accounts/add`,
      // editUrl: `${process.env.APP_DOMAIN}banks/accounts/edit`,
    });
  }
}

export default new DashboardController;
