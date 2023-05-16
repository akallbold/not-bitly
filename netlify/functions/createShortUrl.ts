import { Handler } from '@netlify/functions'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();


const handler: Handler = async (event, context) => {
  if(event.body) {
    const urlData = JSON.parse(event.body) 
    const response = await prisma.sites.create(
      {
        data: {
        id: urlData.newShortUrlId,
        longUrl: urlData.fullUrl
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response)
    };
  } 
  return {
    statusCode: 500
  };
}


export { handler


}

