import { Fetch } from '@averoa/utilities';
import axios from 'axios';

class FamilyMembersController {
  async index(req, res) {
    const genderMember = [{ name: 'Male', value: 1 }, { name: 'Female', value: 2 }];
    const selectTagify = [];

    const parentLists = (await Fetch('family-members', {
      params: {
        limit: 0,
        orderBy: 'name',
      },
    })).data.data;

    const filterParentList = [];
    for (const parentList of parentLists) {
      filterParentList.push({ name: parentList.name, value: parentList.id });
    }
    let dataProducts = [];
    const { data } = await axios.get('https://dummyjson.com/products?limit=200&select=id,title,price');
    if (data?.products) {
      dataProducts = data.products.map((v, i) => {
        // eslint-disable-next-line prefer-template
        selectTagify.push('`' + v.title + '`');
        return { name: v.title, value: v.title, price: v.price };
      });
    }

    const columns = [
      {
        name: 'ID',
        value: 'id',
      },
      {
        name: 'Name',
        value: 'name',
        filter: { name: 'family_members.name:ilike', component: 'components/table/filter/text' },
        insert: { required: true, name: 'name', component: 'components/table/insert/text' },
        edit: { required: true, name: 'name', component: 'components/table/edit/text' },
      },
      {
        name: 'Gender',
        value: 'gender',
        filter: { name: 'family_members.gender', component: 'components/table/filter/select', options: genderMember },
        insert: {
          required: true, name: 'gender', component: 'components/table/insert/select', options: genderMember,
        },
        edit: {
          required: true, name: 'gender', component: 'components/table/edit/select', options: genderMember,
        },
      },
      {
        name: 'Parent',
        value: 'parent.name',
        filter: { name: 'family_members.parent_id', component: 'components/table/filter/select', options: filterParentList },
        insert: {
          required: true, name: 'parent_id', component: 'components/table/insert/select', options: filterParentList,
        },
        edit: {
          required: true, name: 'parent_id', component: 'components/table/edit/select', options: filterParentList,
        },
      },
      {
        name: 'Asset',
        value: 'family_assets.asset_name',
        // filter: { name: 'family_assets.asset_name', component: 'components/table/filter/select', options: dataProducts },
        insert: {
          required: true, className: 'family_assets', name: 'family_assets.asset_name', component: 'components/table/insert/select-tagify', options: dataProducts,
        },
        edit: {
          required: true, className: 'family_assets', name: 'family_assets.asset_name', component: 'components/table/edit/select-tagify', options: dataProducts,
        },
      },
      {
        name: 'Asset Price',
        value: 'family_assets.price',
      },
    ];

    const datePickerData = [];
    const ckEditorData = [];
    const isTagify = true;

    res.render('template', {
      titleHeader: 'Family Members',
      menu: 'Family Members',
      titleInsert: 'Family Member',
      imgPath: 'family-members',
      columns,
      datePickerData,
      ckEditorData,
      selectTagify,
      isTagify,
      tagifyName: 'family_assets.asset_name',
      ckEditor: true,
      user: req.session.user,
      fetchUrl: `${process.env.APP_DOMAIN}family-members/fetch`,
      deleteUrl: `${process.env.APP_DOMAIN}family-members/delete`,
      addUrl: `${process.env.APP_DOMAIN}family-members/add`,
      editUrl: `${process.env.APP_DOMAIN}family-members/edit`,
    });
  }

  async fetch(req, res) {
    const filter = req.body.filter ?? {};
    const searchAll = req.body.searchAll ? { 'family_members.gender|parent.name|family_members.name:ilike': `%${req.body.searchAll}%` } : {};

    let order = {};
    if (req.body.order) {
      const setOrder = ['gender', 'name'].includes(req.body.order[0].column) ? `family_members.${req.body.order[0].column}` : req.body.order[0].column;
      order = { [req.body.order[0].dir == 'asc' ? 'orderBy' : 'orderByDesc']: setOrder };
    }
    const { start, length } = req.body;
    const { data } = await Fetch('family-members', {
      params: {
        $relations: '[parent,family_assets]',
        'family_members.deleted_at:isNull': true,
        limit: length,
        page: start == 0 ? 1 : (start / length) + 1,
        ...filter,
        ...searchAll,
        ...order,
      },
    });

    const result = {};
    result.draw = req.body.draw;
    result.recordsTotal = data.metadata?.item_total ?? 0;
    result.recordsFiltered = data.metadata?.item_total ?? 0;
    if (data?.data) {
      result.data = await Promise.all(data.data.map(async (v, i) => {
        if (v.gender == 1) {
          v.gender = 'Male';
        } else if (v.gender == 2) {
          v.gender = 'Female';
        } else {
          v.gender += ' - Undefined';
        }

        let assets = '-';
        let assetPrice = 0;
        if (v.family_assets.length > 0) {
          assets = [];
          for (const asset of v.family_assets) {
            if (!asset.deleted_at) {
              const fetchExternal = await axios.get(`https://dummyjson.com/products/search?q=${asset.asset_name}&limit=1`);
              assetPrice = fetchExternal?.data?.products[0]?.price ?? 0;
              assets.push(asset.asset_name);
            }
          }
        }
        v.family_assets = { asset_name: assets, price: assetPrice };
        if (!v.parent?.name) {
          v = { ...v, parent: { name: '-' } };
        }
        return v;
      }));
    } else {
      result.data = [];
    }
    res.send(result);
  }

  async fetchOne(req, res) {
    const { data } = await Fetch(
      `family-members/${req.params.id}`,
      {
        method: 'get',
      },
    );
    const assetPure = [];
    await Promise.all(data.data.family_assets.map(async (v, i) => {
      if (!v.deleted_at) {
        assetPure.push(v.asset_name);
      }
    }));
    data.data.family_assets = { asset_name: assetPure };
    res.send(data);
  }

  async delete(req, res) {
    const { data } = await Fetch(
      `family-members/${req.body.id}`,
      {
        method: 'delete',
      },
    );
    res.send(data);
  }

  async add(req, res) {
    const { data } = await Fetch(
      'family-members',
      {
        method: 'post',
        data: req.body,
      },
    );

    if (req.body['family_assets.asset_name']) {
      for (const product of req.body['family_assets.asset_name']) {
        const { dataProduct } = await Fetch(
          'family-assets',
          {
            method: 'post',
            data: {
              family_member_id: data.data.id,
              asset_name: product,
            },
          },
        );
      }
    }
    res.send(data);
  }

  async edit(req, res) {
    const { data } = await Fetch(
      `family-members/${req.params.id}`,
      {
        method: 'put',
        data: req.body,
      },
    );

    if (req.body['family_assets.asset_name']) {
      const dataBefore = await Fetch('family-assets', {
        params: {
          'family_members.deleted_at:isNull': true,
          limit: 0,
          'family_member_id:eq': req.params.id,
        },
      });

      for (const d of dataBefore.data.data) {
        const ddd = await Fetch(
          `family-assets/${d.id}`,
          {
            method: 'delete',
          },
        );
      }

      for (const product of req.body['family_assets.asset_name']) {
        await Fetch(
          'family-assets',
          {
            method: 'post',
            data: {
              family_member_id: req.params.id,
              asset_name: product,
            },
          },
        );
      }
    }

    res.send(data);
  }
}

export default new FamilyMembersController;
