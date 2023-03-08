const axios = require("axios");
async function update(key,value){
if (!key || !value) throw new Error('Need key & value!')  
if (!process.env.KOYEB_API_KEY) throw new Error('Koyeb API Key not found!')  
const config = {
    headers: { Authorization: `Bearer ${process.env.KOYEB_API_KEY}` }
};
try {
var dep = await axios.get( 
  'https://app.koyeb.com/v1/deployments',
  config
);
var env = dep.data.deployments[0].definition.env
let matched = env.filter(e=>e.key===key)
if (matched.length){
  if (key!=="UPDATER" && env[env.indexOf(matched[0])]['value']==value) return true;
  env[env.indexOf(matched[0])]['value']=value
  } else {
  env.push({scopes:env[0].scopes,key,value})
}
const result = await axios.patch( 
  'https://app.koyeb.com/v1/services/'+dep.data.deployments[0].service_id,
  {"definition":dep.data.deployments[0].definition},
  config
);
return true;
} catch (error) {
throw (error.message)
}
}
module.exports = {update}