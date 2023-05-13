import { Handler } from '@netlify/functions'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();



const handler: Handler = async (event) => {
  if(event.body) {
    const shortUrl = JSON.parse(event.body) 
    const bitlyData = await prisma.sites.findFirst({
      where: {
        id: BigInt(shortUrl.id),
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(bitlyData)
    };
  }

  return {
    statusCode: 500
  };
}


export { handler }

