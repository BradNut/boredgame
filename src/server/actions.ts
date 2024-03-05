function isNumber(str: string): boolean {
  if (typeof str !== 'string') {
    return false;
  }

  if (str.trim() === '') {
    return false;
  }

  return !Number.isNaN(Number(str));
}

function convertToBoolean(input: string): boolean | undefined {
  try {
    return JSON.parse(input.toLowerCase());
  } catch (e) {
    return undefined;
  }
}

export async function getFormDataObject(request: Request): Promise<{ [key: string]: string }> {
  const formData = await request.formData();
  let data = formData.entries();
  var obj = data.next();
  var retrieved: any = {};
  while (undefined !== obj.value) {
    retrieved[obj.value[0]] = obj.value[1];
    obj = data.next();
  }
  return retrieved;
}

export async function getFormData<T>(request: Request, schema: any): T {
  const data = await getFormDataObject(request);
  return transformFormDataTypes<T>(data, schema);
}

// TODO: Modify this as schema refers to a JSON schema helper

export function transformFormDataTypes<T>(data, schema): T {
  for (const property in data) {
    if (isNumber(schema[property])) {
      data[property] = parseInt(data[property]);
    } else if (typeof convertToBoolean(schema[property]) === boolean) {
      data[property] = convertToBoolean(schema[property]); // data[property] === 'true';
    } else if (Array.isArray(JSON.parse(schema[property]))) {
      data[property] = JSON.parse(schema[property]);
    }
  }
  return data;
}

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