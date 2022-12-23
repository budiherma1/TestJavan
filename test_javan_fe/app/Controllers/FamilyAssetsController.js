import { Fetch } from '@averoa/utilities';
import axios from 'axios';

class FamilyAssetsController {
  async index(req, res) {
    const members = (await Fetch('family-members', {
      params: {
        limit: 0,
        orderBy: 'name',
      },
    })).data.data;

    const memberData = [];
    for (const member of members) {
      memberData.push({ name: member.name, value: member.id });
    }
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

    const { data } = await axios.get('https://dummyjson.com/products?limit=200&select=id,title,price');
    let dataProducts = [];
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
        name: 'Asset',
        value: 'asset_name',
        filter: { name: 'asset_name:ilike', component: 'components/table/filter/text' },
        insert: {
          required: true, name: 'asset_name', component: 'components/table/insert/select', options: dataProducts,
        },
        edit: {
          required: true, name: 'asset_name', component: 'components/table/edit/select', options: dataProducts,
        },
      },
      {
        name: 'Asset Price',
        value: 'price',
        // filter: { name: 'family_members.name:ilike', component: 'components/table/filter/text' },
        // insert: { required: true, name: 'name', component: 'components/table/insert/text' },
        // edit: { required: true, name: 'name', component: 'components/table/edit/text' },
      },
      {
        name: 'User',
        value: 'family_members.name',
        filter: { name: 'family_member_id', component: 'components/table/filter/select', options: memberData },
        insert: {
          required: true, name: 'family_member_id', component: 'components/table/insert/select', options: memberData,
        },
        edit: {
          required: true, name: 'family_member_id', component: 'components/table/edit/select', options: memberData,
        },
      },
    ];

    const datePickerData = [];
    const ckEditorData = [];
    const isTagify = true;

    res.render('template', {
      titleHeader: 'Family Assets',
      menu: 'Family Assets',
      titleInsert: 'Family Asset',
      imgPath: 'family-assets',
      columns,
      datePickerData,
      ckEditorData,
      selectTagify,
      isTagify,
      tagifyName: 'family_assets.asset_name',
      ckEditor: true,
      user: req.session.user,
      fetchUrl: `${process.env.APP_DOMAIN}family-assets/fetch`,
      deleteUrl: `${process.env.APP_DOMAIN}family-assets/delete`,
      addUrl: `${process.env.APP_DOMAIN}family-assets/add`,
      editUrl: `${process.env.APP_DOMAIN}family-assets/edit`,
    });
  }

  async fetch(req, res) {
    const filter = req.body.filter ?? {};
    const searchAll = req.body.searchAll ? { 'asset_name|family_members.name:ilike': `%${req.body.searchAll}%` } : {};

    let order = {};
    if (req.body.order) {
      order = { [req.body.order[0].dir == 'asc' ? 'orderBy' : 'orderByDesc']: req.body.order[0].column };
    }

    const { start, length } = req.body;
    const { data } = await Fetch('family-assets', {
      params: {
        $relations: '[family_members]',
        'family_assets.deleted_at:isNull': true,
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
        const fetchExternal = await axios.get(`https://dummyjson.com/products/search?q=${v.asset_name}&limit=1`);
        v.price = fetchExternal?.data?.products[0]?.price ?? 0;
        return v;
      }));
    } else {
      result.data = [];
    }
    res.send(result);
  }

  async fetchOne(req, res) {
    const { data } = await Fetch(
      `family-assets/${req.params.id}`,
      {
        method: 'get',
      },
    );
    res.send(data);
  }

  async delete(req, res) {
    const { data } = await Fetch(
      `family-assets/${req.body.id}`,
      {
        method: 'delete',
      },
    );

    res.send(data);
  }

  async add(req, res) {
    const { data } = await Fetch(
      'family-assets',
      {
        method: 'post',
        data: req.body,
      },
    );

    res.send(data);
  }

  async edit(req, res) {
    const { data } = await Fetch(
      `family-assets/${req.params.id}`,
      {
        method: 'put',
        data: req.body,
      },
    );

    res.send(data);
  }
}

export default new FamilyAssetsController;
