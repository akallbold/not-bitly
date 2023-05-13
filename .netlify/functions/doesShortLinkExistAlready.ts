import { Handler } from '@netlify/functions'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

const handler: Handler = async (event) => {
  if(event.body) {
    const bitlyId = JSON.parse(event.body)
    const doesIdAlreadyExist = await prisma.sites.findFirst({
      where: {
        id: bitlyId,
      },
    });
    if (doesIdAlreadyExist){
      return {
        statusCode: 200,
        body: JSON.stringify({exists: true})
      };  
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({exists: false})
    };  
  }

  return {
    statusCode: 500
  };
}


export { handler }

