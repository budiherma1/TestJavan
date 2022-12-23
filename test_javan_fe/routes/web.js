import Router from '@averoa/routes';

const router = Router();
// for another sample, Please check : https://www.npmjs.com/package/@averoa/ave-route
router.get('/register', 'AuthController@register');
router.post('/fetch-register', 'AuthController@fetchRegister');
router.get('/login', 'AuthController@login');
router.get('/logout', 'AuthController@logout');
router.post('/fetch-login', 'AuthController@fetchLogin');

router.middleware(['SessionJwtValidationMiddleware'], () => {
  router.get('/', 'DashboardController@index');
  router.prefix('family-members', () => {
    router.get('/', 'FamilyMembersController@index');
    router.post('fetch', 'FamilyMembersController@fetch');
    router.get('fetch/:id', 'FamilyMembersController@fetchOne');
    router.post('delete', 'FamilyMembersController@delete');
    router.post('add', 'FamilyMembersController@add');
    router.post('edit/:id', 'FamilyMembersController@edit');
  });

  router.prefix('family-assets', () => {
    router.get('/', 'FamilyAssetsController@index');
    router.post('fetch', 'FamilyAssetsController@fetch');
    router.get('fetch/:id', 'FamilyAssetsController@fetchOne');
    router.post('delete', 'FamilyAssetsController@delete');
    router.post('add', 'FamilyAssetsController@add');
    router.post('edit/:id', 'FamilyAssetsController@edit');
  });
});

export default router.router;
