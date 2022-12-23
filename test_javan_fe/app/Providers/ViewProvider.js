class ViewProvider {
  /**
   * [Global variable for view]
   *
   * @return  {[object]}  [object of global variable used in view]
   */
  global() {
    return {
      bucketUrl: (url = '') => process.env.BUCKET_URL + url,
      uploadUrl: process.env.UPLOAD_URL,
      apiUrl: (url) => process.env.API_URL + url,
      baseUrl: (url) => process.env.APP_DOMAIN + url,
      testVariable: 'this is global variable',
      sayHello: (value = '') => `Hai ${value}, Greeting from ViewProvider`,
      menu: [
        {
          url: '/',
          text: 'Home',
        },
        {
          url: '/about',
          text: 'About',
        },
        {
          url: '/contact',
          text: 'Contact',
        }],
    };
  }
}

export default new ViewProvider;
