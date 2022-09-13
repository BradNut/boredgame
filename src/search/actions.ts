interface Actions {
  [key: string]: any // Action
}

export const Games: Actions = {
  search: async function search({ request, locals }): Promise<any> {

  }
  // create: async function create({ request, locals }): Promise<any> {
  //   const data = await getFormDataObject<any>(request);
  //   return data;
  // }
}