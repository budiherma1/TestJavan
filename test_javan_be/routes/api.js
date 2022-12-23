import Router from '@averoa/routes';

const router = Router();

router.post('/upload', 'UploadController@upload', ['UploadFilesMiddleware']);
router.post('/login', 'AuthController@login');
router.post('/refresh', 'AuthController@refresh');
router.post('/register', 'AuthController@register');

router.crud('FamilyMembers', 'family-members', () => {
  router.get('/', 'FamilyMembersController@findAll');
  router.get('/:id', 'FamilyMembersController@findOne');
  router.post('/', 'FamilyMembersController@create');
  router.put('/:id', 'FamilyMembersController@update');
  router.delete('/:id', 'FamilyMembersController@delete');
});

router.crud('FamilyAssets', 'family-assets', () => {
  router.get('/', 'FamilyAssetsController@findAll');
  router.get('/:id', 'FamilyAssetsController@findOne');
  router.post('/', 'FamilyAssetsController@create');
  router.put('/:id', 'FamilyAssetsController@update');
  router.delete('/:id', 'FamilyAssetsController@delete');
});

router.crud('Users', 'users', () => {
  router.get('/', 'UsersController@findAll');
  router.get('/:id', 'UsersController@findOne');
  router.post('/', 'UsersController@create');
  router.put('/:id', 'UsersController@update');
  router.delete('/:id', 'UsersController@delete');
});

export default router.router;
