const axios = require('axios');
  const cheerio = require('cheerio');
  const qs = require('qs');
  
  const youtube = {
    getData: async (videoUrl) => {
      const config = {
        method: 'GET',
        url: `https://ytconvert.pro/button/?url=${encodeURIComponent(videoUrl)}`,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,/;q=0.8',
          'Accept-Language': 'id-ID',
          'Upgrade-Insecure-Requests': '1',
          'Referer': 'https://ytconvert.pro/en24/',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'same-origin',
          'Sec-Fetch-Site': 'same-origin',
          'Priority': 'u=4',
          'Cookie': 'PHPSESSID=r1a0kjve8mq8tr4v9ik04cft8i; _ga_PQPFKL0J3L=GS1.1.1732027732.1.0.1732027732.0.0.0; _ga=GA1.1.1621456882.1732027733',
        },
      };
  
      try {
        const response = await axios.request(config);
        return response.data;
      } catch (error) {
        console.error('Error fetching YouTube conversion:', error);
        throw error;
      }
    },
  
    audioJob: async (videoUrl) => {
      const html = await youtube.getData(videoUrl);
      const $ = cheerio.load(html);
      const tokenId = $('button#dlbutton').data('token_id');
      const tokenValidTo = $('button#dlbutton').data('token_validto');
      const convert = 'gogogo';
      const title = $('button#dlbutton div').text().trim();
  
      let data = qs.stringify({
        url: videoUrl,
        convert: convert,
        token_id: tokenId,
        token_validto: tokenValidTo,
      });
  
      let postConfig = {
        method: 'POST',
        url: 'https://ytconvert.pro/convert/',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
          'Accept': 'application/json, text/javascript, /; q=0.01',
          'Accept-Language': 'id-ID',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Referer': `https://ytconvert.pro/button/?url=${encodeURIComponent(videoUrl)}`,
          'X-Requested-With': 'XMLHttpRequest',
          'Origin': 'https://ytconvert.pro',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
          'Priority': 'u=0',
          'Cookie': 'PHPSESSID=r1a0kjve8mq8tr4v9ik04cft8i; _ga_PQPFKL0J3L=GS1.1.1732027732.1.0.1732027732.0.0.0; _ga=GA1.1.1621456882.1732027733',
        },
        data: data,
      };
  
      try {
        const postResponse = await axios.request(postConfig);
        const jobid = postResponse.data.jobid;
        
      
  

      async function song(id_s){
     for(let i =0; i<10;i++){
      const result = await youtube.getLinks(id_s);
      if(result.data?.dlurl) return result.data.dlurl;
      await new Promise(resolve => setTimeout(resolve, 15000)); 
     }
}
let bx = await song(jobid)

        return {
          success: true,
          title: title,
          song: bx,
        };
        
      } catch (error) {
      	
            if(error.error.includes("job expired")){
      	
    console.log('Job expired. Retrying conversion...');
        await new Promise(resolve => setTimeout(resolve, 5000)); // wait for 5 seconds
        return await youtube.audioJob(videoUrl, retryCount + 1); // Retry the conversion with a new request
  
     
}
        console.error('Error during conversion:', error);
        throw error;
      }
    },
  
    getLinks: async (jobid) => {
      const time = Date.now();
      const config = {
        method: 'GET',
        url: `https://ytconvert.pro/convert/?jobid=${jobid}&time=${time}`,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
          'Accept': 'application/json, text/javascript, /; q=0.01',
          'Accept-Language': 'id-ID',
          'Referer': `https://ytconvert.pro/button/?url=https://www.youtube.com/watch?v=P-P7NVn4vbQ?`,
          'X-Requested-With': 'XMLHttpRequest',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
          'Cookie': 'PHPSESSID=r1a0kjve8mq8tr4v9ik04cft8i; _ga_PQPFKL0J3L=GS1.1.1732027732.1.0.1732027732.0.0.0; _ga=GA1.1.1621456882.1732027733',
        },
      };
  
      try {
        const response = await axios.request(config);
        
        return response 
        
        return response.data
      } catch (error) {
        console.error('Error checking conversion status:', error);
        throw error;
      }
    },
  
    download: async (url) => {
      try {
        const data = await youtube.audioJob(url);
        return data;
      } catch (error) {
        return error;
      }
    },
  };
  
module.exports = { youtube }